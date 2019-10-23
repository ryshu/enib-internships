import { FindOptions } from 'sequelize';

export function paginate(opts: { page: number; limit: number }, filter?: FindOptions): FindOptions {
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
