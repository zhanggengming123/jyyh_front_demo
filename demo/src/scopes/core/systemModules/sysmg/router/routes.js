import routesContainer from '@/common/components/routesContainer'

// 模块part 声明导入
import resourceManagement from '../modulePart/resourceManagement/routes'
import cacheMg from '../modulePart/cacheMg/routes'
import dictMg from '../modulePart/dictMg/routes'
import tagManagement from '../modulePart/tagManagement/routes'
import accessSystem from '../modulePart/accessSystem/routes'
import customResource from '../modulePart/customResource/routes'
import userInfoManagement from '../modulePart/userInfoManagement/routes'
import jobManager from '../modulePart/elasticJobMg/jobManager/routes'
import jobOperate from '../modulePart/elasticJobMg/jobOperate/routes'
import jobHistory from '../modulePart/elasticJobMg/jobHistory/routes'
import jobProgress from '../modulePart/elasticJobMg/jobProgress/routes'
import dynamicRest from '../modulePart/dynamicRest/routes'
import configManagement from '../modulePart/configManagement/routes'
import systemConfigManagement from '../modulePart/systemConfigManagement/routes'

const innerRoutes = [
  ...resourceManagement,
  ...cacheMg,
  ...dictMg,
  ...tagManagement,
  ...accessSystem,
  ...customResource,
  ...userInfoManagement,
  ...jobManager,
  ...jobOperate,
  ...jobHistory,
  ...jobProgress,
  ...dynamicRest,
  ...configManagement,
  ...systemConfigManagement,
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
