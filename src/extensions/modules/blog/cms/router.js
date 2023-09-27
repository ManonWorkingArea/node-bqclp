const slug = "cms";
const title = "เนื้อหา";

export default [
  {
    path: `/${slug}`,
    name: `${slug}`,
    redirect: `/${slug}/dashboard`,
    description: "การจัดการเนื้อหาเว็บไซต์",
    groups: 'blog',
    default: false,
    hasSubmenu: true,
    hasDashboard: true,
    inApp: 'yes',
    inTop: 'yes',
    meta: {
      inMenu: true,
      title: title,
      icon: "newspaper",
      role: ['admin', 'public'],
    },
    children: [
      {
        path: 'all',
        name: `${slug}-all`,
        component: () => import('./view/All.vue'),
        meta: {
          inMenu: true,
          parent: title,
          main: title,
          title: `หน้าเว็บ`,
          type: 'page',
          auth: true,
          icon: "globe",
        }
      },
      {
        path: 'menu',
        name: `${slug}-menu`,
        component: () => import('./view/All.vue'),
        meta: {
          inMenu: true,
          parent: title,
          main: title,
          title: `เมนู`,
          type: 'page',
          auth: true,
          icon: "globe",
        }
      },
      {
        path: 'theme',
        name: `${slug}-theme`,
        component: () => import('./view/All.vue'),
        meta: {
          inMenu: true,
          parent: title,
          main: title,
          title: `ธีม`,
          type: 'page',
          auth: true,
          icon: "globe",
        }
      },
      {
        path: 'customize',
        name: `${slug}-customize`,
        component: () => import('./view/All.vue'),
        meta: {
          inMenu: true,
          parent: title,
          main: title,
          title: `ปรับแต่ง`,
          type: 'page',
          auth: true,
          icon: "globe",
        }
      },
      {
        path: 'add',
        name: `${slug}-add`,
        component: () => import('./view/Add.vue'),
        meta: {
          inMenu: true,
          parent: title,
          main: title,
          title: `เพิ่มหน้าใหม่`,
          type: 'page',
          auth: true,
          icon: "plus",
        }
      },
      {
        path: 'edit/:id',
        name: `${slug}-edit`,
        component: () => import('./view/Edit.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `แก้ไข`,
          type: 'page',
          auth: true,
          icon: "pencil",
        }
      },
      {
        path: 'new/:id',
        name: `${slug}-new`,
        component: () => import('./view/NewPost.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `แก้ไข`,
          type: 'page',
          auth: true,
          icon: "home",
        }
      },
      {
        path: 'iframe/:id',
        name: `${slug}-iframe`,
        component: () => import('./view/Iframe.vue'),
        meta: {
          fullscreen: true,
          inMenu: false,
          parent: title,
          main: title,
          title: `ตัวอย่าง`,
          type: 'page',
          auth: false,
          icon: "plus",
        }
      },
      {
        path: 'posts/:id',
        name: `${slug}-posts`,
        component: () => import('./view/Posts.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `บทความ`,
          type: 'page',
          auth: false,
          icon: "files",
        }
      },
      {
        path: 'pages',
        name: `${slug}-pages`,
        component: () => import('./view/Pages.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `หน้าเว็บ`,
          type: 'page',
          auth: false,
          icon: "files",
        }
      },
      {
        path: 'form/:id/:sub?',
        name: `${slug}-form`,
        component: () => import('./view/Form.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `แบบฟอร์ม`,
          type: 'page',
          auth: false,
          icon: "file-alt",
        }
      },
      {
        path: 'builder/:id',
        name: `${slug}-builder`,
        component: () => import('./view/Builder.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `ออกแบบหน้าเว็บ`,
          type: 'page',
          auth: false,
          icon: "file-alt",
        }
      },
      {
        path: 'menu/:id',
        name: `${slug}-menu`,
        component: () => import('./view/Menu.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `ออกแบบเมนู`,
          type: 'page',
          auth: false,
          icon: "file-alt",
        }
      },
      {
        path: 'page/:page',
        name: `${slug}-page`,
        component: () => import('./view/Page.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `หน้าเว็บ`,
          type: 'page',
          auth: false,
          icon: "file-alt",
        }
      },
      {
        path: 'post/:page/:post',
        name: `${slug}-post`,
        component: () => import('./view/Post.vue'),
        meta: {
          inMenu: false,
          parent: title,
          main: title,
          title: `บทความ`,
          type: 'page',
          auth: false,
          icon: "file-alt",
        }
      },
    ]
  }
];
