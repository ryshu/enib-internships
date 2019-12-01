export declare const enum INTERNSHIP_RESULT {
    VALIDATED = 'validated',
    NON_VALIDATED = 'non-validated',
    UNKNOWN = 'unknown',
    CANCELED = 'canceled',
}

export const InternshipsResult: INTERNSHIP_RESULT[] = [
    INTERNSHIP_RESULT.VALIDATED,
    INTERNSHIP_RESULT.NON_VALIDATED,
    INTERNSHIP_RESULT.UNKNOWN,
    INTERNSHIP_RESULT.CANCELED,
];

export function isInternshipResult(str: string): str is INTERNSHIP_RESULT {
    return InternshipsResult.includes(str as INTERNSHIP_RESULT);
}
