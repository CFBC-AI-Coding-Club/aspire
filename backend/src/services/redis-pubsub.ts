import Redis from 'ioredis';
import type {
  MarketUpdateData,
  StockUpdateData,
  TradeExecutedData,
  PriceChangeData,
} from '../types/websocket';


const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export const REDIS_CHANNELS = {
  MARKET_UPDATE: 'market:update',
  STOCK_UPDATE: 'stock:update',
  TRADE_EXECUTED: 'trade:executed',
  PRICE_CHANGE: 'price:change',
} as const;

let publisherConnected = false;
let subscriberConnected = false;

async function ensurePublisherConnected() {
  if (!publisherConnected) {
    try {
      await publisher.connect();
      publisherConnected = true;
      console.log('✓ Redis publisher connected');
    } catch (error) {
      console.error('Redis publisher connection failed:', error);
      throw error;
    }
  }
}

async function ensureSubscriberConnected() {
  if (!subscriberConnected) {
    try {
      await subscriber.connect();
      subscriberConnected = true;
      console.log('✓ Redis subscriber connected');
    } catch (error) {
      console.error('Redis subscriber connection failed:', error);
      throw error;
    }
  }
}

publisher.on('error', (err) => {
  console.error('Redis publisher error:', err);
  publisherConnected = false;
});

subscriber.on('error', (err) => {
  console.error('Redis subscriber error:', err);
  subscriberConnected = false;
});

publisher.on('ready', () => {
  console.log('✓ Redis publisher ready');
  publisherConnected = true;
});

subscriber.on('ready', () => {
  console.log('✓ Redis subscriber ready');
  subscriberConnected = true;
});

export async function publishMarketUpdate(data: MarketUpdateData): Promise<void> {
  try {
    await ensurePublisherConnected();
    await publisher.publish(
      REDIS_CHANNELS.MARKET_UPDATE,
      JSON.stringify({ type: 'MARKET_UPDATE', data, timestamp: new Date().toISOString() }),
    );
  } catch (error) {
    console.error('Failed to publish market update:', error);
  }
}

export async function publishStockUpdate(data: StockUpdateData): Promise<void> {
  try {
    await ensurePublisherConnected();
    await publisher.publish(
      REDIS_CHANNELS.STOCK_UPDATE,
      JSON.stringify({ type: 'STOCK_UPDATE', data, timestamp: new Date().toISOString() }),
    );
  } catch (error) {
    console.error('Failed to publish stock update:', error);
  }
}

export async function publishTradeExecuted(data: TradeExecutedData): Promise<void> {
  try {
    await ensurePublisherConnected();
    await publisher.publish(
      REDIS_CHANNELS.TRADE_EXECUTED,
      JSON.stringify({ type: 'TRADE_EXECUTED', data, timestamp: new Date().toISOString() }),
    );
  } catch (error) {
    console.error('Failed to publish trade executed:', error);
  }
}

export async function publishPriceChange(data: PriceChangeData): Promise<void> {
  try {
    await ensurePublisherConnected();
    await publisher.publish(
      REDIS_CHANNELS.PRICE_CHANGE,
      JSON.stringify({ type: 'PRICE_CHANGE', data, timestamp: new Date().toISOString() }),
    );
  } catch (error) {
    console.error('Failed to publish price change:', error);
  }
}

export async function subscribeToMarketUpdates(
  callback: (channel: string, message: string) => void,
): Promise<void> {
  try {
    await ensureSubscriberConnected();
    
    const channels = Object.values(REDIS_CHANNELS);
    await subscriber.subscribe(...channels);
    
    subscriber.on('message', (channel, message) => {
      callback(channel, message);
    });
    
    console.log(` Subscribed to Redis channels: ${channels.join(', ')}`);
  } catch (error) {
    console.error('Failed to subscribe to market updates:', error);
    throw error;
  }
}

export async function closeRedisConnections() {
  await publisher.quit();
  await subscriber.quit();
  console.log('Redis connections closed');
}

export { publisher, subscriber };