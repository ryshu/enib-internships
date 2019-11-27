import { ICampaignEntity } from '../../declarations';

import { checkPartialCampaign } from '../../utils/check';

export function fullCopyCampaign(data: Partial<ICampaignEntity>): ICampaignEntity | undefined {
    if (checkPartialCampaign(data)) {
        return {
            name: data.name,
            description: data.description,

            semester: data.semester,
            maxProposition: data.maxProposition,

            isPublish: !!data.isPublish,

            startAt: Number(data.startAt),
            endAt: Number(data.endAt),
        };
    } else {
        return undefined;
    }
}
