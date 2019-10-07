"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenAuth = (req, res, next) => {
    const accessToken = req.header('X-Access-Token');
    if (!accessToken) {
        return res.status(401).json({
            code: 500,
            messaege: 'Invalid Access Token',
        });
    }
    next();
};
//# sourceMappingURL=security.js.map