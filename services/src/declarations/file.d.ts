declare interface IFileEntity {
    id?: number;

    name: string;
    size: number;
    type: string;
    path: string;

    createdAt?: Date;
    updatedAt?: Date;
}
