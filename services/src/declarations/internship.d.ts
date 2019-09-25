declare interface IInternshipEntity {
    id?: number;

    // Data
    subject: string;
    description: string;

    // Localisation
    country: string;
    city: string;
    address: string;
    additional?: string;

    // State
    isLanguageCourse: boolean;
    isValidated: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
