declare interface IFileEntity {
    id?: number;

    name: string;
    type: string;
    path: string;

    createdAt?: Date;
    updatedAt?: Date;
}
