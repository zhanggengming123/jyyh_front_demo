import routesContainer from '@/common/components/routesContainer'

import urlMg from '../modulePart/urlmg/routes'

const innerRoutes = [
  ...urlMg
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
