const slug  = "message";
const title = "ข้อความ";

export default [
  {
    path: `/${slug}`,
    name: `${slug}`,
    redirect: `/${slug}/inbox`,
    description: "จัดการข้อความการติดต่อสื่อสารภายใน",
    groups: 'default',
    default: false,
    counter: true,
    hasSubmenu: false,
    hasDashboard: false,
    inApp: 'yes',
    inTop: 'no',
    meta: {
      inMenu: true,
      title: title,
      icon: "envelope",
      role: ['admin','public'],
    },
    children: [
      {
        path: 'inbox',
        name: `${slug}-inbox`,
        component: () => import('./view/Index.vue'),
        meta: {
          inMenu: true,
          parent: title,
          page: `${slug}`,
          main: title,
          title: `ข้อความ`,
          type: 'page',
          auth: true,
          icon: "envelope",
        }
      },
      {
        path: 'read',
        name: `${slug}-read`,
        component: () => import('./view/Read.vue'),
        meta: {
          inMenu: true,
          parent: title,
          page: `${slug}/read`,
          main: title,
          title: `อ่านข้อความ`,
          type: 'page',
          auth: true,
          icon: "envelope",
        }
      }
      ,
      {
        path: 'compose',
        name: `${slug}-compose`,
        component: () => import('./view/Compose.vue'),
        meta: {
          inMenu: true,
          parent: title,
          page: `${slug}/compose`,
          main: title,
          title: `เขียนข้อความ`,
          type: 'page',
          auth: true,
          icon: "pencil-alt",
        }
      }
    ]
  }
]
