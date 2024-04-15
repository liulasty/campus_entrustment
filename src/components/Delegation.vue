<template>
    <div>
        <el-row :gutter="20">
            <el-card class="box-card" body-style="margin: 20px 20px;">
                主要内容包括：{{ description }}
            </el-card>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <el-card class="box-card">
                    <h6>
                        <i class="el-icon-s-promotion"></i>
                        <span>流程定义</span>
                    </h6>
                    <h6>
                        <i class="el-icon-s-promotion"></i>
                        <span>流程定义</span>
                    </h6>
                    <h6>
                        <i class="el-icon-s-promotion"></i>
                        <span>流程定义</span>
                    </h6>
                </el-card>
                <el-form ref="form" :model="DelegationFrom" label-width="100px" size="mini">
                    <el-form-item label="委托内容描述">
                        <el-input type="textarea" v-model="DelegationFrom.content" size="large" rows="4"
                            maxlength="80"></el-input>
                    </el-form-item>
                    <el-form-item label="委托地点">
                        <el-select v-model="DelegationFrom.location" placeholder="请选择委托地点">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item size="large">
                        <el-button type="primary" @click="onSubmit" size="large">立即创建</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card" body-style="height: 450px;">

                    <div style="display: flex;justify-content: space-between;">
                        <h1>我的草稿</h1>
                        <el-button type="primary" @click.prevent="refresh()">刷新草稿</el-button>
                    </div>
                    <el-table :data="tasks" max-height="400">
                        <el-table-column prop="taskId" label="编号" v-if="showTypeColumn">
                        </el-table-column>
                        <el-table-column prop="type" label="类型" width="100">
                        </el-table-column>
                        <el-table-column prop="location" label="地点" width="70">
                        </el-table-column>
                        <el-table-column prop="description" label="内容" width="120" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="150">
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="340">
                            <template slot-scope="scope">
                                <div v-show="scope.row.status == '草稿'">
                                    <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                                    <el-button size="mini" type="success"
                                        @click="handleOngoing(scope.row)">去审核</el-button>
                                </div>
                                <div v-show="scope.row.status == '审核中'">
                                    <el-button size="mini" type="primary" plain disabled>编辑</el-button>
                                    <el-button size="mini" type="danger" plain disabled>删除</el-button>
                                    <el-button size="mini" type="success" plain disabled>审核中</el-button>
                                </div>
                                <div v-show="scope.row.status == '等待发布'">
                                    <el-button size="mini" type="primary" disabled>编辑</el-button>
                                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                                    <el-button size="mini" type="success" @click="handleAudit(scope.row)">发布</el-button>
                                </div>
                                <div v-show="scope.row.status == '审核未通过'">
                                    <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
                                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                                    <el-button size="mini" type="info" @click="handleDetail(scope.row)">查看原因</el-button>
                                </div>

                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>


            </el-col>
        </el-row>
        // 编辑委托窗口
        <el-dialog title="编辑" :visible.sync="dialogVisibleEdit" width="30%">
            <el-form ref="DraftFrom" :model="DraftFrom" label-width="100px" size="mini">
                <el-form-item label="委托类型">
                    <el-select v-model="DraftFrom.type" placeholder="请选择委托类型">
                        <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="委托内容描述">
                    <el-input type="textarea" v-model="DraftFrom.description" size="large" rows="4"
                        maxlength="80"></el-input>
                </el-form-item>
                <el-form-item label="委托地点">
                    <el-select v-model="DraftFrom.location" placeholder="请选择委托地点">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item size="large">
                    <el-button type="primary" @click.prevent="committingChanges()" size="large">提交修改</el-button>
                    <el-button type="info" @click="cancel('DraftFrom')">取消修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>





        <el-dialog title="查看原因" :visible.sync="dialogVisibleReason" height="70%">
            <div style="height: 500px; padding: auto;line-height: 70px;font-size: 28px;">
                <span>审核人员：{{ this.reason.name }}</span>
                <div class="el-divider" content-position="left">审核结果</div>
                <span class="el-content">{{ this.reason.reviewStatus }}</span>
                <div class="el-divider" content-position="left">审核说明</div>
                <span class="el-content">{{ this.reason.reviewComment }}</span>
                <el-divider content-position="right">审核完成时间{{ this.reason.reviewTime }}</el-divider>
            </div>

        </el-dialog>


    </div>

