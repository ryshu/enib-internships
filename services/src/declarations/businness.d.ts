declare interface IBusinessEntity {
    id?: number;

    name: string;
    country: string;
    city: string;
    postalCode: string;
    address: string;
    additional?: string;

    createdAt?: Date;
    updatedAt?: Date;
}
