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
                    <el-option label="委托已过期" value="EXPIRED" />
                    <el-option label="委托已取消" value="CANCELLED" />

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
                    <el-option label="最新" value="0" />
                    <el-option label="最早" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>



        <el-table v-loading="loading" :data="viewOnGoingList" :row-style="{ height: '50px' }">
            <el-table-column label="委托类型" align="center" prop="type" />
            <el-table-column label="委托描述" align="center" prop="description" show-overflow-tooltip />
            <el-table-column label="委托发布时间" align="center" prop="startTime" />
            <el-table-column label="委托截止时间" align="center" prop="endTime" />
            <el-table-column label="委托任务地点" align="center" prop="location" />
            <el-table-column label="委托状态" align="center" prop="status" width="180" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view"
                        @click="handleView(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page=queryParams.pageNum :page-sizes="[3, 5, 7, 10]" :page-size=queryParams.pageSize
            layout="total, sizes, prev, pager, next, jumper" :total="total" />

        <!-- 处理接收委托信息审核框 -->
        <el-dialog :title="title" :visible.sync="open" top="10px" width="750px">
            <div>

            </div>
            <el-descriptions class="margin-top" title="委托内容" :column="3" border>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        委托任务内容
                    </template>
                    {{form.task.description}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-mobile-phone"></i>
                        委托任务地点
                    </template>
                    {{form.task.location}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-location-outline"></i>
                        委托类型
                    </template>
                    {{form.task.type}}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        委托发布时间
                    </template>
                    <el-tag size="small">{{form.task.startTime}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-office-building"></i>
                        委托截止时间
                    </template>
                    <el-tag size="small">{{form.task.endTime}}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-money"></i>
                        委托金额
                    </template>
                    {{form.task.money}} 元
                </el-descriptions-item>
            </el-descriptions>
            <el-card v-show="form.task.status === '委托发布中'" class="box-card" style="margin-top: 10px;">
                <div style="height: 250px;" v-show="form.taskAcceptRecordsStatus">
                    <div slot="header" class="clearfix" style="margin-bottom: 5px;">
                        <span>该委托接收情况</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    </div>
                    <ul class="infinite-list" style="height: 250px;overflow:auto;margin-bottom: 15px; ">
                        <li v-for="record in form.taskAcceptRecords" class="infinite-list-item">
                            <el-descriptions :column="6" direction="vertical" border>
                                <el-descriptions-item label="用户" labelStyle="width: 100px">
                                    {{record.userName}}
                                </el-descriptions-item>


                                <el-descriptions-item label="身份" labelStyle="width: 100px">
                                    <el-tag size="small">{{record.userType}}</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item label="留言" labelStyle="width: 150px">
                                    {{record.taskAcceptRecords.str}}</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item label="接收时间" labelStyle="width: 200px"
                                    :contentStyle="{'text-align': 'left'}">
                                    {{ record.taskAcceptRecords.acceptTime}}
                                </el-descriptions-item>
                                <el-descriptions-item label="留言者完成委托情况" labelStyle="width: 100px">
                                    <el-tooltip class="item" effect="dark" :content="record.entrustedCompletionStatus"
                                        placement="top">
                                        <el-button type="info">查看</el-button>
                                    </el-tooltip>
                                </el-descriptions-item>
                                <el-descriptions-item label="操作" labelStyle="width: 100px"
                                    :contentStyle="{'text-align': 'left'}">
                                    <el-button type="primary" size="small"
                                        @click="handleAccept(record.taskAcceptRecords.id)">采取</el-button>
                                </el-descriptions-item>
                            </el-descriptions>
                        </li>
                    </ul>
                </div>
                <div style="height: 250px;" v-show="!form.taskAcceptRecordsStatus">
                    <loadingVue text="该为委托目前无人接收"></loadingVue>
                </div>
            </el-card>

            <el-card v-show="form.task.status === '已接收' || form.task.status === '已完成'" class="box-card" style="margin-top: 10px;">
                <div slot="header" class="clearfix">
                    <span>任务动态</span>
                </div>
                <div style="max-height: 200px; overflow-y: auto;">
                    <el-timeline>
                        <el-timeline-item
                            v-for="(activity, index) in taskUpdates"
                            :key="index"
                            :timestamp="activity.updateTime"
                            :color="['进度更新', 5, 'PROGRESS_UPDATE'].includes(activity.updateType) ? '#0bbd87' : ''">
                            {{activity.updateDescription}}
                            <el-tag size="mini" v-if="['进度更新', 5, 'PROGRESS_UPDATE'].includes(activity.updateType)" type="success">进度</el-tag>
                        </el-timeline-item>
                    </el-timeline>
                    <div v-if="taskUpdates.length === 0" style="text-align: center; color: #909399;">暂无动态</div>
                </div>
            </el-card>

            <el-card v-show="form.task.status === '已接收'" class="box-card" style="margin-top: 10px;">

                <div slot="header" class="clearfix" style="margin-bottom: 5px;">
                    <el-rate v-model="taskRateValue" show-text text-color="#ff9900">
                    </el-rate>
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入完成委托评价"
                        v-model="completeTheEntrustedEvaluation">
                    </el-input>
                </div>

            </el-card>
            <el-card v-show="form.task.status === '已完成'" class="box-card" style="margin-top: 10px;">

                <div slot="header" class="clearfix" style="margin-bottom: 5px;">
                    <el-rate v-model="taskRateValue" show-text text-color="#ff9900">
                    </el-rate>
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入完成委托评价"
                        v-model="completeTheEntrustedEvaluation">
                    </el-input>
                </div>

            </el-card>

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
    </div>
</template>
<script>
    import { getTaskCategories, listDelegateUpdateRecords } from '@/api/'
    import {
        publishDelegationList, queryTheEntrustmentDetailsByEntrustmentNumber, confirmTheRecipient,
        cancelPublishUser, updateDelegationCompleted
    } from '@/api/user.js'
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction.js'
    import loadingVue from '@/components/Loading.vue'
    export default {
        components: {
            loadingVue
        },
        data() {

            return {
                taskUpdates: [],
                //委托描述
                descriptions: "",
                count: 0,
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
                    pageSize: 5,
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
                    "委托发布中": {
                        index: 0,
                        title: ["取消发布"],
                        type: ["warning"],
                        click: ["cancelPublish"]
                    },
                    "已接收": {
                        index: 1,
                        title: ["确认完成", "该委托未完成"],
                        type: ["success", "warning"],
                        click: ["confirmTheRecipientDelegation", "cancelTheRecipientDelegation"]
                    },
                    "已过期": {
                        index: 2,
                        title: ["回退为草稿", "删除该委托"],
                        type: ["info", "warning"],
                        click: ["fallbackDraftByPublisher", "deleteDelegation"]
                    },
                    "已取消": {
                        index: 3,
                        title: ["回退为草稿", "删除该委托"],
                        type: ["info", "warning"],
                        click: ["fallbackDraftByPublisher", "deleteDelegation"]
                    },
                    "已完成": {
                        index: 4,
                        title: ["删除该委托"],
                        type: ["warning"],
                        click: ["deleteDelegation"]
                    },
                    "未完成": {
                        index: 5,
                        title: ["删除该委托"],
                        type: ["warning"],
                        click: ["deleteDelegation"]
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
                    taskAcceptRecords: []
                },

                taskRateValue: 1,
                completeTheEntrustedEvaluation: "",



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
                publishDelegationList(this.queryParams).then(response => {
                    if (response.data.code == 1) {
                        this.viewOnGoingList = response.data.data.records.map((record) => {

                            record.type = this.taskType[`${record.type}`]; // 确保类型安全

                            return record;
                        });


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
                this.form = {
                    usersInfo: {
                        name: "",
                    },
                    task: {},
                    taskAcceptRecords: []
                }
                queryTheEntrustmentDetailsByEntrustmentNumber(row.taskId).then(response => {
                    if (response.data.code === 1) {

                        this.form = response.data.data;

                        this.form.usersInfo.userRole = this.identity[this.form.usersInfo.userRole];
                        this.form.task.type = this.taskType[`${this.form.task.type}`];
                        this.form.taskAcceptRecords.forEach(element => {
                            element.entrustedCompletionStatus = "已完成委托次数: " + element.taskAccomplishCount + ", 委托完成评分: " + element.taskAccomplishGrade;
                        });
                        this.operation = this.operations[`${this.form.task.status}`]
                        console.log("已发布的委托信息", this.form);
                        
                        if (this.form.task.status === '已接收' || this.form.task.status === '已完成') {
                            this.getTaskUpdates(this.form.task.taskId);
                        }
                        
                        this.getDelegationAcceptListLength();
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

            },
            getTaskUpdates(taskId) {
                this.taskUpdates = [];
                listDelegateUpdateRecords({
                    taskId: taskId,
                    pageNum: 1,
                    pageSize: 100 
                }).then(response => {
                    if (response.data.code === 1) {
                        this.taskUpdates = response.data.data.records;
                    }
                });
            },
            getDelegationAcceptListLength() {

                if (this.form.taskAcceptRecords.length <= 0) {

                    this.form.taskAcceptRecordsStatus = false;
                } else {
                    console.log("该委托接收记录数", this.form.taskAcceptRecords.length, this.form.taskAcceptRecords.length === 0);
                    this.form.taskAcceptRecordsStatus = true;
                }
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
            handleAccept(id) {
                executeConfirmedRequest(confirmTheRecipient, id, "是否将此委托托付给该接收者", "确认接受委托者", "确认成功,等待接收者完成委托任务", "确认失败");
                this.getList();
                this.open = false;
            },
            increaseGood() {
                executeConfirmedRequest(increaseGood, this.form.task.taskId, "是否确认增加积分", "确认增加积分", "确认成功,积分已增加", "确认失败");
            },
            decreaseGood() {
                executeConfirmedRequest(decreaseGood, this.form.task.taskId, "是否确认减少积分", "确认减少积分", "确认成功,积分已减少", "确认失败");
            },
            cancelPublish() {
                executeConfirmedRequest(cancelPublish, this.form.task.taskId, "是否确认取消发布", "确认取消发布", "确认成功,取消发布成功", "确认失败");
            },
            fallbackDraftByPublisher() {
                executeConfirmedRequest(fallbackDraftByPublisher, this.form.task.taskId, "是否确认撤回", "确认撤回", "确认成功,撤回成功", "确认失败");
            },
            deleteDelegation() {
                executeConfirmedRequest(deleteDelegation, this.form.task.taskId, "是否确认删除", "确认删除", "确认成功,删除成功", "确认失败");
            },
            cancelPublish() {
                executeConfirmedRequest(cancelPublishUser, this.form.task.taskId, "是否确认取消发布", "确认取消发布", "确认成功,取消发布成功", "确认失败");
            },
            confirmTheRecipientDelegation() {
                console.log("确认该委托已完成", this.form.task.taskId, this.completeTheEntrustedEvaluation, this.taskRateValue);
                if (this.completeTheEntrustedEvaluation && this.taskRateValue) {
                    const data = {
                        taskId: this.form.task.taskId,
                        taskAccomplishGrade: this.taskRateValue,
                        taskAccomplishReview: this.completeTheEntrustedEvaluation
                    }
                    executeConfirmedRequest(updateDelegationCompleted, data, "是否确认该委托已完成", "确认该委托已完成", "确认完成，已提交完成信息", "确认失败");
                } else {
                    this.$message({
                        message: "请填写委托完成评价和评分",
                        type: 'error'
                    })
                }
            }

        }

    }

</script>
<style lang="css" scoped>
    .el-input {
        width: 180px;
    }

    .el-select {
        width: 130px;
    }

    .my-label {
        background: #E1F3D8;
    }

    .my-content {
        background: #FDE2E2;
    }

    /* .el-dialog__body {
        padding: 10px 30px;
    } */
</style>