<template>
  <div class="user-info-container">
    <el-card shadow="hover" class="box-card" v-if="code != 4">
      <div slot="header" class="clearfix">
        <span><i class="el-icon-user"></i> 个人认证信息</span>
      </div>
      <div class="empty-state">
        <el-empty :description="this.msg"></el-empty>
        <div v-if="code != 2" class="action-btn">
          <el-button type="primary" size="medium" @click="applyForModification()">{{ button }}</el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="hover" class="box-card" v-else>
      <div slot="header" class="clearfix">
        <span><i class="el-icon-user-solid"></i> 我的资料</span>
        <el-tag type="success" size="small" style="float: right;">已认证</el-tag>
      </div>
      
      <div class="user-profile">
        <el-row :gutter="40">
            <el-col :span="8" class="profile-left">
                 <div class="avatar-container">
                    <el-avatar :size="100" :src="require('@/assets/avatar.jpg')" icon="el-icon-user-solid"></el-avatar>
                    <h3>{{ infoForm.name }}</h3>
                    <p>{{ infoForm.userRole }}</p>
                 </div>
            </el-col>
            <el-col :span="16">
                 <el-form :model="infoForm" ref="infoForm" label-position="right" label-width="100px" class="info-form">
                    <el-row :gutter="20">
                        <el-col :span="12">
                             <el-form-item label="姓名" prop="name">
                                <el-input v-model="infoForm.name" disabled prefix-icon="el-icon-user"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电话号码" prop="phoneNumber">
                                <el-input v-model="infoForm.phoneNumber" disabled prefix-icon="el-icon-mobile-phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="QQ号" prop="qqNumber">
                                <el-input v-model="infoForm.qqNumber" disabled prefix-icon="el-icon-chat-round"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="认证身份" prop="userRole">
                                <el-input v-model="infoForm.userRole" disabled prefix-icon="el-icon-postcard"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-form-item label="认证时间" prop="certifiedTime">
                        <el-input v-model="infoForm.certifiedTime" disabled prefix-icon="el-icon-date"></el-input>
                    </el-form-item>

                    <el-form-item class="form-actions">
                        <el-button type="primary" icon="el-icon-edit" @click="applyForModification()">申请修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="cancelAuthentication()">取消认证</el-button>
                        <el-button type="success" icon="el-icon-download" @click="myInfoExportExcel()">导出表格</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
      </div>
    </el-card>

    <el-dialog title="申请认证" :visible.sync="dialogUserInfo" width="500px" center append-to-body>
      <el-form :model="infoAddForm" label-width="80px" class="demo-infoUpdateForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="infoAddForm.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="infoAddForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="QQ账号" prop="qq">
          <el-input v-model="infoAddForm.qq" placeholder="请输入QQ号码"></el-input>
        </el-form-item>
        <el-form-item label="认证照片" prop="img">
          <ImageUploader ref="imageSet"/>
        </el-form-item>

        <el-form-item label="认证角色" prop="role">
          <el-radio-group v-model="infoAddForm.role">
            <el-radio label="student">学生</el-radio>
            <el-radio label="teacher">教师</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserInfo = false">取 消</el-button>
        <el-button type="primary" @click="submitAnApplication()">提交申请</el-button>
      </div>

    </el-dialog>

  </div>
</template>
<script>
import {
  getUserInfo,
  submitCertificationInformation,
  deleteAuthenticationInformation,
  getAthleteRegistrationTotal,
  exportExcel
} from '@/api'
import { downloadFile } from '@/utils/downloadFile';
import {updateAthlete} from '@/api'
import ImageUploader from '@/components/ImageUploader.vue'
import {executeConfirmedRequest} from '@/utils/globalConfirmAction'

