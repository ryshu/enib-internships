import { IFileEntity } from 'src/declarations';

import { checkPartialFile } from '../../utils/check';

export function fullCopyFile(data: Partial<IFileEntity>): IFileEntity | undefined {
    if (checkPartialFile(data)) {
        return {
            name: data.name,
            type: data.type,
            path: data.path,
        };
    } else {
        return undefined;
    }
}
