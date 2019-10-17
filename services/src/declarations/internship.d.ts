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
    isLanguageCourse: boolean;
    isValidated: boolean;

    // Date
    startAt: number;
    endAt: number;

    createdAt?: Date;
    updatedAt?: Date;
}
