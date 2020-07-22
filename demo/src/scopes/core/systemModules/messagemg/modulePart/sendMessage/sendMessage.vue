<template>
  <div class="fit">
    <ta-border-layout
      :layout="{header:'200px'}"
    >
      <div slot="header">
        <ta-tabs class="fit">
          <ta-tab-pane tab="筛选查询" key="1" class="fit">
            <ta-form label-width="100px" style="margin-top: 10px" class="fit"
                     :autoFormCreate="(form)=>{this.form = form}">
              <ta-row>
                <ta-col :span="8">
                  <ta-form-item label="关键词">
                    <ta-input/>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="8">
                  <ta-form-item label="节点" :span="8">
                    <ta-select/>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="8">
                  <ta-form-item label="发送时间" :span="8">
                    <ta-date-picker style="width: 100%"/>
                  </ta-form-item>
                </ta-col>
              </ta-row>
              <ta-row>
                <ta-col :span="8">
                  <ta-form-item label="发送人" :span="8">
                    <ta-input/>
                  </ta-form-item>
                </ta-col>
                <ta-col :span="8" style="text-align: center;">
                  <ta-button @click="fnQuery">查询</ta-button>
                  <ta-button type="primary" @click="sendVisible=true">发邮件</ta-button>
                </ta-col>
              </ta-row>
            </ta-form>
          </ta-tab-pane>
        </ta-tabs>
      </div>
      <ta-tabs class="fit">
        <ta-tab-pane tab="数据列表" key="1" class="fit">

          <div v-for="(item, index) in listData" :key="index" class="messageList">
            <ta-checkbox style="position: absolute;left: 5px"/>
            <div style="font-size: 12px;margin-bottom: 15px">
              <div class="messageHeader">发布人员：<span class="info-text">{{item.senderName}}</span></div>
              <div class="messageHeader">发送时间：<span class="info-text">{{item.sendDate}}</span></div>
              <div class="messageHeader">接收对象：<span class="info-text">{{item.receiverEmail}}</span></div>
              <span style="float: right;color: #52c41a" v-if="item.type==1">发送成功</span>
              <span style="float: right;color: #f5222d" v-if="item.type==2">发送失败</span>
            </div>
            <ta-divider style="margin: 0 0 14px;"/>
            <div style="height: 100px" v-html="item.content">
            </div>
            <ta-divider style="margin: 0"/>
            <div style="font-size: 12px;margin-top: 15px">
              <span>发布附件：</span>
              <ta-tag color="blue" v-for="(fileInfo,indexFile) in item.annexList" :key="indexFile" @click="fnDownLoad(fileInfo.annexId)">{{fileInfo.annexName}}</ta-tag>
            </div>
          </div>
        </ta-tab-pane>
      </ta-tabs>

    </ta-border-layout>
    <ta-modal
      title="发邮件"
      v-model="sendVisible"
      width="1000px"
      height="500px"
      :destroy-on-close="true"
      :closable="false"
    >
      <div slot="footer" style="text-align: center">
        <ta-button @click="fnCloseSendMessage">取消</ta-button>
        <ta-button type="primary" @click="fnSendMessage">确定</ta-button>
      </div>
      <ta-form :autoFormCreate="(form)=>{this.messageForm = form}">
        <ta-form-item
          label='收件人'
          fieldDecoratorId="receiverEmail"
          :require="{message:'请输入邮箱!'}">
          <ta-input placeholder='输入用户邮箱号，多个邮箱请用逗号分隔'/>
        </ta-form-item>
        <ta-form-item
          label='主题'
          fieldDecoratorId="title"
          :require="{message:'请输入主题'}">
          <ta-input/>
        </ta-form-item>
        <ta-form-item
          label='内容'
          fieldDecoratorId="content"
          required
          :fieldDecoratorOptions="{rules: [{validator:contentValidator}]}"
        >
          <ta-rich-editor ref="richEditor" style="height: 200px"/>
        </ta-form-item>
        <ta-form-item
          label="附件"
          fieldDecoratorId="file"
          :required="true"
          :fieldDecoratorOptions="{rules: [{validator:fileValidator}]}"
        >
          <ta-upload @change="handleUploadChange" name="file" :multiple="true"
                     :action="backUrl+'/email/uploadEmailFile'" :withCredentials="true"
                     :beforeUpload="beforeUploadNoticeFile" :fileList="uploadFileList">
            <ta-button>
              <ta-icon type="upload"/>
              上传附件
            </ta-button>
          </ta-upload>
        </ta-form-item>
      </ta-form>
    </ta-modal>
  </div>
