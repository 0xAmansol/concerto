import { create } from 'zustand';
import { PriceData } from '../types';

interface PriceStore {
  prices: Record<string, PriceData[]>;
  addPrice: (price: PriceData) => void;
}

export const usePriceStore = create<PriceStore>((set) => ({
  prices: {},
  addPrice: (price) => set((state) => ({
    prices: {
      ...state.prices,
      [price.id]: [...(state.prices[price.id] || []), price]
    }
  }))
}));

export class WebSocketClient {
  private ws: WebSocket | null = null;
  
  constructor(url: string) {
    if (typeof window !== 'undefined') {
      this.connect(url);
    }
  }

  private connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      usePriceStore.getState().addPrice(data);
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connect(url), 5000);
    };
  }
}