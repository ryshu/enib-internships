import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import { RouteConfig } from 'vue-router';
import { asyncRoutes, constantRoutes } from '@/router';
import store from '@/store';

const hasPermission = (role: string, route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role);
  } else {
    return true;
  }
};

export const filterAsyncRoutes = (routes: RouteConfig[], role: string) => {
  const res: RouteConfig[] = [];
  routes.forEach(route => {
    const r = { ...route };
    if (hasPermission(role, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, role);
      }
      res.push(r);
    }
  });
  return res;
};

export interface IPermissionState {
  routes: RouteConfig[];
  dynamicRoutes: RouteConfig[];
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = [];
  public dynamicRoutes: RouteConfig[] = [];

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes);
    this.dynamicRoutes = routes;
  }

  @Action
  public GenerateRoutes(role: string) {
    let accessedRoutes;
    if (role === 'admin') {
      accessedRoutes = asyncRoutes;
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, role);
    }
    this.SET_ROUTES(accessedRoutes);
  }
}

export const PermissionModule = getModule(Permission);
