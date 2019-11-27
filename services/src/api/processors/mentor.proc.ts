import { IMentorEntity } from 'src/declarations';
import { checkPartialMentor } from '../../utils/check';

export function fullCopyMentor(data: Partial<IMentorEntity>): IMentorEntity | undefined {
    if (checkPartialMentor(data)) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
        };
    } else {
        return undefined;
    }
}
