"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = [
    {
        path: '',
        component: 'Layout',
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: 'views/dashboard/index',
                name: 'Dashboard',
                meta: {
                    title: 'dashboard',
                    icon: 'dashboard',
                    affix: true,
                },
            },
        ],
    },
];
const roles = [
    {
        key: 'admin',
        name: 'admin',
        description: 'Super Administrator. Have access to view all pages.',
        routes,
    },
    {
        key: 'editor',
        name: 'editor',
        description: 'Normal Editor. Can see all pages except permission page',
        routes: routes.filter((i) => i.path !== '/permission'),
    },
    {
        key: 'visitor',
        name: 'visitor',
        description: 'Just a visitor. Can only see the home page and the document page',
        routes: [
            {
                path: '',
                redirect: 'dashboard',
                children: [
                    {
                        path: 'dashboard',
                        name: 'Dashboard',
                        meta: { title: 'dashboard', icon: 'dashboard' },
                    },
                ],
            },
        ],
    },
];
exports.getRoles = (req, res) => {
    return res.json({
        code: 200,
        data: {
            total: roles.length,
            items: roles,
        },
    });
};
exports.updateRole = (req, res) => {
    const { role } = req.body;
    return res.json({
        code: 200,
        data: {
            role,
        },
    });
};
exports.deleteRole = (req, res) => {
    return res.json({
        code: 200,
    });
};
exports.getRoutes = (req, res) => {
    return res.json({
        code: 200,
        data: {
            routes,
        },
    });
};
//# sourceMappingURL=index.js.map