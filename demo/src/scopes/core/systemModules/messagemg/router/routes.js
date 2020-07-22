import routesContainer from '@/common/components/routesContainer'

import recordMg from '../modulePart/record/routes'
import sendMessage from '../modulePart/sendMessage/routes'

const innerRoutes = [
  ...recordMg,
  ...sendMessage
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
