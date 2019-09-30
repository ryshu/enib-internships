import { FindOptions } from 'sequelize';

export function paginate(opts: { page: number; limit: number }): FindOptions {
    const offset = (Number(opts.page) - 1) * Number(opts.limit);
    if (Number(opts.page) > 0 && Number(opts.limit) !== 0) {
        return {
            limit: Number(opts.limit),
            offset,
            where: {},
        };
    } else {
        return {};
    }
}