</template>
<script>

import {
    addTaskDraft, updateTaskDraft, getDraftDetailsBasedOnCommissionId, deleteTaskDraft, submitTaskDraft,
    confirmTask, getReason
} from "@/api/index"

export default {
    props: {

        DelegationType: {
            type: String,
            default: 'abc'
        },
        id: {
            type: Number,
            default: 1
        },
        description: {
            type: String,
            default: 'abc'
        },
        tasks: {
            type: Array,
            required: true
        },
        taskTypeOption: {
            type: Array,
            required: false,
            default() {
                return [{
                    label: "校园带去",
                    value: 1
                }, {
                    label: "校园代买",
                    value: 2
                }]
            }
        },

    },
    data() {
        return {
            dialogVisibleEdit: false,
            dialogVisibleReason: false,
            DelegationFrom: {
                content: '',
                location: ''
            },
            DraftFrom: {
                taskId: 0,
                location: "教学楼",
                description: "教学事故研究会",
                type: 1,
                createdAt: "2024-04-13 09:41:25"
            },
            taskType: [],

            showTypeColumn: false,
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            options: [
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
            reason: {
                name: "",
                reviewStatus: "",
                reviewComment: "",
                reviewTime: "",
            }
        }
    },
    methods: {
        //添加草稿
        onSubmit() {
            console.log('submit!');
            this.DelegationFrom.type = this.DelegationType;
            this.DelegationFrom.ownerId = this.$store.state.userInfo.userId;
            console.log("提交委托草稿", this.DelegationFrom)

            addTaskDraft(this.DelegationFrom).then((data) => {
                console.log(data.data)
                this.refresh()

            })


        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //更新草稿
        handleEdit(row) {
            console.log(row.taskId);


            console.log("类型数组", this.taskTypeOption)

            getDraftDetailsBasedOnCommissionId(row.taskId).then((data) => {
                console.log(data.data);
                this.DraftFrom = data.data.data
                this.dialogVisibleEdit = true;
            })
        },
        //刷新委托列表
        refresh() {
            this.$emit('childEvent');
        },
        //提交修改
        committingChanges() {
            console.log("修改的内容", this.DraftFrom);
            updateTaskDraft(this.DraftFrom).then((data) => {
                console.log(data);
                if (data.data.code === 1) {
                    this.$message({
                        message: data.data.msg,
                        type: 'success'
                    });
                    this.dialogVisibleEdit = false;
                    this.refresh()
                }
            })

        },
        //删除草稿
        handleDelete(row) {
            console.log(row);
            //确认删除
            this.$confirm('确认删除？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '放弃删除'
            })
                .then(() => {
                    deleteTaskDraft(row.taskId).then((data) => {
                        if (data.data.code === 1) {
                            this.$message({
                                message: data.data.msg,
                                type: 'success'
                            });
                            this.refresh()
                        }
                    })
                })
                .catch(action => {
                    this.$message({
                        type: 'info',
                        message: action === 'cancel'
                            ? '取消删除'
                            : '停留在当前页面'
                    })
                });

        },
        //提交草稿审核
        handleOngoing(data) {
            //去审核
            submitTaskDraft(data.taskId).then((data) => {
                console.log("去审核", data);
                if (data.data.code === 1) {
                    this.$message({
                        type: 'success',
                        message: data.data.msg
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data.msg
                    });
                }
                this.$emit('childEvent');
            }
            )

        },
        //确认发布
        handleAudit(data) {
            confirmTask(data.taskId).then(data => {
                if (data.data.code == 1) {
                    this.$message({
                        type: 'success',
                        message: data.data.msg
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data.msg
                    });
                }
                this.$emit('childEvent');
            })
        },
        //查看审核未通过原因
        handleDetail(val) {
            getReason(val.taskId).then((data) => {
                if (data.data.code == 1) {
                    this.reason = data.data.data;
                    console.log("查看审核未通过原因", this.reason);
                    this.dialogVisibleReason = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: data.data.msg
                    });
                }
            })
        },

    },
    mounted() {

    }
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
}

button {
    height: 35px;
    width: 100px;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 20px;
    margin-top: 20px;
}

.el-driver {
    margin: 34px 0px;
}
</style>