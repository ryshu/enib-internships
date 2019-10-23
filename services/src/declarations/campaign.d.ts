declare interface ICampaignEntity {
    id?: number;

    name: string;
    description: string;
    startAt: number;
    endAt: number;
    semester: string;
    maxProposition: number;

    createdAt?: Date;
    updatedAt?: Date;
}
