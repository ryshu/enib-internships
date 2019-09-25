declare interface IStudentEntity {
    id?: number;

    firstName: string;
    lastName: string;
    email: string;
    semester: string;

    createdAt?: Date;
    updatedAt?: Date;
}
