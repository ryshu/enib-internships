import { IInternshipEntity } from './internship';

declare interface IBusinessEntity {
    id?: number;

    name: string;
    country: string;
    city: string;
    postalCode: string;
    address: string;
    additional?: string;

    internships?: IInternshipEntity[];

    createdAt?: Date;
    updatedAt?: Date;
}
