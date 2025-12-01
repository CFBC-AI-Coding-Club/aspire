

export type WebSocketMessageType =
  | 'WELCOME'
  | 'MARKET_UPDATE'
  | 'STOCK_UPDATE'
  | 'TRADE_EXECUTED'
  | 'PRICE_CHANGE'
  | 'ERROR'
  | 'PING'
  | 'PONG'
  | 'SUBSCRIBE'
  | 'SUBSCRIBED';

export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  data?: T;
  timestamp?: string;
  error?: string;
}

export interface MarketUpdateData {
  stocks: Array<{
    ticker: string;
    price: number;
    change: number;
    volume: number;
    lastTradeDate?: string | null;
  }>;
}

export interface StockUpdateData {
  ticker: string;
  price: number;
  change: number;
  volume: number;
  lastTradeDate?: string | null;
}

export interface TradeExecutedData {
  userId: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface PriceChangeData {
  ticker: string;
  oldPrice: number;
  newPrice: number;
  change: number;
  changePercent: number;
}

export interface WebSocketUser {
  id: string;
  role: string;
  subscriptions?: string[]; // Array of stock tickers user is subscribed to
}