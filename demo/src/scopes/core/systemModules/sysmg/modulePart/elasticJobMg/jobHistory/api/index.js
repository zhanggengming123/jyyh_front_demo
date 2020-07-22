const BASE_URL = '/jobmg/elasticjob/jobDatasourceManagementRestService/'
export default {
  addJobDatasource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'addJobDatasource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  deleteJobDatasource (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'deleteJobDatasource', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobExecutionTrace (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getJobExecutionTrace', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },
  getJobStatusTrace (data, callBack) {
    Base.submit(null, {url: BASE_URL + 'getJobStatusTrace', data: data}, {
      successCallback: (data) => callBack(data)
    })
  }
}
