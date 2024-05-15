<template>
    <div>
        <el-row>
            <el-tabs @tab-click="handleClick">
                <el-tab-pane v-for="notice in noticeType" :key="notice.value" :label="notice.label">
                    <el-col>
                        <el-card class="box-card" body-style="height: 400px; width: 100%">
                            <el-table :data="tableData" style="width: 100%">
                                <el-table-column prop="date" label="日期">
                                </el-table-column>
                                <el-table-column prop="title" label="主题">
                                </el-table-column>
                                <el-table-column prop="isRead" label="是否已读">
                                    <template slot-scope="scope">
                                        <el-tag size="medium" v-if="scope.row.isRead == 0" type="success">未读</el-tag>
                                        <el-tag size="medium" v-else type="danger">已读</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="content" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="handleView(scope.row.id)">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </el-card>

                    </el-col>






                </el-tab-pane>
            </el-tabs>

        </el-row>
        <el-dialog width="30%" title="通知详情" :visible.sync="innerVisible" append-to-body>
            <el-card class="box-card notice-card">
                <div class="header">
                    <h1 class="title">{{ notice.title }}</h1>

                </div>

                <div class="announcement-list">
                    <!-- 示例公告卡片 -->
                    <div class="announcement-card">
                        <p>{{ notice.description }}</p>
                    </div>
                    <!-- 更多公告卡片可按需添加 -->
                </div>

                <footer class="fixed-footer">
                    <div class="notice-footer announcement-card">
                        <p>发送时间: {{ notice.date }}</p>
                        <p>&copy; SNUT 2024年 All rights reserved Liu Yu.</p>
                    </div>

                </footer>

            </el-card>
        </el-dialog>
    </div>

</template>
<script>

    import {
        getPersonalNoticeList, getNoticeById,
    } from "@/api/user.js"


    export default {
        props: {
            userId: {
                type: Number,
                default: 0
            },

        },
        data() {
            return {
                dialogVisibleEdit: false,
                dialogVisibleReason: false,
                dialogVisiblePublish: false,
                noticeType: [
                    {
                        value: "个人信息通知",
                        label: '个人信息通知',
                    },
                    {
                        value: "委托信息通知",
                        label: '委托信息通知',
                    },
                    {
                        value: "营销信息通知",
                        label: '营销信息通知',
                    },
                    {
                        value: "系统信息通知",
                        label: '系统信息通知',
                    },
                ],
                DelegationFrom: {
                    content: '',
                    location: ''
                },
                publishFrom: {

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
                tableData: [],
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
                notice: {
                    id: 1,
                    title: "个人信息通知",
                    description: "个人信息通知",
                    date: "2023-04-01",
                    show: false
                },
                innerVisible: false
            }
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
                this.tableData = [];
                switch (tab.label) {
                    case "个人信息通知":
                        this.getPersonalInformationNotification();
                        break;
                    case "委托信息通知":
                        this.getTaskInformationNotification();
                        break;
                    case "营销信息通知":
                        this.getMarketInformationNotification();
                        break;
                    case "系统信息通知":
                        this.getSystemInformationNotification();
                        break;
                }
            },
            getPersonalInformationNotification() {

                getPersonalNoticeList("OWN").then((data) => {
                    console.log(data);
                    if (data.data.code == 1) {
                        this.tableData = data.data.data;
                    } else {
                        this.$message({
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                })
            },
            getTaskInformationNotification() {

                getPersonalNoticeList("USER").then((data) => {
                    console.log(data);
                    if (data.data.code == 1) {
                        this.tableData = data.data.data;
                    } else {
                        this.$message({
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                })
            },
            getMarketInformationNotification() {

                getPersonalNoticeList("MARKETING").then((data) => {
                    console.log(data);
                    if (data.data.code == 1) {
                        this.tableData = data.data.data;
                    } else {
                        this.$message({
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                })
            },
            getSystemInformationNotification() {

                getPersonalNoticeList("SYSTEM").then((data) => {
                    console.log(data);
                    if (data.data.code == 1) {
                        this.tableData = data.data.data;
                    } else {
                        this.$message({
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                })
            },
            handleView(id) {
                getNoticeById(id).then((data) => {
                    console.log(data);
                    if (data.data.code == 1) {
                        this.notice = data.data.data;
                        this.innerVisible = true;
                    } else {
                        this.$message({
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                })
            },






            cancel(form) {
                this.resetForm(form);
            },

        },
        mounted() {

            this.getPersonalInformationNotification(this.userId);

        }
    }
</script>
<style scoped>
    * {
        margin: 0;
        padding: 0;
    }





    .el-tabs {
        height: 500px;
    }

    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }

    .header {
        background-color: #94c3f9;
        padding: 20px;
        text-align: center;
        border-radius: 10px;
    }

    .title {
        font-size: 24px;
    }

    .nav a {
        color: white;
        text-decoration: none;
    }

    .announcement-list {
        display: grid;
        /* 将元素设置为网格布局 */
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        /* 自动适配网格列数，每列最小宽度300px，占据可用空间的1/1 */
        gap: 20px;
        /* 设置网格元素之间的间距 */
        padding: 20px;
        /* 设置网格外部的边距 */
        line-height: 8;
    }

    .announcement-card {
        border: 1px solid #b3c5fa;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card-title {
        font-weight: bold;
    }

    .card-date {
        color: #999;
    }

    .notice-card {
        border: 1px solid #7cb6f4;
        height: 400px;
        margin-left: 5px;
    }

    .el-tag {
        margin-right: 5px;
        width: 50px;
        text-align: center;
    }

    .el-button--primary {
        width: 100px;
        line-height: 2;
    }

    .notice-footer {
        margin-top: 20px;
    }
</style>