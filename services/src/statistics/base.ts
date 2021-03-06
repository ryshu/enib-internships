import { INTERNSHIP_MODE } from '../internship';

export declare interface Statistics {
    internships: Record<INTERNSHIP_MODE | 'abroad' | 'total', number>;

    students: number;
    mentors: number;

    propositions: number;
}

export declare interface CampaignStatistics {
    internships: {
        total: number;
        availables: number;
        attributed: number;
    };

    students: number;
    mentors: number;

    propositions: number;
    campaign: number;
}
