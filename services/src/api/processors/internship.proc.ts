import { IInternshipEntity } from '../../declarations';

import { checkPartialInternship } from '../../utils/check';

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
            isInternshipAbroad: data.isInternshipAbroad,
            isValidated: data.isValidated,
            isProposition: data.isProposition,
            isPublish: data.isPublish,
            state: data.state,

            // Date
            publishAt: data.publishAt,
            startAt: data.startAt,
            endAt: data.endAt,
        };
    } else {
        return undefined;
    }
}
