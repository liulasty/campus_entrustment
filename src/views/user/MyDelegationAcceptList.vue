<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="100px">
            <el-form-item label="委托任务内容" prop="description" class="input-reader-name">
                <el-input v-model="queryParams.description" placeholder="请输入委托内容关键词" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="委托状态" prop="status" class="input-reader-name">
                <el-select v-model="queryParams.status" clearable>
                    <el-option label="委托发布中" value="ONGOING" />
                    <el-option label="委托已完成" value="ACCEPTED" />
                </el-select>
            </el-form-item>
            <el-form-item label="委托类型" prop="taskType" class="input-reader-name">
                <el-select v-model="queryParams.taskType" clearable>
                    <el-option v-for="dict in taskTypeOption" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="委托任务地点" prop="Location" class="input-reader-name">
                <el-select v-model="queryParams.location" clearable>
                    <el-option v-for="dict in locationType" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="发布时间" prop="queryRules" class="input-reader-name">
                <el-select v-model="queryParams.queryRules">
                    <el-option label="最新" value="1" />
                    <el-option label="最早" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>



        <el-table v-loading="loading" :data="viewOnGoingList" :row-style="{ height: '50px' }">
            <el-table-column label="委托接收记录编号" align="center" prop="id" />
            <el-table-column label="委托类型" align="center" prop="type" />
            <el-table-column label="委托描述" align="center" prop="description" show-overflow-tooltip />
            <el-table-column label="委托留言时间" align="center" prop="acceptTime" />
            <el-table-column label="委托留言" align="center" prop="str" />
            <el-table-column label="委托任务地点" align="center" prop="location" />
            <el-table-column label="委托状态" align="center" prop="taskStatus" width="180" />
            <el-table-column label="委托处理状态" align="center" prop="status" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view"
                        @click="handleView(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page=queryParams.pageNum :page-sizes="[5, 7, 10, 15]" :page-size=queryParams.pageSize
            layout="total, sizes, prev, pager, next, jumper" :total="total" />

        <!-- 添加或修改存储委托信息审核记录对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="发布者信息" prop="usersInfo">
                    <el-form-item label="发布者名字" prop="name">
                        {{form.usersInfo.name}}
                    </el-form-item>
                    <el-form-item label="发布者QQ" prop="qqNumber">
                        {{form.usersInfo.qqNumber}}
                    </el-form-item>
                    <el-form-item label="发布者电话" prop="phoneNumber">
                        {{form.usersInfo.phoneNumber}}
                    </el-form-item>
                    <el-form-item label="发布者身份" prop="userRole">
                        {{form.usersInfo.userRole}}
                    </el-form-item>
                </el-form-item>
                <el-form-item label="委托内容" prop="task">
                    <el-form-item label="委托任务内容" prop="name">
                        {{form.task.description}}
                    </el-form-item>
                    <el-form-item label="委托任务地点" prop="qqNumber">
                        {{form.task.location}}
                    </el-form-item>
                    <el-form-item label="委托类型" prop="phoneNumber">
                        {{form.task.type}}
                    </el-form-item>
                    <el-form-item label="委托截止时间" prop="userRole">
                        {{form.task.endTime}}
                    </el-form-item>
                    <el-form-item label="委托金额" prop="money">
                        {{form.task.money}} 元
                    </el-form-item>
                </el-form-item>
                <el-form-item label="留言" prop="delegationStr">
                    {{ form.acceptMessage}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div v-if="Array.isArray(operation.title)">
                    <!-- 多个按钮的情况 -->
                    <el-button v-for="(item, index) in operation.title" :type="operation.type[index]" :key="index"
                        @click="handleButtonClick(operation.click[index])">
                        {{ item }}
                    </el-button>
                </div>
                <div v-else>
                    <!-- 单个按钮的情况 -->
                    <el-button :type="operation.type" @click="handleButtonClick(operation.click)">{{ operation.title
                        }}</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 任务进度更新对话框 -->
        <el-dialog title="更新任务进度" :visible.sync="progressDialogVisible" width="500px" append-to-body>
            <el-form :model="progressForm" label-width="80px">
                <el-form-item label="进度描述">
                    <el-input type="textarea" v-model="progressForm.description" placeholder="请输入任务进度描述，如：已到达目的地..."></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="progressDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitUpdateProgress">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { getTaskCategories, addTaskUpdate } from '@/api/'
    import { acceptDelegationList, queryTheEntrustmentDetailsByEntrustmentNumber, acceptCommission, cancelAcceptorByAcceptor, getTaskAcceptById } from '@/api/user.js'
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction.js'
    export default {
        data() {
            return {
                progressDialogVisible: false,
                progressForm: {
                    description: ''
                },
                // 遮罩层
                loading: true,
                //委托留言
                delegationStr: "",

                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                // 存储委托记录表格数据
                viewOnGoingList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                },
                // 地点类型数组
                locationType: [
                    {
                        value: '教学楼',
                        label: '教学楼'
                    },
                    {
                        value: '图书馆',
                        label: '图书馆'
                    },
                    {
                        value: '食堂',
                        label: '食堂'
                    },
                    {
                        value: '运动场',
                        label: '运动场'
                    },
                    {
                        value: '实验室',
                        label: '实验室'
                    },
                    {
                        value: '其他',
                        label: '其他'
                    },
                ],
                //委托操作类型
                taskTypeOption: [
                    { label: "委托", value: 1 },
                    { label: "取消委托", value: 2 }
                ],
                //委托类型
                taskType: {
                },
                operations: {
                    "待处理": {
                        index: 0,
                        title: ["取消待接收"],
                        type: ["info"],
                        click: ["cancelAcceptor"]
                    },
                    "已取消": {
                        index: 1,
                        title: [],
                        type: [],
                        click: []
                    },
                    "已过期": {
                        index: 2,
                        title: [],
                        type: [],
                        click: []
                    },
                    "未选中": {
                        index: 3,
                        title: [],
                        type: [],
                        click: []
                    },
                    "已接收": {
                        index: 4,
                        title: ["更新进度", "觉得很赞", "觉得很差"],
                        type: ["primary", "success", "warning"],
                        click: ["openUpdateProgress", "increaseGood", "increaseBad"]
                    },

                },
                operation: {},
                //身份信息
                identity: {
                    'student': '学生',
                    "teacher": "老师",
                    "admin": "管理员"
                },


                // 表单参数
                form: {
                    usersInfo: {
                        name: "",
                    },
                    task: {},
                    acceptMessage: "",
                },
            };
        },
        created() {
            this.handleType();


        },
        mounted() {
            this.handleQuery();
        },
        methods: {
            /** 获取委托类型操作 */
            handleType() {
                //获取类型
                getTaskCategories().then((data) => {
                    this.taskTypeOption = [];
                    if (data.data.code === 1) {

                        if (data.data.data.length > 0) {

                            const taskCategories = data.data.data;

                            for (let i = 0; i < taskCategories.length; i++) {
                                //生成键值对
                                this.taskType[`${taskCategories[i].id}`] = `${taskCategories[i].name}`
                                this.taskTypeOption.push({ label: taskCategories[i].name, value: taskCategories[i].id })
                            }
                            // console.log("类型信息", this.tabPanes);
                            // console.log(this.taskType);
                            // console.log("类型数组", this.taskTypeOption);
                        }
                    }
                })
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;

                // console.log("搜索参数：", this.queryParams);
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            getList() {
                this.loading = true;
                acceptDelegationList(this.queryParams).then(response => {
                    if (response.data.code == 1) {
                        this.viewOnGoingList = response.data.data.records.map((record) => {

                            record.type = this.taskType[`${record.taskType}`]; // 确保类型安全

                            return record;
                        });
                        console.log("列表数据", this.viewOnGoingList);

                        this.total = response.data.data.total;
                        this.loading = false;

                    } else {
                        this.$message({
                            message: response.data.msg,
                            type: 'error'
                        });
                        this.loading = false;
                    }

                });
            },
            handleView(row) {
                console.log(row);
                this.delegationStr = ""
                getTaskAcceptById(row.taskId).then(response => {
                    if (response.data.code === 1) {
                        console.log("接收记录详情", response.data.data);
                        this.form.acceptMessage = response.data.data.str;
                        queryTheEntrustmentDetailsByEntrustmentNumber(row.taskId).then(response => {
                            if (response.data.code === 1) {
                                this.form.task = response.data.data.task;
                                this.form.usersInfo = response.data.data.usersInfo;
                                this.form.usersInfo.userRole = this.identity[this.form.usersInfo.userRole];
                                this.form.task.type = this.taskType[`${this.form.task.type}`];
                                this.operation = this.operations[`${row.status}`];
                                this.form.id = row.id;
                                console.log("委托接收记录详情", this.form);
                                this.open = true;
                            } else {
                                this.$message(
                                    {
                                        message: response.data.msg,
                                        type: 'error'
                                    }
                                )
                            }
                        });
                    } else {
                        this.$message(
                            {
                                message: response.data.msg,
                                type: 'error'
                            }
                        )
                        return;
                    }
                })


            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.queryParams.pageSize = val
                this.getList();
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.queryParams.pageNum = val
                this.getList();
            },
            resetForm(formRef) {
                if (this.$refs[formRef]) {
                    this.$refs[formRef].resetFields();
                    console.log("表单已重置！");
                } else {
                    console.error("未找到指定的表单引用！");
                }
            },
            /** 引导按钮操作 */
            handleButtonClick(actionName) {
                console.log("点击按钮", actionName);
                // 在这里实现点击按钮时调用的逻辑，例如：
                this[actionName]()
                // this[actionName]() 或者 this.$emit(actionName)
                // 具体实现取决于您的项目需求和上下文
            },
            /** 取消接收 */
            cancelAcceptor() {
                const acceptRecordId = this.form.id;
                console.log("委托接收记录id", acceptRecordId)
                executeConfirmedRequest(cancelAcceptorByAcceptor, acceptRecordId, "确认取消接受委托", "确认取消接受委托", "取消委托成功", "取消接受委托失败", "取消接受委托失败", "取消接受委托取消")
            },
            /** 提交留言 */
            acceptsTheEntrustment() {
                const data = {
                    task: this.form.task.taskId,
                    str: this.delegationStr,
                    user: this.$store.state.userInfo.userId
                }
                console.log("提交留言", this.delegationStr);
                if (this.delegationStr === "") {
                    this.$message(
                        {
                            message: "请留下你所提供的信息",
                            type: 'error'
                        }
                    )
                    return;
                }
                executeConfirmedRequest(acceptCommission, data, "确认接受委托", "确认接受委托", "接受委托成功,等待委托发布者处理", "接受委托失败", "接受委托失败", "接受委托取消");
                this.getList();
                this.open = false;
            },
            openUpdateProgress() {
                this.progressForm.description = '';
                this.progressDialogVisible = true;
            },
            async submitUpdateProgress() {
                if (!this.progressForm.description) {
                    this.$message.error('请输入进度描述');
                    return;
                }
                
                const data = {
                    taskId: this.form.task.taskId,
                    description: this.progressForm.description
                };

                await executeConfirmedRequest(
                    addTaskUpdate,
                    data,
                    "确认提交任务进度？",
                    "提示",
                    "提交",
                    "提交成功",
                    "提交失败",
                    "已取消"
                );
                
                this.progressDialogVisible = false;
            }
        }


    }
</script>
<style scoped>
    .el-input {
        width: 180px;
    }

    .el-select {
        width: 130px;
    }
</style>