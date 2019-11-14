declare interface ICampaignEntity {
    id?: number;

    name: string;
    description: string;

    semester: string;
    maxProposition: number;

    isPublish: boolean;

    startAt: number;
    endAt: number;

    createdAt?: Date;
    updatedAt?: Date;
}
