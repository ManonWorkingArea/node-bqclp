  export function getPluginRoutes(routes) {
    const routesWithSubmenus = [];
    routes.forEach(route => {
        routesWithSubmenus.push({
          name: route.meta.title,
          linkage: route.linkage||"",
          userDashboard: route.userDashboard||"",
          inApp: route.inApp||"",
          inTop: route.inTop||"",
          slug: route.name,
          groups: route.groups,
          path: route.path,
          icon: route.meta.icon,
          meta: route.meta,
          role: route.meta.role,
          routes: route.children,
          counter: route.counter,
          session: route.session || false,
          fullscreen: route.meta.fullscreen||false,
          hasSubmenu: route.hasSubmenu
        });
    });
    return routesWithSubmenus;
  }

  export function getPluginNames(plugins) {
    return plugins.map(plugin => {
      return {
        slug: plugin.name,
        groups: plugin.groups,
        linkage: plugin.linkage||"",
        userDashboard: plugin.userDashboard||"",
        inApp: plugin.inApp||"",
        inTop: plugin.inTop||"",
        name: plugin.meta.title,
        dashboard: plugin.hasDashboard,
        description: plugin.description,
        default: plugin.default,
        role: plugin.meta.role,
        counter: plugin.counter,
        session: plugin.session || false,
        fullscreen: plugin.meta.fullscreen||false,
      };
    });
  }
  