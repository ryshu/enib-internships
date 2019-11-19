export declare interface Statistics {
    internships: {
        total: number;
        suggested: number;
        waiting: number;
        availables: number;
        attributed: number;
        validated: number;
        archived: number;
    };

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

export declare const enum INTERNSHIP_MODE {
    SUGGESTED = 'suggest',
    WAITING = 'waiting',
    AVAILABLE = 'available',
    IN_ATTRIBUTION = 'in_attribution',
    ATTRIBUTED = 'attributed',
    VALIDATED = 'validated',
    ARCHIVED = 'archived',
}

export const InternshipsMode: INTERNSHIP_MODE[] = [
    INTERNSHIP_MODE.SUGGESTED,
    INTERNSHIP_MODE.WAITING,
    INTERNSHIP_MODE.AVAILABLE,
    INTERNSHIP_MODE.ATTRIBUTED,
    INTERNSHIP_MODE.VALIDATED,
    INTERNSHIP_MODE.ARCHIVED,
];

export function isInternshipMode(str: string): str is INTERNSHIP_MODE {
    return InternshipsMode.includes(str as INTERNSHIP_MODE);
}