</template>

<script>

const listData = []

export default {
  name: 'recordMg',
  data () {
    return {
      backUrl: '',
      listData,
      sendVisible: false,
      uploadFileList: []
    }
  },
  // 页面初始化时执行内容
  mounted () {
    this.backUrl = faceConfig.basePath
    this.fnQuery()
  },
  methods: {
    // 查询已发送消息
    fnQuery () {
      this.Base.submit(null, {
        url: 'email/getUserSendEmail',
        data: {
          ...this.form.getFieldsValue()
        }
      }).then((data) => {
        this.listData = data.data.emailList
      })
    },
    // 下载附件
    fnDownLoad (annexId) {
      location.href = this.backUrl + '/email/downloadEmailFile?annexId=' + annexId
    },
    // 发送消息
    fnSendMessage () {
      this.messageForm.validateFields((err, values) => {
        if (!err) {
          let params = this.messageForm.getFieldsValue()
          let uploadFileIds = this.uploadFileList.filter(a => a.fileId).map(a => a.fileId).join(',')
          Object.assign(params, { content: this.$refs.richEditor.getHtml() })
          this.Base.submit(null, {
            url: 'email/sendEmail',
            data: {
              voStr: JSON.stringify(params),
              annexIds: uploadFileIds
            }
          }).then((data) => {
            if (data.data.type == '1') {
              this.$message.success('消息发送成功')
            } else {
              this.$message.error('消息发送失败')
            }
            this.uploadFileList = []
            this.sendVisible = false
            this.fnQuery()
          })
        }
      })
    },
    // 关闭弹窗
    fnCloseSendMessage () {
      this.uploadFileList = []
      this.sendVisible = false
    },
    handleUploadChange (upload) {
      const list = upload.fileList
      if (upload.file.status == 'done' && upload.file.response) {
        if (upload.file.response.code == 200 && upload.file.response.data.fileId) {
          list.forEach(a => {
            if (a.uid == upload.file.uid) {
              a.status = 'success'
              a.fileId = upload.file.response.data.fileId
            }
          })
          this.$message.success('上传成功')
        } else {
          list.forEach(a => {
            if (a.uid == upload.file.uid) {
              a.status = 'error'
            }
          })
          this.$message.error(upload.file.response.errors[0].msg)
        }
      }
      this.uploadFileList = list
    },
    beforeUploadNoticeFile (file, fileList) {
      // this.currentUploadFile = file
      // this.uploadFileList = fileList
      if (file.size > 20971520) { // 20M
        this.$message.error('上传失败，文件超过20M,暂不支持')
        file.status = 'error'
        return false
      }
      return true
    },
    // 文件验证
    fileValidator (rule, value, callback) {
      if (this.uploadFileList.length < 1) {
        callback('请先选择文件')
      } else {
        callback()
      }
    },
    contentValidator (rule, value, callback) {
      if (this.$refs.richEditor.getText().length < 1) {
        callback('请先选择文件')
      } else {
        callback()
      }
    }
  }
}
</script>

<style type="text/less" lang="less">

  .messageHeader {
    width: 200px;
    display: inline-block;
  }

  .messageList {
    border: 1px solid #EBEEF5;
    margin: 10px;
    padding: 15px 15px 15px 30px;
    position: relative;
  }

  .info-text{
    color: #9b9b9b;
    width: 100px;
  }

</style>
