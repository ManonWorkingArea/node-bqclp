import { createRouter, createWebHistory } from 'vue-router';
import pluginRoutes from '../extensions/loader';
import storageManager from '@/plugins/storage';

const routes = [];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView();
  },
});

pluginRoutes.forEach(route => {
  router.addRoute(route);
});

router.beforeEach((to, from, next) => {
  const userRole = storageManager.get('session', 'role');
  const userUI = storageManager.get('session', 'interface');
  const routeRole = to.meta?.role;
  const activePlugins = storageManager.get('configs', 'plugins') || [];
  const configs = storageManager.get('configs') || [];
  const isRoleValid = !routeRole || routeRole.includes(userRole);

  const isAuthenticated = storageManager.get('session', 'login');
  const requiresAuth = to.matched.some(record => record.meta.auth);

  const isPluginRoute = activePlugins.some((plugin) =>
    to.name?.replace(/-.*/, '').toLowerCase().startsWith(plugin)
  );

  //console.log("requiresAuth",requiresAuth);
  //console.log("isAuthenticated",isAuthenticated);

  if (requiresAuth && !isAuthenticated) {
    next('/'); // Redirect to home if authentication is required but not authenticated
  } else if (isPluginRoute && configs.siteType !== 'unit' && !isAuthenticated && to.name !== 'member-login') {
    next('/member/login'); // Redirect to login if accessing a plugin route without authentication
  } else if (activePlugins.some(plugin => to.name?.replace(/-.*/, '').toLowerCase().startsWith(plugin)) && (userUI === 'backend' && isRoleValid || to.meta?.auth === false)) {
    next(); // Allow access to plugin route if conditions are met
  } else {
    console.log("Can't Access Plugin");
    next('/'); // Redirect to home if none of the conditions are met
  }

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  Array.from(
    document.querySelectorAll('[data-vue-router-controlled]')
  ).map((el) => el.parentNode.removeChild(el));

  if (!nearestWithMeta) return;
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement('meta');
      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });
      tag.setAttribute('data-vue-router-controlled', '');
      return tag;
    })
    .forEach((tag) => document.head.appendChild(tag));
});

export default router;
