import { Linking } from 'react-native';
import { getProductById } from '../data/dummyProducts';

export interface DeepLinkAction {
  type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'NAVIGATE';
  productId?: string;
  route?: string;
  params?: any;
  timestamp: number;
}

export interface ParsedDeepLink {
  success: boolean;
  action?: DeepLinkAction;
  error?: string;
  url: string;
}

class DeepLinkHandler {
  private pendingActions: DeepLinkAction[] = [];
  private isInitialized = false;

  // Parse URL dan ekstrak action
  parseDeepLink(url: string): ParsedDeepLink {
    try {
      console.log('🔗 Parsing deep link:', url);
      
      // Normalize URL
      const normalizedUrl = url.toLowerCase().trim();
      
      // Parse add-to-cart action
      if (normalizedUrl.includes('add-to-cart')) {
        const productId = this.extractProductId(url, 'add-to-cart');
        if (!productId) {
          return {
            success: false,
            error: 'Invalid product ID in URL',
            url
          };
        }
        
        // Validasi product exists
        const product = getProductById(productId);
        if (!product) {
          return {
            success: false,
            error: `Product with ID ${productId} not found`,
            url
          };
        }

        return {
          success: true,
          action: {
            type: 'ADD_TO_CART',
            productId,
            timestamp: Date.now()
          },
          url
        };
      }

      // Parse remove-from-cart action
      if (normalizedUrl.includes('remove-from-cart')) {
        const productId = this.extractProductId(url, 'remove-from-cart');
        if (!productId) {
          return {
            success: false,
            error: 'Invalid product ID in URL',
            url
          };
        }

        return {
          success: true,
          action: {
            type: 'REMOVE_FROM_CART',
            productId,
            timestamp: Date.now()
          },
          url
        };
      }

      // Default navigation action
      return {
        success: true,
        action: {
          type: 'NAVIGATE',
          route: this.extractRoute(url),
          params: this.extractParams(url),
          timestamp: Date.now()
        },
        url
      };

    } catch (error: any) {
      console.error('Deep link parsing error:', error);
      return {
        success: false,
        error: error.message || 'Failed to parse deep link',
        url
      };
    }
  }

  // Extract product ID dari URL
  private extractProductId(url: string, action: string): string | null {
    const regex = new RegExp(`${action}/([^/?]+)`);
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Extract route dari URL
  private extractRoute(url: string): string {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.replace(/\//g, '');
      return path || 'home';
    } catch {
      return 'home';
    }
  }

  // Extract parameters dari URL
  private extractParams(url: string): any {
    try {
      const urlObj = new URL(url);
      const params: any = {};
      
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      return params;
    } catch {
      return {};
    }
  }

  // Tambah action ke pending queue
  addPendingAction(action: DeepLinkAction): void {
    this.pendingActions.push(action);
    console.log(`📥 Added pending action: ${action.type}`, action);
  }

  // Get semua pending actions
  getPendingActions(): DeepLinkAction[] {
    return [...this.pendingActions];
  }

  // Clear pending actions
  clearPendingActions(): void {
    this.pendingActions = [];
    console.log('🧹 Cleared all pending actions');
  }

  // Remove specific action
  removePendingAction(timestamp: number): void {
    this.pendingActions = this.pendingActions.filter(
      action => action.timestamp !== timestamp
    );
  }

  // Handle URL langsung (untuk warm start)
  async handleUrl(url: string): Promise<ParsedDeepLink> {
    const result = this.parseDeepLink(url);
    
    if (result.success && result.action) {
      // Untuk cart actions, simpan sebagai pending
      if (result.action.type === 'ADD_TO_CART' || result.action.type === 'REMOVE_FROM_CART') {
        this.addPendingAction(result.action);
      }
    }
    
    return result;
  }

  // Initialize deep link listener
  initialize(): () => void { // ✅ FIXED: Return cleanup function
    if (this.isInitialized) return () => {};

    // Handle initial URL (cold start)
    Linking.getInitialURL().then((url: string | null) => {
      if (url) {
        console.log('🚀 Initial deep link:', url);
        this.handleUrl(url);
      }
    }).catch(console.error);

    // Handle URL changes (warm start)
    const subscription = Linking.addEventListener('url', ({ url }: { url: string }) => {
      console.log('🔄 Deep link received (warm start):', url);
      this.handleUrl(url);
    });

    this.isInitialized = true;
    console.log('✅ Deep link handler initialized');
    
    // Cleanup function
    return () => {
      subscription.remove();
      this.isInitialized = false;
    };
  }
}

// Singleton instance
export const deepLinkHandler = new DeepLinkHandler();