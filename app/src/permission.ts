import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Message } from 'element-ui';
import { Route } from 'vue-router';
import { UserModule } from '@/store/modules/user';
import { PermissionModule } from '@/store/modules/permission';
import i18n from '@/lang'; // Internationalization

NProgress.configure({ showSpinner: false });

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`);
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`);
    return `${pageName} - ${i18n.t('title')}`;
  }
  return i18n.t('title').toString();
};

router.beforeEach(async (to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start();

  // Check whether the user has obtained his permission role
  if (!UserModule.role) {
    try {
      await UserModule.GetUserInfo();
      const role = UserModule.role;
      // Generate accessible routes map based on role
      PermissionModule.GenerateRoutes(role);
      // Dynamically add accessible routes
      router.addRoutes(PermissionModule.dynamicRoutes);
      // Hack: ensure addRoutes is complete
      // Set the replace: true, so the navigation will not leave a history record
      next({ ...to, replace: true });
    } catch (err) {
      // Remove token and redirect to internal error page
      Message.error(err || 'Has Error');
      next(`/500?redirect=${to.path}`);
      NProgress.done();
    }
  } else {
    next();
  }
});

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done();

  // set page title
  document.title = getPageTitle(to.meta.title);
});
