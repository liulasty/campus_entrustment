<template>
    <div class="delegation-wrapper">
        <el-row :gutter="24">
            <!-- 左侧：发布表单 -->
            <el-col :span="14">
                <el-card shadow="hover" class="form-card">
                    <div slot="header" class="clearfix">
                        <span class="card-title"><i class="el-icon-edit-outline"></i> 填写委托信息</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="dialogRulesVisible = true"><i class="el-icon-warning-outline"></i> 发布规则</el-button>
                    </div>
                    
                    <div class="form-intro">
                        <el-alert
                            :title="description"
                            type="success"
                            :closable="false"
                            show-icon>
                        </el-alert>
                    </div>

                    <el-form ref="form" :model="DelegationFrom" label-width="100px" size="medium" class="delegation-form">
                        <el-form-item label="委托地点" prop="location">
                            <el-select v-model="DelegationFrom.location" placeholder="请选择委托地点" style="width: 100%;">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="委托金额" prop="money">
                            <el-input-number v-model="DelegationFrom.money" :precision="2" :step="1" :min="0" placeholder="请输入委托金额"></el-input-number>
                        </el-form-item>

                        <el-form-item label="委托内容" prop="content">
                            <el-input 
                                type="textarea" 
                                v-model="DelegationFrom.content" 
                                :rows="8" 
                                placeholder="请详细描述您的委托内容，例如：具体要求、时间限制、报酬预算等..." 
                                maxlength="200" 
                                show-word-limit>
                            </el-input>
                        </el-form-item>
                        
                        <el-form-item class="form-actions">
                            <el-button type="primary" icon="el-icon-check" @click="onSubmit">立即创建草稿</el-button>
                            <el-button icon="el-icon-view" @click="handlePreview">预览</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            
            <!-- 右侧：草稿列表 & 统计 -->
            <el-col :span="10">
                <!-- 统计卡片 -->
                <el-card shadow="hover" class="info-summary-card" :body-style="{ padding: '15px' }">
                    <div class="summary-content">
                        <div class="summary-item">
                            <div class="icon-wrapper draft-bg">
                                <i class="el-icon-document-copy"></i>
                            </div>
                            <div class="text-info">
                                <div class="num">{{ tasks.filter(t => t.status === '草稿').length }}</div>
                                <div class="label">待发布草稿</div>
                            </div>
                        </div>
                        <div class="divider"></div>
                        <div class="summary-item">
                            <div class="icon-wrapper audit-bg">
                                <i class="el-icon-s-check"></i>
                            </div>
                            <div class="text-info">
                                <div class="num">{{ tasks.filter(t => t.status === '审核中').length }}</div>
                                <div class="label">审核中委托</div>
                            </div>
                        </div>
                    </div>
                </el-card>

                <el-card shadow="hover" class="draft-card" style="margin-top: 20px;">
                   <div slot="header" class="clearfix">
                    <span class="card-title"><i class="el-icon-notebook-2"></i> 我的草稿箱</span>
                    <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-refresh" @click.prevent="refresh()">刷新</el-button>
                  </div>
                  
                  <el-table :data="tasks" height="400" size="small" stripe highlight-current-row style="width: 100%">
                        <el-table-column prop="type" label="类型" width="80">
                             <template slot-scope="scope">
                                <el-tag size="mini">{{ scope.row.type }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" label="内容" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="money" label="金额" width="80">
                            <template slot-scope="scope">
                                <span>￥{{ scope.row.money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="80">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status === '草稿'" type="info" size="mini" effect="plain">草稿</el-tag>
                                <el-tag v-else-if="scope.row.status === '审核中'" type="warning" size="mini" effect="plain">审核中</el-tag>
                                <el-tag v-else-if="scope.row.status === '等待发布'" type="success" size="mini" effect="plain">待发布</el-tag>
                                <el-tag v-else-if="scope.row.status === '审核未通过'" type="danger" size="mini" effect="plain">未通过</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="130" fixed="right" align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.status == '草稿'">
                                    <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                                    <el-button size="mini" type="text" class="text-danger" @click="handleDelete(scope.row)">删除</el-button>
                                    <el-button size="mini" type="text" @click="handleOngoing(scope.row)">去审核</el-button>
                                </div>
                                <div v-else-if="scope.row.status == '审核中'">
                                    <span style="color: #909399; font-size: 12px;">审核中...</span>
                                </div>
                                <div v-else-if="scope.row.status == '等待发布'">
                                    <el-button size="mini" type="text" class="text-danger" @click="handleDelete(scope.row)">删除</el-button>
                                    <el-button size="mini" type="text" @click="handleAudit(scope.row)">发布</el-button>
                                </div>
                                <div v-else-if="scope.row.status == '审核未通过'">
                                    <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
                                    <el-button size="mini" type="text" class="text-danger" @click="handleDelete(scope.row)">删除</el-button>
                                    <el-button size="mini" type="text" @click="handleDetail(scope.row)">原因</el-button>
                                </div>
                            </template>
                        </el-table-column>
                  </el-table>
                </el-card>
            </el-col>
        </el-row>

        <!-- 弹窗：发布规则 -->
        <el-dialog title="发布须知" :visible.sync="dialogRulesVisible" width="500px" center append-to-body>
            <div class="rules-content">
                <div class="rule-item">
                    <i class="el-icon-s-promotion icon"></i>
                    <p>发布委托信息流程：先创建草稿，再申请发布委托，只有通过审核后，再发布委托。</p>
                </div>
                <div class="rule-item">
                    <i class="el-icon-edit icon"></i>
                    <p>草稿创建后可以修改，发布后不可修改。</p>
                </div>
                <div class="rule-item">
                    <i class="el-icon-warning icon"></i>
                    <p>内容合法合规：所有发布的信息必须符合国家法律法规和学校相关规定，不得含有违法、淫秽、暴力、歧视等不良内容。</p>
                </div>
                <div class="rule-item">
                    <i class="el-icon-document-checked icon"></i>
                    <p>真实准确：发布的信息必须真实准确，不得故意虚假宣传、夸大事实或误导他人。</p>
                </div>
                <div class="rule-item">
                    <i class="el-icon-lock icon"></i>
                    <p>尊重隐私：严禁发布他人隐私信息，包括但不限于手机号码、学号、家庭住址等个人敏感信息。</p>
                </div>
                <div class="rule-item">
                    <i class="el-icon-shop icon"></i>
                    <p>适度宣传：允许校园内部组织、社团、团队等发布相关活动、招募信息，但不得进行过度商业宣传。</p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogRulesVisible = false">我已阅读并同意</el-button>
            </span>
        </el-dialog>
        
        <!-- 弹窗：预览 -->
        <el-dialog title="委托预览" :visible.sync="dialogPreviewVisible" width="500px" center append-to-body>
            <el-card shadow="never" class="preview-card">
                <div class="preview-item">
                    <label>委托类型：</label>
                    <span>{{ DelegationType }}</span>
                </div>
                 <div class="preview-item">
                    <label>委托地点：</label>
                    <span>{{ DelegationFrom.location || '未选择' }}</span>
                </div>
                 <div class="preview-item">
                    <label>委托金额：</label>
                    <span>{{ DelegationFrom.money || '0.00' }} 元</span>
                </div>
                 <div class="preview-item">
                    <label>委托内容：</label>
                    <p>{{ DelegationFrom.content || '未填写内容' }}</p>
                </div>
            </el-card>
             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogPreviewVisible = false">关闭</el-button>
                <el-button type="primary" @click="confirmPreviewAndSubmit">确认无误，创建草稿</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑草稿" :visible.sync="dialogVisibleEdit" width="500px" center append-to-body>
            <el-form ref="DraftFrom" :model="DraftFrom" label-width="80px" size="small">
                <el-form-item label="委托类型">
                    <el-select v-model="DraftFrom.type" placeholder="请选择委托类型" style="width: 100%;">
                        <el-option v-for="item in taskTypeOption" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="委托地点">
                    <el-select v-model="DraftFrom.location" placeholder="请选择委托地点" style="width: 100%;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="委托金额">
                     <el-input-number v-model="DraftFrom.money" :precision="2" :step="1" :min="0" placeholder="请输入委托金额"></el-input-number>
                </el-form-item>
                <el-form-item label="委托内容">
                    <el-input type="textarea" v-model="DraftFrom.description" :rows="4"
                        maxlength="200" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                 <el-button @click="cancel('DraftFrom')">取 消</el-button>
                 <el-button type="primary" @click.prevent="committingChanges()">提交修改</el-button>
            </div>
        </el-dialog>

        <el-dialog title="审核结果" :visible.sync="dialogVisibleReason" width="500px" center append-to-body>
            <div class="audit-result">
                <div class="result-header">
                     <i class="el-icon-circle-close result-icon"></i>
                     <h3>审核未通过</h3>
                </div>
                <div class="result-content">
                    <div class="info-item">
                        <span class="label">审核人员：</span>
                        <span class="value">{{ this.reason.name }}</span>
                    </div>
                     <div class="info-item">
                        <span class="label">审核说明：</span>
                        <span class="value reason-text">{{ this.reason.reviewComment }}</span>
                    </div>
                     <div class="info-item">
                        <span class="label">审核时间：</span>
                        <span class="value">{{ this.reason.reviewTime }}</span>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisibleReason = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="发布委托" :visible.sync="dialogVisiblePublish" width="600px" center append-to-body>
            <el-alert
                title="请确认以下发布信息准确无误"
                type="warning"
                :closable="false"
                show-icon
                style="margin-bottom: 20px;">
            </el-alert>
            <el-form ref="publishFrom" :model="publishFrom" label-width="100px" size="small" class="publish-form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="委托类型:">
                            <span class="form-text">{{ publishFrom.type }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="委托地点:">
                            <span class="form-text">{{ publishFrom.location }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="委托内容:">
                     <div class="form-text content-box">{{ publishFrom.description }}</div>
                </el-form-item>
                
                <el-divider content-position="left">设置时间</el-divider>
                
                <el-form-item label="发布时间">
                    <el-date-picker clearable v-model="publishFrom.startTime" type="datetime"
                        value-format="yyyy年MM月dd日HH:mm:ss" placeholder="请选择委托发布时间" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="截止时间">
                    <el-date-picker clearable v-model="publishFrom.endTime" type="datetime"
                        value-format="yyyy年MM月dd日HH:mm:ss" placeholder="请选择委托截止时间" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
            </el-form>
             <div slot="footer" class="dialog-footer">
                 <el-button @click="dialogVisiblePublish = false">暂不发布</el-button>
                 <el-button type="primary" @click.prevent="publishDelegation()">确认发布</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

    import {
        addTaskDraft, updateTaskDraft, getDraftDetailsBasedOnCommissionId, deleteTaskDraft, submitTaskDraft,
        confirmTask, getReason, publishingDelegation
    } from "@/api/index"

    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'

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
                dialogRulesVisible: false,
                dialogPreviewVisible: false,
                dialogVisibleEdit: false,
                dialogVisibleReason: false,
                dialogVisiblePublish: false,
                DelegationFrom: {
                    content: '',
                    location: '',
                    money: 0.0
                },
                publishFrom: {

                },
                DraftFrom: {
                    taskId: 0,
                    location: "教学楼",
                    description: "教学事故研究会",
                    type: 1,
                    createdAt: "2024-04-13 09:41:25",
                    money: 0.0
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
            async onSubmit() {
                this.DelegationFrom.type = this.DelegationType;
                this.DelegationFrom.ownerId = this.$store.state.userInfo.userId;
                // console.log("提交委托草稿", this.DelegationFrom)

                await executeConfirmedRequest(
                    addTaskDraft,
                    this.DelegationFrom,
                    "确认添加该委托信息？",
                    "提示信息",
                    "确认添加",
                    "添加成功",
                    "添加失败",
                    "取消添加草稿"
                )
                this.refresh()

            },
            handlePreview() {
                this.dialogPreviewVisible = true;
            },
            confirmPreviewAndSubmit() {
                this.dialogPreviewVisible = false;
                this.onSubmit();
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //更新草稿
            handleEdit(row) {
                console.log(row.taskId);
                // console.log("类型数组", this.taskTypeOption)

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
            //打开确认发布窗口
            handleAudit(data) {
                this.dialogVisiblePublish = true;
                confirmTask(data.taskId).then(data => {
                    if (data.data.code == 1) {
                        this.$message({
                            type: 'success',
                            message: data.data.msg
                        });
                        this.publishFrom = data.data.data;
                        console.log(this.taskTypeOption);
                        this.publishFrom.type = this.taskTypeOption[this.publishFrom.type - 1].label;
                    } else {
                        this.dialogVisiblePublish = false;
                        this.$message({
                            type: 'error',
                            message: data.data.msg
                        });

                    }
                })
            },
            //发布委托
            publishDelegation() {
                console.log("即将发布的委托", this.publishFrom);
                const publish = {
                    id: this.publishFrom.taskId,
                    start: this.publishFrom.startTime,
                    end: this.publishFrom.endTime
                }
                publishingDelegation(publish).then((data) => {
                    if (data.data.code === 1) {
                        this.$message({
                            message: data.data.msg,
                            type: 'success'
                        });

                    } else {
                        this.$message({
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                    this.$emit('childEvent');
                    this.dialogVisiblePublish = false;
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
            cancel(form) {
                this.resetForm(form);
            }

        },
        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    .delegation-wrapper {
        padding: 10px;
    }

    .form-card {
        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            
            i {
                margin-right: 5px;
                color: #409EFF;
            }
        }
        
        .form-intro {
            margin-bottom: 20px;
        }
        
        .delegation-form {
            padding: 0 20px;
            
            .form-actions {
                margin-top: 30px;
                text-align: right;
            }
        }
    }
    
    .info-summary-card {
        background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
        border: none;
        
        .summary-content {
            display: flex;
            align-items: center;
            justify-content: space-around;
            
            .divider {
                width: 1px;
                height: 40px;
                background-color: #dcdfe6;
            }
            
            .summary-item {
                display: flex;
                align-items: center;
                
                .icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    font-size: 24px;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    
                    &.draft-bg {
                        background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
                    }
                    
                    &.audit-bg {
                        background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%);
                    }
                }
                
                .text-info {
                    .num {
                        font-size: 24px;
                        font-weight: bold;
                        color: #303133;
                        line-height: 1.2;
                    }
                    
                    .label {
                        font-size: 12px;
                        color: #909399;
                    }
                }
            }
        }
    }
    
    .draft-card {
        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            
            i {
                margin-right: 5px;
                color: #409EFF;
            }
        }
        
        .text-danger {
            color: #F56C6C;
            
            &:hover {
                color: #f78989;
            }
        }
    }

    .rules-content {
        .rule-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
            
            .icon {
                font-size: 18px;
                color: #409EFF;
                margin-right: 10px;
                margin-top: 2px;
            }
            
            p {
                margin: 0;
                font-size: 14px;
                color: #606266;
                line-height: 1.6;
            }
        }
    }
    
    .preview-card {
        .preview-item {
            margin-bottom: 15px;
            display: flex;
            
            label {
                width: 80px;
                font-weight: bold;
                color: #606266;
                flex-shrink: 0;
            }
            
            span, p {
                color: #303133;
                margin: 0;
                line-height: 1.5;
            }
        }
    }
    
    .audit-result {
        text-align: center;
        padding: 20px 0;
        
        .result-header {
            margin-bottom: 20px;
            
            .result-icon {
                font-size: 60px;
                color: #F56C6C;
                margin-bottom: 10px;
            }
            
            h3 {
                margin: 0;
                color: #303133;
            }
        }
        
        .result-content {
            background-color: #f5f7fa;
            padding: 20px;
            border-radius: 4px;
            text-align: left;
            
            .info-item {
                display: flex;
                margin-bottom: 10px;
                font-size: 14px;
                
                .label {
                    color: #909399;
                    width: 80px;
                    flex-shrink: 0;
                }
                
                .value {
                    color: #606266;
                    
                    &.reason-text {
                        color: #303133;
                        font-weight: 500;
                    }
                }
            }
        }
    }
    
    .publish-form {
        .form-text {
            color: #303133;
            font-weight: 500;
        }
        
        .content-box {
            background-color: #f5f7fa;
            padding: 10px;
            border-radius: 4px;
            line-height: 1.5;
            min-height: 60px;
        }
    }
</style>