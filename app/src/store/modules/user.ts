import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import { getProfile } from '@/api/cas';
import store from '@/store';

import router, { resetRouter } from '@/router/index';
import { PermissionModule } from './permission';
import { TagsViewModule } from './tags-view';

export interface IUserState {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public firstName = '';
  public lastName = '';
  public role = '';
  public email = '';

  @Mutation
  private SET_FIRST_NAME(firstName: string) {
    this.firstName = firstName;
  }

  @Mutation
  private SET_LAST_NAME(lastName: string) {
    this.lastName = lastName;
  }

  @Mutation
  private SET_ROLE(role: string) {
    this.role = role;
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email;
  }

  @Action
  public async GetUserInfo() {
    // Call to retrieve default user profile
    const data = (await getProfile()) as any;
    if (!data) {
      throw Error('Verification failed, please Login.');
    }
    const { role, firstName, lastName, email } = data;
    // role must be a non-empty array
    if (!role || role.length <= 0) {
      throw Error('GetUserInfo: role must be a non-null array!');
    }
    this.SET_ROLE(role);
    this.SET_FIRST_NAME(firstName);
    this.SET_LAST_NAME(lastName);
    this.SET_EMAIL(email);
  }

  @Action
  public async changeRole(role: string) {
    // Dynamically modify permissions
    this.SET_ROLE(role);
    resetRouter();
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(role);
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes);
    // Reset visited views and cached views
    TagsViewModule.delAllViews();
  }
}

export const UserModule = getModule(User);
