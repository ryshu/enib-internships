declare type MentorRole = 'default' | 'admin';

declare interface IMentorEntity {
    id?: number;

    firstName: string;
    lastName: string;
    email: string;
    role: MentorRole;

    createdAt?: Date;
    updatedAt?: Date;
}
