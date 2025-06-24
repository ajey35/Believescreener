export interface TokenProfile {
  tokenAddress: string;
  icon?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
  description?: string;
  links?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  chainId: string;
}

export interface TokenData {
  baseToken: {
    chainId: string;
    name: string;
    symbol: string;
    address: string;
  };
  priceUsd?: string;
  volume?: {
    h24: number;
  };
  priceChange?: {
    h24: number;
  };
  liquidity?: {
    usd: number;
  };
  txns?: {
    h24: {
      buys: number;
      sells: number;
    };
  };
  marketCap?: number;
  info: {
    imageUrl: string;
  };
}

export interface Token {
  tokenAddress: string;
  name: string;
  symbol: string;
  price: string;
  priceChange24h: number;
  marketCap: string;
  volume24h: number;
  liquidity: number;
  transactions24h: number;
  icon?: string;
  description?: string;
  links?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  priceChange?: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
}