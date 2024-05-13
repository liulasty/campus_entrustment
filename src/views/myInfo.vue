<template>
    <div>
        <div v-if="code != 4">
            <div>
                <el-empty :description="this.msg"></el-empty>
            </div>
            <div>
                <div v-if="code != 2" style="text-align: center;">
                    <el-button type="primary" @click="applyForModification()">{{ button }}</el-button>
                </div>
            </div>

        </div>
        <div v-else>
            <div>
                <el-form :model="infoForm" ref="infoForm" :label-position="labelPosition" label-width="150px"
                    class="demo-infoForm" style="width: 600px;">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="infoForm.name" class="form-item-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="age">
                        <el-input v-model="infoForm.phoneNumber" controls-position="left" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="认证通过时间" prop="certifiedTime">
                        <el-input v-model="infoForm.certifiedTime" controls-position="left" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="qq号" prop="contact">
                        <el-input v-model="infoForm.qqNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="认证身份" prop="userRole">
                        <el-input v-model="infoForm.userRole" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="applyForModification()">申请修改</el-button>
                        <el-button @click="cancelAuthentication()">取消认证</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </div>

        <div>
            <el-dialog title="申请认证" :visible.sync="dialogUserInfo">
                <el-form :model="infoAddForm" label-width="100px" class="demo-infoUpdateForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="infoAddForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model="infoAddForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="qq账号" prop="qq">
                        <el-input v-model="infoAddForm.qq"></el-input>
                    </el-form-item>
                    <el-form-item label="认证照片" prop="img">
                        <ImageUploader ref="imageSet" />
                    </el-form-item>

                    <el-form-item label="认证角色" prop="role">
                        <el-radio-group v-model="infoAddForm.role">
                            <el-radio value="student" label="student">学生</el-radio>
                            <el-radio value="teacher" label="teacher">教师</el-radio>
                            <el-radio value="other" label="other">其他</el-radio>
                        </el-radio-group>

                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitAnApplication()">提交申请</el-button>
                    <el-button @click="dialogUserInfo = false">取消提交</el-button>
                </div>

            </el-dialog>

        </div>

    </div>
</template>
<script>
    import { getUserInfo, submitCertificationInformation, deleteAuthenticationInformation } from '@/api'
    import { updateAthlete } from '@/api'
    import ImageUploader from '@/components/ImageUploader.vue'
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'

    export default {
        components: { ImageUploader },
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
                playerInfo: {
                },

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
                console.log("取消认证,删除认证信息", this.infoForm.userId);
                await executeConfirmedRequest(deleteAuthenticationInformation, this.infoForm.userId, "是否确认取消用户认证？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
                this.getInfo();
            }
        }
    }
</script>