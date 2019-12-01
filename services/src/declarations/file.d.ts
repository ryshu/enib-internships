import { IInternshipEntity } from './internship';

declare interface IFileEntity {
    id?: number;

    name: string;
    type: string;
    path: string;

    internship?: IInternshipEntity;

    createdAt?: Date;
    updatedAt?: Date;
}
