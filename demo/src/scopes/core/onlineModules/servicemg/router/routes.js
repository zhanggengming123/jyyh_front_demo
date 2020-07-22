import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import serviceManagement from '../modulePart/serviceManagement/routes'
import siteManagement from '../modulePart/siteManagement/routes.js'
import staticResourceMg from '../modulePart/staticResourceMg/routes'
import appManagement from '../modulePart/appManagement/routes'
import templateMg from '../modulePart/templateMg/routes'

const innerRoutes = [
  ...serviceManagement,
  ...siteManagement,
  ...staticResourceMg,
  ...appManagement,
  ...templateMg
]

// 导入路由声明
export default [
  { path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item
    }))
  }
]
