import { Response, Request } from 'express';
import { IUserData } from './types';

const userList: IUserData[] = [
  {
    id: 0,
    username: 'admin',
    password: 'any',
    name: 'Super Admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am a super administrator',
    email: 'admin@test.com',
    phone: '1234567890',
    roles: ['admin'],
  },
  {
    id: 1,
    username: 'editor',
    password: 'any',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an editor',
    email: 'editor@test.com',
    phone: '1234567890',
    roles: ['editor'],
  },
];

export const login = (req: Request, res: Response) => {
  const { username } = req.body;
  for (const user of userList) {
    if (user.username === username) {
      return res.json({
        code: 200,
        data: {
          accessToken: username + '-token',
        },
      });
    }
  }
  return res.status(400).json({
    code: 500,
    messaege: 'Invalid User',
  });
};

export const logout = (req: Request, res: Response) => {
  return res.json({
    code: 200,
  });
};

export const getUsers = (req: Request, res: Response) => {
  const { name } = req.query;
  const users = userList.filter((user) => {
    const lowerCaseName = user.name.toLowerCase();
    return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0);
  });
  return res.json({
    code: 200,
    data: {
      items: users,
    },
  });
};

export const getUserInfo = (req: Request, res: Response) => {
  // Mock data based on access token
  return res.json({
    code: 200,
    data: {
      user: req.header('X-Access-Token') === 'admin-token' ? userList[0] : userList[1],
    },
  });
};

export const getUserByName = (req: Request, res: Response) => {
  const { username } = req.params;
  for (const user of userList) {
    if (user.username === username) {
      return res.json({
        code: 200,
        data: {
          user,
        },
      });
    }
  }
  return res.status(400).json({
    code: 500,
    messaege: 'Invalid User',
  });
};

export const updateUser = (req: Request, res: Response) => {
  const { username } = req.params;
  const { user } = req.body;
  for (const v of userList) {
    if (v.username === username) {
      return res.json({
        code: 200,
        data: {
          user,
        },
      });
    }
  }
  return res.status(400).json({
    code: 500,
    messaege: 'Invalid User',
  });
};

export const deleteUser = (req: Request, res: Response) => {
  return res.json({
    code: 200,
  });
};
