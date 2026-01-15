<template>
    <div class="create-delegation-container">
        <el-card shadow="hover" class="box-card">
            <div slot="header" class="clearfix">
                <span><i class="el-icon-edit-outline"></i> 发布新委托</span>
            </div>
            <el-tabs type="border-card" class="custom-tabs">
                <el-tab-pane v-for="(pane, index) in tabPanes" :key="index" :label="pane.label">
                    <span slot="label"><i class="el-icon-document"></i> {{pane.label}}</span>
                    <div v-show="pane.id != 0" class="tab-content">
                        <div class="delegation-desc">
                             <el-alert
                                :title="pane.DelegationType || '请填写以下信息发布新的委托任务'"
                                type="info"
                                show-icon
                                :closable="false">
                              </el-alert>
                        </div>
                        <Delegation :DelegationType="pane.label" :id="pane.id" :description="pane.DelegationType" :tasks="tasks"
                            :taskTypeOption="taskTypeOption" @childEvent="getTaskDraft" />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>

    import Delegation from '@/components/Delegation.vue';

    import { getTaskDraftById, getUserInfo } from '@/api/index';
    import { getTaskCategoriesUser } from '@/api/user';

    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'

    export default {
        components: {
            Delegation
        },
        data() {
            return {
                tabPanes: [
                    { label: '我的行程', icon: 'el-icon-date', DelegationType: "我的行程" },
                    { label: '消息中心' },
                    { label: '角色管理' },
                    { label: '定时任务补偿' },
                ],
                tasks: [
                    {
                        "taskId": 102,
                        "type": 1,
                        "location": "教学楼",
                        "description": "content",
                        "status": "草稿",
                        "createTime": "2024-04-13 07:23:36"
                    },
                    {
                        "taskId": 101,
                        "type": 12,
                        "location": "教学楼",
                        "description": "添加测试委托",
                        "status": "草稿",
                        "createTime": "2024-04-13 07:17:35"
                    }
                ],
                taskType: {
                    "1": "我的行程",
                },
                taskTypeOption: [{
                    label: "校园带去",
                    value: 1
                }, {
                    label: "校园代买",
                    value: 2
                }
                ]

            }
        },
        methods: {
            setContext() {
                //获取类型
                getTaskCategoriesUser().then((data) => {
                    this.tabPanes = [];
                    this.taskTypeOption = [];
                    if (data.data.code === 1) {

                        if (data.data.data.length > 0) {

                            const taskCategories = data.data.data;

                            for (let i = 0; i < taskCategories.length; i++) {
                                this.tabPanes.push({
                                    label: taskCategories[i].name,
                                    id: taskCategories[i].id,
                                    DelegationType: taskCategories[i].description,
                                })

                                //生成键值对
                                this.taskType[`${taskCategories[i].id}`] = `${taskCategories[i].name}`
                                this.taskTypeOption.push({ label: taskCategories[i].name, value: taskCategories[i].id })
                            }
                            // console.log("类型信息", this.tabPanes);
                            // console.log(this.taskType);
                            console.log("类型数组", this.taskTypeOption);
                        }
                    }
                })
            },
            //获取草稿
            getTaskDraft() {
                this.setContext();
                console.log("获取草稿");
                getTaskDraftById(this.$store.state.userInfo.userId).then((data) => {
                    data.data.data.forEach(element => {
                        element.type = this.taskType[`${element.type}`];
                    });
                    this.tasks = data.data.data;
                })
            },
            //查询用户认证信息,
            getUserInfoBefore() {
                console.log("获取用户信息");
                getUserInfo(this.$store.state.userInfo.userId).then((data) => {

                    if (data.data.code === 1) {
                        console.log("用户信息", data.data.data);
                        this.userInfo = data.data.data;
                        if (this.userInfo.authStatus != "认证通过") {
                            this.$message({
                                message: "请先完成认证",
                                type: 'error'
                            });
                            this.$router.push("/userInfo");
                        }

                    } else {
                        console.log("用户信息", data.data.msg);
                    }
                })
            },
        },
        mounted() {
            this.getUserInfoBefore();
            this.setContext();
            this.getTaskDraft();
            // console.log("id=", this.$store.state.userInfo.userId);
        }

    }
</script>

<style lang="less" scoped>
    .create-delegation-container {
        padding: 10px;
    }

    .box-card {
        .clearfix {
            span {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                
                i {
                    margin-right: 5px;
                    color: #409EFF;
                }
            }
        }
    }
    
    .custom-tabs {
        box-shadow: none;
        border: 1px solid #ebeef5;
        
        /deep/ .el-tabs__header {
            background-color: #f5f7fa;
            border-bottom: 1px solid #ebeef5;
        }
        
        /deep/ .el-tabs__content {
            padding: 20px;
        }
    }
    
    .delegation-desc {
        margin-bottom: 20px;
    }
</style>