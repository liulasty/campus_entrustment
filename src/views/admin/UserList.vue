<template>
    <div>
        <el-row :gutter="18">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="userInfoConfig.username">
                        <template slot="prepend">账号</template>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-input name="邮箱" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="userInfoConfig.email">
                        <template slot="prepend">邮箱</template>
                    </el-input>
                </div>

            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-select name="是否激活" v-model="userInfoConfig.isActive" clearable placeholder="请选择">
                        <el-option label="激活" value=TRUE>
                        </el-option>
                        <el-option label="未激活" value=FALSE>
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-button type="primary" @click="getUserPage()">查询</el-button>
                </div>
            </el-col>
        </el-row>
        <div>
            <div style="margin-top: 20px">
                <el-button @click="deleteAndSelectAllAccounts()">删除选中所有账号</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column prop="username" label="账号" width="120">
                </el-table-column>
                <el-table-column label="角色" width="70">
                    <template slot-scope="scope">
                        <div v-if="scope.row.role == 'ADMIN'">
                            管理员
                        </div>
                        <div v-else>
                            用户
                        </div>
                    </template>

                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="170">
                </el-table-column>

                <el-table-column label="注册日期" width="180">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column prop="isActive" label="是否激活" width="70">
                </el-table-column>
                <el-table-column label="激活日期" width="180">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isActive == '已激活'">
                            {{ scope.row.activeTime }}
                        </div>
                        <div v-else>
                            <el-button size="small" @click="auxiliaryActivation(scope.row.userId)">辅助激活</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="认证状态" width="70">
                    <template slot-scope="scope">
                        <div v-if="scope.row.role == 'admin'">
                            管理员
                        </div>
                        <div v-else>
                            {{ scope.row.authStatus }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="450" fixed="right">
                    <el-table-column label="账号" width="120">
                        <template slot-scope="scope">
                            <div v-show="scope.row.role != 'admin'">
                                <el-button type="warning" size="small" @click="handleDelete(scope.row.userId)"
                                    round>删除</el-button>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column label="认证" width="230">
                        <template slot-scope="scope">
                            <div v-show="scope.row.authStatus == '认证中'">
                                <el-button type="primary" size="small"
                                    @click="reviewAndCertificationInformation(scope.row.userId)">审核认证信息</el-button>
                            </div>
                            <div v-show="scope.row.authStatus == '认证失败'">
                                <el-button type="primary" size="small" disabled>认证失败</el-button>
                                <el-button type="primary" size="small"
                                    @click="deleteRecords(scope.row.userId)">删除认证记录</el-button>
                            </div>
                            <div v-show="scope.row.authStatus == '认证通过'">
                                <el-button type="primary" size="small"
                                    @click="viewCertificationInformation(scope.row.userId)">查看认证信息</el-button>
                            </div>

                        </template>

                    </el-table-column>
                    <el-table-column label="是否启用" width="100">
                        <template slot-scope="scope">
                            <div v-show="scope.row.role != 'ADMIN'">
                                <el-button type="warning" size="small" @click="handleEnable(scope.row)" round>
                                    {{scope.row.isEnabled }}</el-button>
                            </div>

                        </template>
                    </el-table-column>

                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :hide-on-single-page="hide_on_single_page" :current-page=userInfoConfig.page
                    :page-sizes="[5, 7, 10, 15]" :page-size=userInfoConfig.size
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <el-drawer :title="title" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
                custom-class="demo-drawer" ref="drawer" size="40%">
                <el-card shadow="never">
                    <el-form :model="form" label-position="left" size="small">
                        <el-form-item label="姓名" :label-width="formLabelWidth">
                            <span>{{ form.name }}</span>
                        </el-form-item>

                        <el-form-item label="手机号码" :label-width="formLabelWidth">
                            <span>{{ form.phoneNumber }}</span>
                        </el-form-item>

                        <el-form-item label="QQ 号码" :label-width="formLabelWidth">
                            <span>{{ form.qqNumber }}</span>
                        </el-form-item>

                        <el-form-item label="认证图片" :label-width="formLabelWidth">
                            <el-image style="width: 200px; height: 200px" :src="form.roleImgSrc" fit="fit"
                                :preview-src-list="srcList"></el-image>
                        </el-form-item>

                        <el-form-item label="用户角色" :label-width="formLabelWidth">
                            <span>{{ form.userRole }}</span>
                        </el-form-item>

                        <el-form-item label="认证时间" :label-width="formLabelWidth">
                            <span>{{ form.certifieTime }}</span>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth">
                            <div v-show="form.authStatus == '认证中'">
                                <el-button @click="cancelForm" size="medium">认 证 不 通 过</el-button>
                                <el-button type="primary" @click="approvedCard()" size="medium">通 过 认
                                    证</el-button>
                            </div>
                            <div v-show="form.authStatus == '认证通过'">
                                <el-button type="warning" @click="cancelUserAuthentication(form.userId)"
                                    size="medium">取消该用户认证</el-button>
                            </div>

                        </el-form-item>
                    </el-form>
                </el-card>
                <div class="demo-drawer__content">

                    <div class="demo-drawer__footer">

                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
    import { getUserInfo, getUserList, confirmToPassTheReview, refuseToPassReview, deleteCertificationRecords, cancelUserInfoAuthentication, adminActivation, deleteAccounts, handleEnableAdmin, handleDisableAdmin } from '@/api';
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'

    export default {
        data() {
            return {
                hide_on_single_page: true,
                userInfoConfig: {
                    username: "",
                    email: "",
                    isActive: "",
                    size: 5,
                    page: 1
                },
                total: 0,
                userList: [],
                tableData: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },],
                multipleSelection: [],
                table: false,
                dialog: false,
                loading: false,
                form: {
                    name: '',
                    phoneNumber: '',
                    qqNumber: '',
                    roleImgSrc: '',
                    userRole: '',
                    certifieTime: '',

                },
                srcList: [],
                formLabelWidth: '200px',
                timer: null,
                title: '',
            }
        },
        methods: {
            getUserPage() {
                // console.log("查询参数：", this.userInfoConfig);
                getUserList(this.userInfoConfig).then((res) => {

                    this.tableData = this.handleValue(res.data.data.records)
                    this.total = res.data.data.total
                    console.log("展示的数据：", this.tableData);
                })
            },
            //单个删除用户
            handleDelete(id) {
                deleteAccounts(id).then((res) => {
                    console.log("删除成功");
                    this.getUserPage()
                })
            },
            handleValue(data) {
                data.forEach(item => {
                    item.isActive = item.isActive == true ? "已激活" : "未激活"
                    item.isEnabled == false ? item.isEnabled = "启用" : item.isEnabled = "禁用"
                })
                return data
            }
            ,
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                console.log(val);
                this.multipleSelection = val;
            },
            //删除选中用户
            deleteAndSelectAllAccounts() {
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        message: '请选择要删除的用户',
                        type: 'warning'
                    });
                    return;
                } else {
                    executeConfirmedRequest(deleteAccounts, this.multipleSelection.map(item => item.userId), "确认删除选中的用户吗？", "删除成功", "删除失败", "删除失败，请稍后重试", "删除成功", "删除失败，请稍后重试", "删除失败，请稍后重试").then(() => {
                        this.getUserPage()
                    })
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.userInfoConfig.size = val
                this.getUserPage()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.userInfoConfig.page = val
                this.getUserPage()
            },

            //打开审核窗口，查看审核信息
            reviewAndCertificationInformation(id) {
                this.dialog = true;
                this.title = "审核认证信息"
                getUserInfo(id).then((res) => {
                    if (res.data.code == 1) {
                        console.log(res.data.data);
                        const info = res.data.data
                        info.roleImgSrc = "http://campus-entrustment.oss-cn-beijing.aliyuncs.com/" + info.roleImgSrc
                        this.srcList = [info.roleImgSrc]
                        this.form = info
                    } else {
                        this.dialog = false;
                        this.$message({
                            message: '警告哦，这是一条警告消息',
                            type: 'warning'
                        });
                    }
                    // console.log("获取用户信息,", this.form);

                })
            },
            handleClose() {
                if (this.loading) {
                    return;
                }
                this.loading = false;
                this.dialog = false;
                clearTimeout(this.timer);
            },
            //查看已认证审核信息
            async viewCertificationInformation(id) {
                this.dialog = true;
                this.title = "已认证审核信息"
                getUserInfo(id).then((res) => {
                    if (res.data.code == 1) {
                        console.log(res.data.data);
                        const info = res.data.data
                        info.roleImgSrc = "http://campus-entrustment.oss-cn-beijing.aliyuncs.com/" + info.roleImgSrc
                        this.srcList = [info.roleImgSrc]
                        this.form = info
                    } else {
                        this.dialog = false;
                        this.$message({
                            message: '警告哦，这是一条警告消息',
                            type: 'warning'
                        });
                    }
                    // console.log("获取用户信息,", this.form);

                })
            },
            //拒绝通过审核
            async cancelForm() {
                await executeConfirmedRequest(refuseToPassReview, this.form.userId, '是否确认拒绝通过审核吗？', '提示', '警告', '操作警告', '操作失败，请稍后重试', '操作已取消');
                this.handleClose();
                this.getUserPage()

            },
            //确认通过审核
            async approvedCard() {

                await executeConfirmedRequest(confirmToPassTheReview, this.form.userId);
                this.handleClose();
                this.getUserPage()
            },
            //删除认证审核记录
            async deleteRecords(id) {

                await executeConfirmedRequest(deleteCertificationRecords, this.form.userId, "是否确认删除该认证记录？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
                this.handleClose();
                this.getUserPage()
            },
            //取消该用户认证
            async cancelUserAuthentication() {
                await executeConfirmedRequest(cancelUserInfoAuthentication, this.form.userId, "是否确认取消该用户认证？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
                this.handleClose();
                this.getUserPage()
            },
            // 辅助激活
            async auxiliaryActivation(id) {
                await executeConfirmedRequest(adminActivation, id, "是否确认激活该用户账号用于登录网站使用？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
                this.handleClose();
                this.getUserPage()
            },
            // handleEnable
            async handleEnable(data) {
                console.log(data);
                if (data.isEnabled === '禁用') {
                    await executeConfirmedRequest(handleDisableAdmin, data.userId, "是否确认启用该用户账号？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
                } else {
                    await executeConfirmedRequest(handleEnableAdmin, data.userId, "是否确认禁用该用户账号？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
                }

                this.getUserPage()
            }
        },
        mounted() {
            this.getUserPage();
        }
    }
</script>
<style lang="less" scoped></style>