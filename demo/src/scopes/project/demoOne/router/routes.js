import routesContainer from '@/common/components/routesContainer'

//模块part 声明导入
import modulePart1 from "../modulePart/modulePart1/routes"
import modulePart2 from "../modulePart/modulePart2/routes"

const innerRoutes = [
  ...modulePart1,
  ...modulePart2
]
//导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item,
    })
    ),
  },
]
