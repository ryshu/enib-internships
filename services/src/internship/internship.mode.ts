export declare const enum INTERNSHIP_MODE {
    WAITING = 'waiting',
    PUBLISHED = 'published',
    ATTRIBUTED_STUDENT = 'attributed_student',
    AVAILABLE_CAMPAIGN = 'available_campaign',
    ATTRIBUTED_MENTOR = 'attributed_mentor',
    RUNNING = 'running',
    VALIDATION = 'validation',
    ARCHIVED = 'archived',
}

export const InternshipsMode: INTERNSHIP_MODE[] = [
    INTERNSHIP_MODE.WAITING,
    INTERNSHIP_MODE.PUBLISHED,
    INTERNSHIP_MODE.ATTRIBUTED_STUDENT,
    INTERNSHIP_MODE.AVAILABLE_CAMPAIGN,
    INTERNSHIP_MODE.ATTRIBUTED_MENTOR,
    INTERNSHIP_MODE.RUNNING,
    INTERNSHIP_MODE.VALIDATION,
    INTERNSHIP_MODE.ARCHIVED,
];

export function isInternshipMode(str: string): str is INTERNSHIP_MODE {
    return InternshipsMode.includes(str as INTERNSHIP_MODE);
}
