
const slug  = "setup";
const title = "ตั้งค่าระบบ";

export default [
  {
    path: `/${slug}`,
    name: `${slug}`,
    redirect: `/${slug}/dashboard`,
    description: "การตั้งค่าข้อมูลของหน่วยงาน",
    groups: 'system',
    default: true,
    hasSubmenu: true,
    hasDashboard: false,
    inApp: 'yes',
    inTop: 'yes',
    meta: {
      inMenu: true,
      title: title,
      icon: "cogs",
      role: ['admin'],
    },
    children: [
      {
        path: 'dashboard',
        name: `${slug}-dashboard`,
        component: () => import('./view/Index.vue'),
        meta: {
          inMenu: true,
          parent: title,
          page: `${slug}`,
          main: title,
          title: `การตั้งค่า`,
          type: 'page',
          auth: true,
          icon: "cog",
        }
      },
      {
        path: 'general',
        name: `${slug}-general`,
        component: () => import('./view/General.vue'),
        meta: {
          inMenu: true,
          parent: slug,
          main: title,
          title: `ข้อมูลทั่วไป`,
          type: 'page',
          auth: true,
          icon: "cogs",
        }
      },
      {
        path: 'admin',
        name: `${slug}-admin`,
        component: () => import('./view/Admin.vue'),
        meta: {
          inMenu: true,
          parent: slug,
          main: title,
          title: `เจ้าหน้าที่`,
          type: 'page',
          auth: true,
          icon: "user-tie",
        }
      },
      {
        path: 'payment',
        name: `${slug}-payment`,
        component: () => import('./view/Payment.vue'),
        meta: {
          inMenu: true,
          parent: slug,
          main: title,
          title: `การชำระเงิน`,
          type: 'page',
          auth: true,
          icon: "credit-card",
        }
      },
      {
        path: 'file',
        name: `${slug}-file`,
        component: () => import('./view/File.vue'),
        meta: {
          inMenu: true,
          parent: slug,
          main: title,
          title: `จัดการไฟล์`,
          type: 'page',
          auth: true,
          icon: "folder",
        }
      }
    ]
  }
]
