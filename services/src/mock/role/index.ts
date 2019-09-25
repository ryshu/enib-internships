import { Response, Request } from 'express';
import { asyncRoutes, constantRoutes } from './routes';
import { IRoleData } from '../types';

const routes = [...constantRoutes, ...asyncRoutes];
const roles: IRoleData[] = [
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
    routes: routes.filter((i) => i.path !== '/permission'), // Just a mock
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

export const getRoles = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    data: {
      total: roles.length,
      items: roles,
    },
  });
};

export const updateRole = (req: Request, res: Response) => {
  const { role } = req.body;
  return res.json({
    code: 200,
    data: {
      role,
    },
  });
};

export const deleteRole = (req: Request, res: Response) => {
  return res.json({
    code: 200,
  });
};

export const getRoutes = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    data: {
      routes,
    },
  });
};
