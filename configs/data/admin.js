"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admins = [
    {
        firstName: 'Oscar',
        lastName: 'Marie--Taillefer',
        email: 'o5mariet@enib.fr',
        role: 'admin',
    },
];
exports.adminsEmail = exports.admins.map((a) => a.email);
exports.adminsCasUsername = exports.admins.map((a) => a.email.split('@')[0]);
//# sourceMappingURL=admin.js.map