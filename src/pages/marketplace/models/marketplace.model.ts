
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string;
  price: {
    base: number;
    storagePerGB: number;
    ramPerGB: number;
    bandwidthPerTB: number;
    pricePerCore: number;
  };
  osOptions: string[];
  rating: number;
  reviews: number;
  provider?: string;
  downloads?: number;
  fortified?: boolean;
  badge?: 'spotlight' | 'bestseller';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
