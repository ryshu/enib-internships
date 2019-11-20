import { IInternshipTypeEntity } from './internship.type';

declare interface IStudentEntity {
    id?: number;

    firstName: string;
    lastName: string;
    email: string;
    semester: string;

    internships?: IInternshipTypeEntity[];

    createdAt?: Date;
    updatedAt?: Date;
}
