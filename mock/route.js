"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api = __importStar(require("./api"));
const router = express_1.default.Router();
router.get('/roles', api.getRoles);
router.get('/routes', api.getRoutes);
router.get('/users', api.getUsers);
router.get('/users/:username', api.getUserByName);
router.post('/users/login', api.login);
router.post('/users/logout', api.logout);
router.post('/users/info', api.getUserInfo);
router.put('/roles/:id', api.updateRole);
router.put('/users/:username', api.updateUser);
router.delete('/roles/:id', api.deleteRole);
router.delete('/users/:username', api.deleteUser);
exports.default = router;
//# sourceMappingURL=route.js.map