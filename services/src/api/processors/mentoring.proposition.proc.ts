import { IMentoringPropositionEntity } from '../../declarations';

import { checkPartialProposition } from '../../utils/check';

export function fullCopyMentoringProposition(
    data: Partial<IMentoringPropositionEntity>,
): IMentoringPropositionEntity | undefined {
    if (checkPartialProposition(data)) {
        return { comment: data.comment };
    } else {
        return undefined;
    }
}
