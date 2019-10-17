declare interface IInternshipEntity {
    id?: number;

    // Data
    subject: string;
    description: string;

    // Localisation
    country: string;
    city: string;
    postalCode: string;
    address: string;
    additional?: string;

    // State
    isInternshipAbroad: boolean;
    isValidated: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
