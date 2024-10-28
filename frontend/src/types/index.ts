export interface PriceData {
    id: string;
    platform: string;
    price: number;
    eventName: string;
    eventDate: string;
    url: string;
    timestamp: string;
  }
  
  export interface Event {
    id: string;
    name: string;
    date: string;
    venue: string;
  }