import { IInternshipEntity } from '../../declarations';

import { checkPartialInternship } from '../../utils/check';

import { INTERNSHIP_RESULT, INTERNSHIP_MODE } from '../../internship';

export function fullCopyInternship(
    data: Partial<IInternshipEntity>,
): IInternshipEntity | undefined {
    if (checkPartialInternship(data)) {
        return {
            // Data
            subject: data.subject,
            description: data.description,

            // Localisation
            country: data.country,
            city: data.city,
            postalCode: data.postalCode,
            address: data.address,
            additional: data.additional,

            // State
            isInternshipAbroad: !!data.isInternshipAbroad,
            state: data.state || INTERNSHIP_MODE.WAITING,
            result: data.result || INTERNSHIP_RESULT.UNKNOWN,

            // Date
            publishAt: data.publishAt,
            startAt: data.startAt,
            endAt: data.endAt,
        };
    } else {
        return undefined;
    }
}
