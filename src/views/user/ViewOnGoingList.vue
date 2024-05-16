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
            <el-table-column label="委托发布者ID" align="center" prop="ownerId" />
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
            :current-page=queryParams.pageNum :page-sizes="[5, 7, 10, 15]" :page-size=queryParams.pageSize
            layout="total, sizes, prev, pager, next, jumper" :total="total" />

        <!-- 添加或修改存储委托信息审核记录对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="850px" top="10px" append-to-body>
            <el-row>
                <el-col :span="12">
                    <el-card class="box-card Info-card">
                        <el-form ref="form" :model="form" label-width="110px">

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


                        </el-form>

                    </el-card>


                </el-col>
                <el-col :span="12">
                    <el-card class="box-card publisher-card">
                        <div slot="header" class="clearfix">
                            <span>该委托发布者发布情况</span>

                            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                        </div>
                        <el-row :gutter="20">
                            <el-col :span="10" class="el-statistic-wrapper">
                                <div>
                                    <el-statistic :value="form.taskPublishedTotal" title="当前已发布委托数">
                                    </el-statistic>
                                </div>
                            </el-col>
                            <el-col :span="10" class="el-statistic-wrapper">
                                <div>
                                    <el-statistic :value="form.taskAcceptedTotal" title="发布委托已完成数">
                                    </el-statistic>
                                </div>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10" class="el-statistic-wrapper">
                                <div>
                                    <el-statistic :value="form.taskCanceledTotal" title="已取消发布委托数">
                                    </el-statistic>
                                </div>
                            </el-col>
                            <el-col :span="10" class="el-statistic-wrapper">
                                <div>
                                    <el-statistic :value="form.taskOverdueTotal" title="已过期发布委托数">
                                    </el-statistic>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                    <div v-show="form.task.status=='已完成'">
                        <el-rate v-model="taskRateValue" disabled show-score text-color="#ff9900"
                            score-template="{value}">
                        </el-rate>

                        <!-- <el-rate v-model="value2" :colors="colors">
                        </el-rate> -->
                    </div>
                    <div v-show="form.task.status=='委托发布中'">
                        <div v-if="!isPublisher(form.task)">
                            <div v-show="form.taskAcceptRecords === null">
                                <el-input type="textarea" v-model="delegationStr" placeholder="请输入你的接收委托留言信息"
                                    size="large" rows="6" maxlength="180">
                                </el-input>
                            </div>
                            <div v-show="form.taskAcceptRecords !== null">
                                <el-tag type="info">请在我的委托-我的接收里查看详情</el-tag>

                            </div>
                        </div>
                        <div v-if="isPublisher(form.task)">
                            <el-tag type="info">请在我的委托-我的发布里查看详情</el-tag>
                        </div>



                    </div>

                </el-col>
            </el-row>

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
    import { getTaskCategories } from '@/api/'
    import { listViewOnGoingList, getTaskAndPublishUserInfoByTaskId, acceptCommission } from '@/api/user.js'
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction.js'
    export default {
        data() {
            return {
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
                title: "委托详情",
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
                    "委托发布中": {
                        index: 0,
                        title: ["接受委托", "取消"],
                        type: ["success", "info"],
                        click: ["acceptsTheEntrustment", "cancel"]
                    },
                    "已完成": {
                        index: 1,
                        title: ["觉得该委托发布的很赞", "觉得该委托发布的很差"],
                        type: ["success", "warning"],
                        click: ["increaseGood", "increaseBad"]
                    },
                    "已接收": {
                        index: 2,
                        title: [],
                        type: [],
                        click: []
                    }
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
                    task: {}
                },
                // 发布者已发布信息统计
                publishedValue: 0,
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
                taskRateValue: 5,


            };
        },
        created() {
            this.handleType();


        },
        mounted() {
            this.handleQuery();
        },
        methods: {
            /*判断当前用户是否是发布者 */
            isPublisher(task) {
                if (task.publisherId === this.$store.state.userInfo.userId) {
                    return true;
                } else {
                    return false;
                }
            },
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
                listViewOnGoingList(this.queryParams).then(response => {
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
                getTaskAndPublishUserInfoByTaskId(row.taskId).then(response => {
                    if (response.data.code === 1) {

                        this.form = response.data.data;
                        console.log(this.form);
                        this.form.usersInfo.userRole = this.identity[this.form.usersInfo.userRole];
                        this.form.task.type = this.taskType[`${this.form.task.type}`];
                        // console.log("form", this.form.task.status);
                        this.operation = this.operations[`${this.form.task.status}`];
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
                executeConfirmedRequest(acceptCommission, data, "我确认接受委托", "是否确认接受委托", "接受委托成功,等待委托发布者处理", "接受委托失败", "接受委托失败", "接受委托取消");
                this.getList();
                this.open = false;
            },
            cancel() {
                this.open = false;
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

    .publisher-card {

        height: 300px;
        margin-bottom: 10px;
    }

    .Info-card {
        margin-right: 10px;
    }

    .like {
        cursor: pointer;
        font-size: 25px;
        display: inline-block;
    }

    .el-statistic-wrapper {
        margin-top: 10px;
        margin-bottom: 20px;
        margin-left: 20px;
    }
</style>