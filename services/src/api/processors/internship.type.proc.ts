import { IInternshipTypeEntity } from '../../declarations';

import { checkPartialInternshipType } from '../../utils/check';

export function fullCopyInternshipType(
    data: Partial<IInternshipTypeEntity>,
): IInternshipTypeEntity | undefined {
    if (checkPartialInternshipType(data)) {
        return { label: data.label };
    } else {
        return undefined;
    }
}
