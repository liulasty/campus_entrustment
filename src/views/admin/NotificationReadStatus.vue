<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="98px">
            <el-form-item label="消息内容" prop="description" class="input-reader-name">
                <el-input v-model="queryParams.description" placeholder="请输入消息内容关键词" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="消息类型" prop="messageType" class="input-reader-name">
                <el-select v-model="queryParams.messageType" placeholder="请选择消息类型" clearable>
                    <el-option v-for="(value, index) in messageType" :key="index" :label="value" :value="index" />
                </el-select>
            </el-form-item>

            <el-form-item label="消息创建时间" prop="createdAt" class="input-reader-name">
                <el-date-picker clearable v-model="queryParams.createdAt" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择消息创建时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <el-row class="table-btn-group">
            <el-col :span="12" class="table-btn-group-left">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

            </el-col>
            <!-- <el-col :span="12" class="table-btn-group-right">
                <el-button type="primary" class="add-btn" size="mini" @click="addDialogForm = true"
                    round>添加消息</el-button>
            </el-col> -->




        </el-row>
        <el-row class="table-container">
            <el-col>
                <el-table :data="List" border style="width: 100%">
                    <el-table-column fixed prop="notificationTime" label="创建日期" width="180">
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="130">
                    </el-table-column>
                    <el-table-column prop="username" label="接受者账号" width="130">
                    </el-table-column>
                    <el-table-column prop="title" label="主题" width="130" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="message" label="内容" width="130" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="isRead" label="是否已读" width="100" :filters="readTypes"
                        :filter-method="filterTag" filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isRead === true ? 'success' : 'primary'" disable-transitions>
                                {{scope.row.isRead === true ? '已读':'未读'}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="readTime" label="查看时间" width="180" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row.id)" type="success" size="small">查看</el-button>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-col>

        </el-row>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page=queryParams.pageNum :page-sizes="[3, 5, 7, 10]" :page-size=queryParams.pageSize
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <div class="dialog">
            <el-dialog title="查看通知消息详情" :visible.sync="addDialogForm">
                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
                    <el-form-item label="消息主题" prop="title" :label-width="formLabelWidth">
                        <el-input v-model="addForm.title" placeholder="请输入消息主题" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="消息类型" prop="type" :label-width="formLabelWidth">
                        <el-select v-model="addForm.type" placeholder="请选择消息类型">
                            <el-option v-for="(value, index) in messageType" :key="index" :label="value"
                                :value="index" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="消息内容" prop="description" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="addForm.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addDialogForm = false">取 消</el-button>
                    <el-button type="primary" @click="addNotification('addForm')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="发送通知消息" :visible.sync="sendDialogForm">
                <div class="demo-input-suffix">
                    发送对象：
                    <el-radio-group v-model="sendData.sendObject">
                        <el-radio label="all">全体用户</el-radio>
                        <el-radio label="authenticated">认证用户</el-radio>
                        <el-radio label="student">学生</el-radio>
                        <el-radio label="teacher">教师</el-radio>
                        <el-radio label="other">其他</el-radio>
                    </el-radio-group>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="sendDialogForm = false">取 消</el-button>
                    <el-button type="primary" @click="handleSend()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>


<script>
    import { listNotificationReadRecords, getNotificationsType, addNotification, sendNotification } from "@/api/";
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'
    export default {
        name: "ExpireDelegationList",
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 显示搜索条件
                showSearch: true,
                // 委托类型字典
                taskTypeOption: [],
                // 委托任务地点字典
                locationType: [],
                // 委托任务记录表格数据
                List: [],
                // 总条数
                total: 0,
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    Description: undefined,
                    taskType: undefined,
                    Location: undefined,
                    CreatedAt: undefined,
                    pageNum: 1,
                    pageSize: 5
                },
                messageType: {

                },
                addDialogForm: false,
                addForm: {

                },
                formLabelWidth: '120px',
                rules: {
                    title: [
                        { required: true, message: '请输入消息名称', trigger: 'blur' },
                        { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择一个消息类型', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请填写活动形式', trigger: 'blur' },
                        { min: 7, max: 88, message: '长度在 7 到 88 个字符', trigger: 'blur' }
                    ]
                },
                sendDialogForm: false,
                // 发送消息
                sendData: {
                    sendId: 0,
                    sendObject: "",
                },
                //是否已读标签
                readTypes: [{
                    value: false,
                    text: "未读",

                }, {
                    value: true,
                    text: "已读"
                }]


            };
        },
        created() {
            this.getList();
            this.getMessageType();
        },
        methods: {
            // 获取消息类型
            getMessageType() {
                getNotificationsType().then(response => {
                    this.messageType = response.data.data;
                    console.log(this.messageType);
                });
            },
            // 获取消息列表
            getList() {
                this.loading = true;
                listNotificationReadRecords(this.queryParams).then(response => {
                    this.List = response.data.data.records;
                    console.log(this.List);
                    this.total = response.data.data.total;
                    this.loading = false;
                });
            },
            // 搜索按钮操作
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            // 重置按钮操作
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            resetForm(formName) {
                if (this.$refs[formName]) {
                    this.$refs[formName].resetFields();
                }
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            handleClick(id) {
                console.log(id);
                this.sendDialogForm = true;
                this.sendData.sendId = id;
            },
            handleSizeChange(val) {
                this.queryParams.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getList();
            },
            // 删除按钮操作
            handleDelete(row) {
                const id = row.id || this.ids;
                this.$confirm('是否确认删除委托任务记录编号为"' + id + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return delTask(id);
                }
                ).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                    .catch(function () {
                        this.msgError("删除失败");
                    });
                this.getList();
            },
            handleSend() {
                console.log("send", this.sendData);

                executeConfirmedRequest(
                    sendNotification,
                    this.sendData,
                    "确认发送",
                    "确认发送此消息？",
                    "发送失败",
                    "发送取消"
                );

            },
            //已读标签
            filterTag(value, row) {
                console.log("筛选", value, row.isRead);
                return row.isRead === value;
            },

        },

    }
</script>
<style lang="less" scoped>
    .table-container {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .table-btn-group {
        margin-bottom: 10px;
        text-align: right;
        /* 元素在容器内左右对齐，中间留空 */
        /* 元素靠右对齐 */
    }


    .table-btn-group-left {
        margin-bottom: 10px;
        text-align: left;
    }

    .table-btn-group-right {
        margin-bottom: 10px;
        text-align: right;
    }
</style>