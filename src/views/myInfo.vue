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

                    <el-form-item label="性别" prop="gender">
                        <div class="form-item-input">
                            <el-radio v-model="infoForm.gender" label="男" disabled>男</el-radio>
                            <el-radio v-model="infoForm.gender" label="女" disabled>女</el-radio>
                        </div>
                    </el-form-item>

                    <el-form-item label="年龄" prop="age">
                        <el-input v-model="infoForm.age" controls-position="left" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="参赛年级" prop="grade">
                        <el-radio-group v-model="infoForm.grade" disabled>
                            <el-radio label="一年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="二年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="三年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="四年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="五年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="六年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="七年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="八年级" name="grade" style="height: 30px;"></el-radio>
                            <el-radio label="九年级" name="grade" style="height: 30px;"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="电话号码" prop="contact">
                        <el-input v-model="infoForm.contact" disabled></el-input>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="applyForModification()">申请修改</el-button>
                        <el-button @click="CancelAuthentication('infoForm')">取消认证</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-input v-model="infoForm.name" class="form-item-input" disabled></el-input>
            </div>
        </div>

        <div>
            <el-dialog title="申请认证" :visible.sync="dialogUserInfo">
                <el-form :model="infoAddForm" ref="infoUpdateForm" label-width="100px" class="demo-infoUpdateForm">
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
                    <el-form-item>
                        <el-button type="primary" @click="submitAnApplication()">提交申请</el-button>
                        <el-button @click="dialogUserInfo = false">取消提交</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>
            <el-dialog title="修改活动" :visible.sync="dialogUpdateForm">
                <el-form :model="infoUpdateForm" ref="infoUpdateForm" label-width="100px" class="demo-infoUpdateForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="infoUpdateForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="性别" prop="gender">
                        <el-radio v-model="infoUpdateForm.gender" label="男">男</el-radio>
                        <el-radio v-model="infoUpdateForm.gender" label="女">女</el-radio>
                    </el-form-item>

                    <el-form-item label="年龄" prop="age">
                        <el-input-number v-model="infoUpdateForm.age" controls-position="right" :min="18"
                            :max="64"></el-input-number>
                    </el-form-item>

                    <el-form-item label="参赛年级" prop="grade">
                        <el-radio-group v-model="infoUpdateForm.grade">
                            <el-radio label="一年级" name="grade"></el-radio>
                            <el-radio label="二年级" name="grade"></el-radio>
                            <el-radio label="三年级" name="grade"></el-radio>
                            <el-radio label="四年级" name="grade"></el-radio>
                            <el-radio label="五年级" name="grade"></el-radio>
                            <el-radio label="六年级" name="grade"></el-radio>
                            <el-radio label="七年级" name="grade"></el-radio>
                            <el-radio label="八年级" name="grade"></el-radio>
                            <el-radio label="九年级" name="grade"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="电话号码" prop="contact">
                        <el-input v-model="infoUpdateForm.contact"></el-input>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="UpdateInfo()">申请修改</el-button>
                        <el-button @click="dialogUpdateForm = false">取消修改</el-button>
                    </el-form-item>
                </el-form>

            </el-dialog>
        </div>

    </div>
</template>
<script>
import { getUserInfo, submitCertificationInformation } from '@/api'
import { updateAthlete } from '@/api'
import ImageUploader from '@/components/ImageUploader.vue'

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
                console.log("用户账号id", data.data.code);
                if (data.data.code === 1) {
                    const info = data.data.data
                    console.log("用户信息", info);
                    if (info == null) {
                        this.updateButton(1)
                    } else if (info.authStatus === 'AUTHENTICATING') {

                        this.updateButton(2)

                    } else if (info.authStatus === 'AUTHENTICATION_FAILED') {
                        this.updateButton(3)
                    } else {
                        this.updateButton(4)
                    }
                    console.log("展示页面", info.authStatus);
                } else {

                }
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
        submitAnApplication() {
            this.$refs.imageSet.uploadImages();
            this.infoAddForm.imgUrl = this.$refs.imageSet.imageUrls[0].ossUrl;
            this.infoAddForm.id = this.$store.state.userInfo.userId;
            console.log(this.infoAddForm);
            submitCertificationInformation(this.infoAddForm).then((response) => {
                if (response.data.code == 1) {
                    this.dialogUserInfo = false;
                    this.$message({
                        message: response.data.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: response.data.msg,
                        type: 'error'
                    });
                }

            })
        }
    }
}
</script>
