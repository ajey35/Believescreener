import { TokenProfile, TokenData, Token } from '@/types/token';

const BASE_URL = 'https://api.dexscreener.com';
const CHAIN_ID = 'solana'; // Assuming Solana for the Belive token

export const BELIVE_TOKEN_ADDRESS = 'Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk';

class TokenService {
  async getLatestTokenProfiles(page = 1, limit = 15): Promise<TokenProfile[]> {
    try {
      const response = await fetch(`${BASE_URL}/token-profiles/latest/v1`);
      const data = await response.json();
      // Take the first 'limit' tokens starting from the page offset
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return data.slice(startIndex, endIndex) || [];
    } catch (error) {
      console.error('Error fetching token profiles:', error);
      return [];
    }
  }

  async getTokenData(tokenAddress: string): Promise<TokenData | null> {
    try {
      const response = await fetch(`${BASE_URL}/tokens/v1/${CHAIN_ID}/${tokenAddress}`);
      const data = await response.json();
      if (data) {
        if (data.length > 0) {
          return data[0];
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching token data:', error);
      return null;
    }
  }

  async getEnrichedTokens(page = 1, limit = 15): Promise<Token[]> {
    try {
      let profiles: any[] = [];
      // Add Belive token as the first token on page 1
      if (page === 1) {
        profiles.push({
          tokenAddress: BELIVE_TOKEN_ADDRESS,
          description: 'The official Belive Launch Coin - powering the future of token launches',
          chainId: 'solana',
        });
        // Get profiles for remaining slots
        const additionalProfiles = await this.getLatestTokenProfiles(1, limit - 1);
        profiles = [...profiles, ...additionalProfiles];
      } else {
        profiles = await this.getLatestTokenProfiles(page, limit);
      }
      const enrichedTokens: Token[] = [];
      for (const profile of profiles) {
        const tokenData = await this.getTokenData(profile.tokenAddress);
        if (!tokenData) {
          continue;
        }
       

        // Normalize links
        let website, twitter, telegram;
        if (Array.isArray(profile.links)) {
          for (const link of profile.links) {
            const label = link.label ? link.label.toLowerCase() : '';
            const type = link.type ? link.type.toLowerCase() : '';
            if (
              label.includes('website') || type.includes('website')
            ) {
              website = link.url;
            }
            if (
              label === 'twitter' || label === 'x' || type === 'twitter' || type === 'x'
            ) {
              twitter = link.url;
            }
            if (label === 'telegram' || type === 'telegram') {
              telegram = link.url;
            }
          }
        } else if (typeof profile.links === 'object' && profile.links !== null) {
          website = profile.links.website;
          twitter = profile.links.twitter;
          telegram = profile.links.telegram;
        }

        const token: Token = {
          tokenAddress: profile.tokenAddress,
          name: tokenData?.baseToken?.symbol || 'Unknown Token',
          symbol: tokenData?.baseToken?.name || 'UNKNOWN',
          price: tokenData?.priceUsd ? `$${parseFloat(tokenData.priceUsd).toFixed(10)}` : '$0.000000',
          priceChange24h: tokenData?.priceChange?.h24 || 0,
          marketCap: this.formatMarketCap(tokenData?.marketCap || 0),
          volume24h: tokenData?.volume?.h24 || 0,
          liquidity: tokenData?.liquidity?.usd || 0,
          transactions24h: tokenData?.txns?.h24 ? (tokenData.txns.h24.buys + tokenData.txns.h24.sells) : 0,
          icon: tokenData.info?.imageUrl || profile.icon,
          description: profile.description || profile.openGraph?.description,
          links: {
            website,
            twitter,
            telegram,
          },
          priceChange: {
            m5: tokenData.priceChange && 'm5' in tokenData.priceChange ? (tokenData.priceChange as any).m5 : 0,
            h1: tokenData.priceChange && 'h1' in tokenData.priceChange ? (tokenData.priceChange as any).h1 : 0,
            h6: tokenData.priceChange && 'h6' in tokenData.priceChange ? (tokenData.priceChange as any).h6 : 0,
            h24: tokenData.priceChange && 'h24' in tokenData.priceChange ? tokenData.priceChange.h24 : 0,
          },
        };
        // Special handling for Belive token
        if (profile.tokenAddress === BELIVE_TOKEN_ADDRESS) {
          token.name = 'LAUNCHCOIN';
          token.symbol = 'Launch Coin on Believe';
          token.links = {
            website: 'https://believe.app',
            twitter: 'https://twitter.com/belive',
            telegram: 'https://t.me/belive',
          };
        }
        enrichedTokens.push(token);
      }
      return enrichedTokens;
    } catch (error) {
      console.error('Error getting enriched tokens:', error);
      return [];
    }
  }

  private formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  }

  formatVolume(volume: number): string {
    return this.formatMarketCap(volume);
  }

  formatLiquidity(liquidity: number): string {
    return this.formatMarketCap(liquidity);
  }
}

export const tokenService = new TokenService();
