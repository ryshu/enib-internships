"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginate(opts) {
    const offset = (Number(opts.page) - 1) * Number(opts.limit);
    if (Number(opts.page) > 0 && Number(opts.limit) !== 0) {
        return {
            limit: Number(opts.limit),
            offset,
            where: {},
        };
    }
    else {
        return {};
    }
}
exports.paginate = paginate;
//# sourceMappingURL=pagination.helper.js.map