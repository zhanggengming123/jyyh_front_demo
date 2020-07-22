import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import areaManagement from '../modulePart/areaManagement/routes.js'
import customOrgManagement from '../modulePart/customOrgManagement/routes.js'
import userManagement from '../modulePart/userManagement/routes.js'
import orgManagement from '../modulePart/orgManagement/routes.js'

const innerRoutes = [
  ...areaManagement,
  ...customOrgManagement,
  ...userManagement,
  ...orgManagement,
]

// 导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item
    }))
  }
]
