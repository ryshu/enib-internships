import { IInternshipEntity } from './internship';

declare interface IStudentEntity {
    id?: number;

    firstName: string;
    lastName: string;
    email: string;
    semester: string;

    internships?: IInternshipEntity[];

    createdAt?: Date;
    updatedAt?: Date;
}