export default {
  components: {ImageUploader},
  data() {
    return {
      userId: 0,
      code: 0,
      msg: '未认证',
      button: '申请认证',
      userOption: {
        '1': {
          msg: '未认证',
          button: '申请认证'
        },
        '2': {
          msg: '认证中,请等待',
          button: '查看'
        },
        '3': {
          msg: '认证失败',
          button: '重新认证'
        },
        '4': {
          msg: '已认证',
          button: '修改认证'
        }
      },
      dialogUpdateForm: false,
      dialogUserInfo: false,
      labelPosition: 'right',
      infoUpdateForm: {
        athleteId: 1,
      },
      infoForm: {
        name: '',
        age: '20',
        gender: '1',
        contact: '',
        userId: this.$store.state.userInfo.userId
      },
      infoAddForm: {
        name: '',
        phone: '',
        imgUrl: '',
        qq: '',
        role: 'student',
      },
      playerInfo: {},

    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.userId = this.$store.state.userInfo.userId


      getUserInfo(this.userId).then((data) => {
        console.log("用户信息", data);
        console.log("用户信息", data.data.data);
        if (data.data.code === 1) {
          var info = data.data.data;
          if (info.authStatus && info.authStatus === '认证中') {

            this.updateButton(2)

          } else if (info.authStatus && info.authStatus === '认证通过') {
            this.updateButton(4)
            this.infoForm = info
          } else {
            this.updateButton(3)

          }

        } else {
          this.updateButton(1)
        }
        console.log("展示页面", this.msg, this.code);
      })
    },
    updateButton(id) {
      this.code = id;
      this.msg = this.userOption[id].msg
      this.button = this.userOption[id].button
    },
    submitForm() {

      getAthleteRegistrationTotal(this.infoForm.athleteId).then((data) => {

        if (data.data.data == 0) {
          console.log("运动员参加项目总数", data.data.data > 0);
          this.dialogUpdateForm = true
          this.infoUpdateForm = this.infoForm
        } else {
          this.$notify.error({
            title: '失败',
            message: '有比赛记录在无法修改'
          });
        }
      })

    },

    UpdateInfo() {
      console.log("提交修改运动员信息", this.infoUpdateForm);
      updateAthlete(this.infoUpdateForm).then((data) => {
        if (data.data.code == 1) {
          console.log("修改运动员信息成功", data.data.data > 0);
          this.dialogUpdateForm = true
          this.infoUpdateForm = this.infoForm
          this.$message({
            showClose: true,
            message: '修改成功，请重新登录',
            type: 'success'
          })
          this.$router.push('/login')
        } else {
          this.$notify.error({
            title: '修改运动员信息失败',
            message: data.data.msg
          });
        }
      })
    },
    applyForModification() {
      this.dialogUserInfo = true;
    },
    async submitAnApplication() {

      await this.$refs.imageSet.uploadImages();
      this.infoAddForm.imgUrl = this.$refs.imageSet.imageUrls[0].ossUrl;
      // console.log("提交认证信息图片1", this.$refs.imageSet.imageUrls[0].ossUrl);
      // console.log("提交认证信息图片2", this.infoAddForm);

      this.infoAddForm.id = this.$store.state.userInfo.userId;
      console.log(this.infoAddForm);
      submitCertificationInformation(this.infoAddForm).then((response) => {
        if (response.data.code == 1) {
          this.dialogUserInfo = false;
          this.$message({
            message: response.data.msg,
            type: 'success'
          });
          this.updateButton(2)
        } else {
          this.$message({
            message: response.data.msg,
            type: 'error'
          });
        }

      })
    },
    async cancelAuthentication() {
      await executeConfirmedRequest(deleteAuthenticationInformation, this.infoForm.userId, "是否确认取消用户认证？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
      this.getInfo();
    },

    async myInfoExportExcel() {
      console.log("导出execl")
      exportExcel().then((response) => {
        try {
          console.log("res:", response)
          const fileName = `运动员信息${Date.now()}.xlsx`;
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, fileName);
          this.$message.success("导出成功");
        } catch (error) {
          this.$message.error("文件创建或保存失败，请稍后重试");
          console.error("文件创建或保存失败:", error);
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
.user-info-container {
  padding: 20px;
}

.box-card {
  min-height: 400px;
  
  .clearfix {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    span {
      font-size: 16px;
      font-weight: bold;
      
      i {
        margin-right: 8px;
        color: #409EFF;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  
  .action-btn {
    margin-top: 20px;
  }
}

.user-profile {
  padding: 20px;
  
  .profile-left {
    display: flex;
    justify-content: center;
    border-right: 1px solid #ebeef5;
    
    .avatar-container {
      text-align: center;
      
      h3 {
        margin-top: 20px;
        font-size: 24px;
        color: #303133;
      }
      
      p {
        color: #909399;
        margin-top: 10px;
      }
    }
  }
  
  .info-form {
    padding-left: 20px;
    
    .form-actions {
      margin-top: 40px;
      text-align: right;
    }
  }
}
</style>