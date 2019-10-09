export declare interface IBusiness {
  id?: number;

  name: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  additional?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IRoleData {
  key: string;
  name: string;
  description: string;
  routes: any;
}

export interface ITransactionData {
  orderId: string;
  timestamp: string | number;
  username: string;
  price: number;
  status: string;
}

export interface IUserData {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  introduction: string;
  roles: string[];
}

export declare interface ICampaigns {
  id?: number;

  name: string;
  startAt: number;
  endAt: number;
  semester: string;
  maxProposition: number;

  createdAt?: string;
  updatedAt?: string;
}
