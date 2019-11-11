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

export declare interface IInternship {
  id?: number;

  subject: string;
  description: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  additional?: string;

  isInternshipAbroad: boolean;
  isValidated: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export declare interface IStudent {
  id?: number;

  firstName: string;
  lastName: string;
  email: string;
  semester: string;

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
  role: string;
}

export declare interface IMentor {
  id?: number;

  firstName: string;
  lastName: string;
  email: string;

  createdAt?: string;
  updatedAt?: string;
}

export declare interface ICampaigns {
  id?: number;

  name: string;
  description: string;
  semester: string;
  maxProposition: number;

  startAt: number;
  endAt: number;

  createdAt?: string;
  updatedAt?: string;
}

export declare interface IFile {
  id?: number;

  name: string;
  type: string;
  path: string;

  createdAt?: Date;
  updatedAt?: Date;
}
