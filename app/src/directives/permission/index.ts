import { DirectiveOptions } from 'vue';
import { UserModule } from '@/store/modules/user';

export const permission: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding;
    const role = UserModule.role;
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;
      const hasPermission = permissionRoles.includes(role);
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need role! Like v-permission="['admin','editor']"`);
    }
  },
};
