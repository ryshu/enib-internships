import { IStudentEntity } from '../../declarations';

import { checkPartialStudent } from '../../utils/check';

export function fullCopyStudent(data: Partial<IStudentEntity>): IStudentEntity | undefined {
    if (checkPartialStudent(data)) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.fullName,
            email: data.email,
            semester: data.semester,
        };
    } else {
        return undefined;
    }
}
