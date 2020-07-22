export default {
  addZookeeperRegistryCenter (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/zookeeperAddressManagementRestService/addZookeeperRegistryCenter', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  batchDeleteZookeeperRegistryCenter (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/zookeeperAddressManagementRestService/deleteZookeeperRegistryCenter', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  connectZookeeperRegistryCenter (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/zookeeperAddressManagementRestService/connectZookeeperRegistryCenter', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobInfo (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/getJobInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobDetailInfo (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/getJobDetailInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  saveJobDetailInfo (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/saveJobDetailInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobServerDetail (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/getJobServerDetail', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  disabledSharding (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/disabledSharding', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  effectSharding (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/effectSharding', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  triggerJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/triggerJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  disableJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/disableJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  enableJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/enableJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  shutdownJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/shutdownJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  removeJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/jobOperateRestService/removeJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getServerInfo (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/getServerInfo', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  disableServer (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/disableServer', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  enableServer (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/enableServer', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  shutdownServer (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/shutdownServer', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  removeServer (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/removeServer', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getServerJobDetail (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/getServerJobDetail', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  disabledServerJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/disabledServerJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  enableServerJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/enableServerJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  shutdownServerJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/shutdownServerJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  removeServerJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/serverOperateRestService/removeServerJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobNameByZkId (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/freeBusyJobManagerRestService/getJobNameByZkId', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getServerIpsByJobName (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/freeBusyJobManagerRestService/getServerIpsByJobName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  addFreeBusyJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/freeBusyJobManagerRestService/addFreeBusyJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteFreeBusyJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/freeBusyJobManagerRestService/deleteFreeBusyJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getAllServerIpsByJobName (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/freeBusyJobManagerRestService/getAllServerIpsByJobName', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  updateFreeBusyJob (data, callBack) {
    Base.submit(null, {url: 'jobmg/elasticjob/freeBusyJobManagerRestService/updateFreeBusyJob', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
