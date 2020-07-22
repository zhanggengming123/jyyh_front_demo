import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import page from '../modulePart/page/routes'
import componentsMg from '../modulePart/componentsMg/routes'
import roleTemplateMg from '../modulePart/roleTemplateMg/routes'

const innerRoutes = [
  ...page,
  ...componentsMg,
  ...roleTemplateMg,
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
