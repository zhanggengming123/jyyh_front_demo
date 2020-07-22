<template>
  <div>
    <ta-form :autoFormCreate="(form)=>{this.form = form}">
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="email"
      >
        <ta-input placeholder=''/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="cascader"
      >
        <ta-cascader :options="options" placeholder="Please select" />
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="checkbox"
      >
        <ta-checkbox-group collection-type="SEX"/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="dateTimePicker"
      >
        <ta-date-picker
          mode="time"
          format="YYYY-MM-DD HH:mm:ss"
          showTime
        />
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="inputNumber"
      >
        <ta-input-number :min="1" :max="10"/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="radio"
      >
        <ta-radio-group collection-type="sex" collection-filter="0,2" :reverseFilter="true"/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="select"
      >
        <ta-select collection-type="YESORNO" style="width: 120px"/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="switch"
      >
        <ta-switch/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="timePicker"
      >
        <ta-time-picker use12Hours :format="'h:mm:ss'"/>
      </ta-form-item>
      <ta-form-item
        label='邮箱'
        fieldDecoratorId="treeSelect"
      >
        <ta-tree-select
          showSearch
          style="width: 300px"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder='Please select'
          allowClear
          treeDefaultExpandAll
        >
          <ta-tree-select-node value='parent 1' title='parent 1' key='0-1'>
            <ta-tree-select-node value='parent 1-0' title='parent 1-0' key='0-1-1'>
              <ta-tree-select-node value='leaf1' title='my leaf' key='random' />
              <ta-tree-select-node value='leaf2' title='your leaf' key='random1' />
            </ta-tree-select-node>
            <ta-tree-select-node value='parent 1-1' title='parent 1-1' key='random2'>
              <ta-tree-select-node value='sss' key='random3'>
                <b style="color: #08c" slot="title">sss</b>
              </ta-tree-select-node>
            </ta-tree-select-node>
          </ta-tree-select-node>
        </ta-tree-select>
      </ta-form-item>
    </ta-form>
    <ta-table :columns="columns" :dataSource="data" :scroll="{ x: 1500 }">
      <span slot="operate" slot-scope="text, record">
        <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
      </span>
    </ta-table>
    <ta-button @click="savePage()">保存页面</ta-button>
  </div>
</template>
<script>
  import rePageMixins from '@/common/js/mixins/rePageMixins'

  const columns = [
    {title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left'},
    {title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left'},
    {title: 'Column 1', dataIndex: 'address', key: '1', width: 150},
    {title: 'Column 2', dataIndex: 'address', key: '2', width: 150},
    {title: 'Column 3', dataIndex: 'address', key: '3', width: 150},
    {title: 'Column 4', dataIndex: 'address', key: '4', width: 150},
    {title: 'Column 5', dataIndex: 'address', key: '5', width: 150},
    {title: 'Column 6', dataIndex: 'address', key: '6', width: 150},
    {title: 'Column 7', dataIndex: 'address', key: '7', width: 150},
    {title: 'Column 8', dataIndex: 'address', key: '8'},
    {
      title: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'operate' },
    },
  ];

  const data = [];
  for (let i = 0; i < 5; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }

  export default {
    components: {},
    mixins: [rePageMixins],
    data() {
      return {
        tagData: [{value: '0', label: '机构'}, {value: '1', label: '部门'}, {value: '2', label: '组'}],
        options: [{
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [{
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [{
              value: 'xihu',
              label: 'West Lake',
            }],
          }],
        }, {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            }],
          }],
        }],
        data,
        columns,
        operateMenu: [{
          name: 'action',
          onClick: (record) => {
            this.$message.info(JSON.stringify(record))
          }
        }]
      }
    },
    methods: {
      savePage() {
        //调用页面还原,回调返回pageId
        this.saveRePageData().then(pageId => {
          console.log(pageId)
          localStorage.pageId=pageId
          //这里可以自己去保存 pageId
        })
      },
    }
  }
</script>
