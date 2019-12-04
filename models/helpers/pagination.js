"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginate(opts, filter) {
    const offset = (Number(opts.page) - 1) * Number(opts.limit);
    const add = filter ? filter : {};
    if (Number(opts.page) > 0 && Number(opts.limit) !== 0) {
        return Object.assign({ limit: Number(opts.limit), offset }, add);
    }
    else {
        return add;
    }
}
exports.paginate = paginate;
//# sourceMappingURL=pagination.js.map