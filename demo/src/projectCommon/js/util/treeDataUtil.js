import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'

export default {
  /**
   * 条件获取数据在数组的 index
   * @param records
   * @param data
   * @param rowKey
   * @return {number}
   */
  findFilterIndex (records = [], data = {}, rowKey = 'key') {
    return records.findIndex(record => {
      try {
        if (record[rowKey] != data[rowKey]) {
          throw {}
        }
      } catch (e) {
        return false
      }
      return true
    })
  },
  /**
   * 迭代处理
   * @param sourceData 源数组数据对象 (vue data)
   * @param records 过滤参照对象
   * @param rowKey 数据key
   * @param up  是否向下处理模式   向下处理会默认处理满足条件节点的子节点
   * @param deal 处理
   * @param offset 循环偏移量, 用于每次deal后的循环index 修正
   */
  loopDeal (sourceData = [], records = [], rowKey = 'key', up = false, deal = () => {}, offset = 0) {
    let parentData
    if (isPlainObject(sourceData)) {
      parentData = sourceData
      sourceData = sourceData.children
    }
    for (let _index = 0; _index < sourceData.length; _index++) {
      const data = sourceData[_index]
      let isSearch = true
      if (isArray(records) && records.length > 0) {
        const index = this.findFilterIndex(records, data, rowKey)
        isSearch = index > -1
      }

      if (isArray(data.children)) {
        if (up && isSearch) {
          this.loopDeal(data, null, null, up, deal, offset)
        } else {
          this.loopDeal(data, records, rowKey, up, deal, offset)
        }
      }

      if (!isSearch) continue
      deal(parentData, data, _index)
      _index += offset
    }
  },
  /**
   * 获取指定节点的数据
   * @param sourceData
   * @param records
   * @param rowKey
   * @param up
   * @return {Array}
   */
  loopData (sourceData = [], records = [], rowKey = 'key', up = false) {
    const resultData = []
    this.loopDeal(sourceData, records, rowKey, up, (parentData, data, index) => {
      resultData.push(data)
    })
    return resultData
  },
  /**
   * 获取指定节点 key
   * @param sourceData
   * @param rowKey
   * @param records
   * @param rowKey
   * @param up
   * @return {Array}
   */
  loopDataKey (sourceData = [], records = [], rowKey = 'key', up = false) {
    const resultData = []
    this.loopDeal(sourceData, records, rowKey, up, (parentData, data, index) => {
      resultData.push(data[rowKey])
    })
    return resultData
  },
  /**
   * 获取节点的父级节点数据
   * @param sourceData
   * @param record
   * @param rowKey
   * @return {*}
   */
  loopParentData (sourceData = [], record = {}, rowKey = 'key') {
    const parentDatas = []
    this.loopDeal(sourceData, [record], rowKey, false, (parentData, data, index) => {
      parentDatas.push(parentData)
    })
    return parentDatas[0]
  },
  /**
   * 更新节点数据
   * @param sourceData
   * @param updateVal
   * @param records
   * @param rowKey
   */
  updateTreeDataDown (sourceData = [], records = [], updateVal = {}, rowKey = 'key') {
    const keys = Object.keys(updateVal)
    this.loopDeal(sourceData, records, rowKey, true, (parentData, data, index) => {
      keys.forEach(key => data[key] = updateVal[key])
    })
  },
  /**
   * 删除指定节点数据
   * @param sourceData
   * @param records
   * @param rowKey
   */
  removeTreeData (sourceData = [], records = [], rowKey = 'key') {
    this.loopDeal(sourceData, records, rowKey, false, (parentData, data, index) => {
      if (isPlainObject(parentData)) {
        // let _index = this.findFilterIndex(parentData.children,data,rowKey);
        parentData.children.splice(index, 1)
        if (parentData.children.length == 0) {
          parentData.children = null
        }
      } else {
        sourceData.splice(index, 1)
      }
    }, -1)
  },
  /**
   * 添加子节点
   * @param sourceData 源数据
   * @param pRecords 父节点数据
   * @param rowKey
   * @param newData 添加的数据对象
   * @param vue vue实例本身
   */
  addTreeData (sourceData = [], pRecords = {}, rowKey = 'key', newData = {}, vue) {
    const pData = this.loopData(sourceData, [pRecords], rowKey)[0]
    if (isArray(pData.children)) { pData.children.push(newData) } else {
      vue.$set(pData, 'children', [newData])
    }
  }
}
