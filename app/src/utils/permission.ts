import { UserModule } from '@/store/modules/user';

export const checkPermission = (value: string[]): boolean => {
  if (value && value instanceof Array && value.length > 0) {
    const role = UserModule.role;
    const permissionRoles = value;
    const hasPermission = permissionRoles.includes(role);
    return hasPermission;
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`);
    return false;
  }
};
