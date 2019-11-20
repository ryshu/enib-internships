import { FindOptions, Includeable } from 'sequelize';
import { cloneDeep } from 'lodash';

export function extractCount(opts: FindOptions, include?: Includeable[]): FindOptions {
    return { where: cloneDeep(opts.where), include: include || [] };
}