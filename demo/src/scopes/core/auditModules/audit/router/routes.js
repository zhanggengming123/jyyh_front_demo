import routesContainer from '@/common/components/routesContainer'

//模块part 声明导入
import loginLogAnalysis from "../modulePart/loginLogAnalysis/routes.js"
import systemExceptionLog from "../modulePart/systemExceptionLog/routes.js"
import accessDenyLog from "../modulePart/accessDenyLog/routes.js"
import loginFailLog from "../modulePart/loginFailLog/routes.js"
import auditLog from "../modulePart/auditLog/routes.js"
import operationLog from "../modulePart/operationLog/routes"
const innerRoutes = [
  ...loginLogAnalysis,
  ...systemExceptionLog,
  ...accessDenyLog,
  ...loginFailLog,
  ...auditLog,
  ...operationLog
];


//导入路由声明
export default [
  { path: '/',
    component: routesContainer,
    children: innerRoutes.map((item) => ({
      ...item,
    })),
  },
]
