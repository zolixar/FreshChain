export interface Batch {
  batchId: number;
  productName: string;
  quantity: number;
  producer: string;
  transporter: string;
  distributor: string;
  retailer: string;
  currentOwner: string;
  arrived: boolean;
  passedInspection: boolean;
}

export interface SensorData {
  temperature: number;
  humidity: number;
  location: string;
  timestamp: number;
}

export interface UserRoles {
  isOwner: boolean;
  isProducer: boolean;
  isTransporter: boolean;
  isDistributor: boolean;
  isRetailer: boolean;
}

export type Role = 'admin' | 'producer' | 'transporter' | 'distributor' | 'retailer' | 'customer';
