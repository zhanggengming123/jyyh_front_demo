import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import runqian from '../runqian/routes'
import rePageDemoPart2 from '../rePageDemo/modulePart2/routes'
import rePageDemoPart1 from '../rePageDemo/modulePart1/routes'

const innerRoutes = [
  ...runqian,
  ...rePageDemoPart2,
  ...rePageDemoPart1
]
// 导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item
    })
    )
  }
]
