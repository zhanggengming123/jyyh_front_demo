import routesContainer from '@/common/components/routesContainer'

//模块part 声明导入
// import systemExceptionLog from '../modulePart/systemExceptionLog/routes.js'
import logConfig from '../modulePart/logConfig/routes.js'
// import loginLogAnalysis from '../modulePart/loginLogAnalysis/routes.js'
// import operationLog from '../modulePart/operationLog/routes.js'

const innerRoutes = [
  // ...systemExceptionLog,
  ...logConfig
  // ...loginLogAnalysis,
  // ...operationLog
]

//导入路由声明
export default [
  {
    path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item,
    })),
  },
]
