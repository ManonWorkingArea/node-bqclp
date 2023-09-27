// Extensions Module
// 

// Starter
import homeRoutes       from '@/extensions/modules/starter/home/router'


// Blog
import cmsRoutes        from '@/extensions/modules/blog/cms/router'

// System
import configRoutes     from '@/extensions/modules/system/config/router'
import setupRoutes      from '@/extensions/modules/system/setup/router'
import installRoutes    from '@/extensions/modules/system/install/router'
import memberRoutes     from '@/extensions/modules/system/member/router' //Backend Member
import userRoutes     from '@/extensions/modules/system/user/router'

// Untitle
import messageRoutes    from '@/extensions/modules/untitle/message/router'
import testRoutes       from '@/extensions/modules/untitle/test/router'

// Extra
import bqclp_access       from '@/extensions/modules/extra/bqclp/access/router'
import bqclp_create       from '@/extensions/modules/extra/bqclp/create/router'
import bqclp_request      from '@/extensions/modules/extra/bqclp/request/router'
import bqclp_send         from '@/extensions/modules/extra/bqclp/send/router'
import bqclp_status       from '@/extensions/modules/extra/bqclp/status/router'
import bqclp_website       from '@/extensions/modules/extra/bqclp/website/router'

const pluginRoutes = [
  ...homeRoutes,
  ...messageRoutes,
  ...userRoutes,
  ...memberRoutes,
  ...cmsRoutes,
  ...bqclp_create,
  ...bqclp_request,
  ...bqclp_send,
  ...bqclp_status,
  ...bqclp_website,
  ...bqclp_access,
  ...configRoutes,
  ...setupRoutes,
  ...testRoutes,
  ...assetRoutes,
  ...installRoutes
]

export default pluginRoutes