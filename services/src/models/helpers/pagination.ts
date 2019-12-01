import { FindOptions } from 'sequelize';

export interface PaginateOpts {
    page: number;
    limit: number;
}

export function paginate(opts: PaginateOpts, filter?: FindOptions): FindOptions {
    const offset = (Number(opts.page) - 1) * Number(opts.limit);
    const add = filter ? filter : {};
    if (Number(opts.page) > 0 && Number(opts.limit) !== 0) {
        return {
            limit: Number(opts.limit),
            offset,
            ...add,
        };
    } else {
        return add;
    }
}
