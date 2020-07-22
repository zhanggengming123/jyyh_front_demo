
export default {

  auditChart (data, callBack) {
    Base.submit(null, {url: 'audit/taAuditResService/' + 'auditChart', data: data}, {
      successCallback: (data) => callBack(data)
    })
  },

}
