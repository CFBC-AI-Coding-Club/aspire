// src/index.ts - Fixed WebSocket integration
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { startPriceCleanup } from "./jobs/cleanup-history";
import { startPriceSimulation } from "./jobs/simulate-prices";
import { apiRouter } from "./routes";
import type { ServerWebSocket } from "bun";
import { verify } from "jsonwebtoken";
import type { WebSocketMessage, WebSocketUser } from "./types/websocket";
import { subscribeToMarketUpdates } from "./services/redis-pubsub";
import db from "./services/db";
import { auth } from "./lib/auth";

const SECRET = process.env.JWT_SECRET || "secret";

const clients = new Map<ServerWebSocket<WebSocketUser>, WebSocketUser>();
let redisInitialized = false;

function initializeRedisSubscriptions() {
  if (redisInitialized) return;
  redisInitialized = true;

  subscribeToMarketUpdates((channel, message) => {
    try {
      const parsed = JSON.parse(message);
      broadcast(parsed.type, parsed.data);
    } catch (error) {
      console.error("Error parsing Redis message:", error);
    }
  });
  console.log("Redis subscriptions initialized");
}

export function broadcast(type: string, data: any) {
  const message: WebSocketMessage = {
    type: type as any,
    data,
    timestamp: new Date().toISOString(),
  };
  const msg = JSON.stringify(message);

  for (const [client, user] of clients.entries()) {
    try {
      if (type === "STOCK_UPDATE" && user.subscriptions && user.subscriptions.length > 0) {
        if (data.ticker && user.subscriptions.includes(data.ticker)) {
          client.send(msg);
        }
      } else {
        client.send(msg);
      }
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      clients.delete(client);
    }
  }
}

export function broadcastToUser(userId: string, type: string, data: any) {
  const message: WebSocketMessage = {
    type: type as any,
    data,
    timestamp: new Date().toISOString(),
  };
  const msg = JSON.stringify(message);

  for (const [client, user] of clients.entries()) {
    if (user.id === userId) {
      try {
        client.send(msg);
      } catch (error) {
        console.error("Error sending WebSocket message to user:", error);
        clients.delete(client);
      }
    }
  }
}

export const app = new Hono();

// Global middleware - MUST run before auth routes
app.use("*", logger());
app.use("*", cors());

// Better-auth routes - handle /api/auth/* requests
// Better-Auth expects internal paths like /sign-up/email, not /api/auth/sign-up/email
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  
  // Only handle /api/auth/* requests
  if (url.pathname.startsWith("/api/auth")) {
    try {
      // Better-Auth with basePath="/api/auth" expects the full path
      // But internally it strips basePath, so we need to pass the full URL
      // The handler will match routes based on basePath configuration
      const response = await auth.handler(c.req.raw);
      
      if (response) {
        return response;
      }
      
      // If no response, continue (will 404)
    } catch (error) {
      console.error("Better-auth handler error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
  
  // Continue to next middleware/route for non-auth paths
  await next();
});

app.route("/api", apiRouter);

app.get("/", (c) =>
  c.json({ status: "Aspire Backend Online 🐱" }),
);

// Background jobs
startPriceSimulation();
startPriceCleanup();

// Initialize Redis on startup
initializeRedisSubscriptions();


export default {
  port: process.env.PORT || 3000,
  
  // Main fetch handler - handles both HTTP and WebSocket upgrades
  async fetch(req: Request, server: any) {
    const url = new URL(req.url);
    
    const upgradeHeader = req.headers.get("upgrade");
    if (upgradeHeader === "websocket") {
      console.log("WebSocket upgrade request received");
      
      const token = url.searchParams.get("token") || 
                    req.headers.get("authorization")?.replace("Bearer ", "");
      
      let user: WebSocketUser = {
        id: "anonymous",
        role: "GUEST",
        subscriptions: [],
      };

      if (token) {
        try {
          const payload = verify(token, SECRET) as { id: string; role: string };
          const dbUser = await db.user.findUnique({
            where: { id: payload.id },
            select: { id: true, role: true, isActive: true },
          });

          if (dbUser && dbUser.isActive) {
            user = {
              id: dbUser.id,
              role: dbUser.role,
              subscriptions: [],
            };
            console.log(`Authenticated user: ${user.id}`);
          }
        } catch (error) {
          console.error("WebSocket auth error:", error);
        }
      }

      // Upgrade the connection
      const success = server.upgrade(req, {
        data: user,
      });

      if (success) {
        return undefined;
      }
      
      return new Response("WebSocket upgrade failed", { status: 500 });
    }
    
    return app.fetch(req, server);
  },

  websocket: {
    open(ws: ServerWebSocket<WebSocketUser>) {
      const user = ws.data;
      clients.set(ws, user);
      console.log(`WebSocket connected: ${user.id} (${user.role})`);

      const welcomeMessage: WebSocketMessage = {
        type: "WELCOME",
        data: {
          message: "Connected to Aspire Market",
          userId: user.id,
          role: user.role,
        },
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(welcomeMessage));
    },

    message(ws: ServerWebSocket<WebSocketUser>, message: string | Buffer) {
      try {
        const msg = typeof message === "string" ? message : message.toString();
        const parsed = JSON.parse(msg);

        if (parsed.type === "PING") {
          const pong: WebSocketMessage = {
            type: "PONG",
            timestamp: new Date().toISOString(),
          };
          ws.send(JSON.stringify(pong));
          return;
        }


        if (parsed.type === "SUBSCRIBE" && parsed.tickers) {
          const user = clients.get(ws);
          if (user) {
            user.subscriptions = parsed.tickers;
            const response: WebSocketMessage = {
              type: "SUBSCRIBED" as any,
              data: { tickers: parsed.tickers },
              timestamp: new Date().toISOString(),
            };
            ws.send(JSON.stringify(response));
            console.log(`User ${user.id} subscribed to: ${parsed.tickers.join(", ")}`);
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        const errorMessage: WebSocketMessage = {
          type: "ERROR",
          error: "Invalid message format",
          timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(errorMessage));
      }
    },

    close(ws: ServerWebSocket<WebSocketUser>) {
      const user = clients.get(ws);
      if (user) {
        console.log(`WebSocket disconnected: ${user.id}`);
      }
      clients.delete(ws);
    },

    drain(ws: ServerWebSocket<WebSocketUser>) {
      console.log("WebSocket backpressure cleared");
    },
  },
};