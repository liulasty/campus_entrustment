<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="98px">
            <el-form-item label="委托任务内容" prop="Description" class="input-reader-name">
                <el-input v-model="queryParams.Description" placeholder="请输入委托内容关键词" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="委托类型" prop="taskType" class="input-reader-name">
                <el-select v-model="queryParams.taskType" placeholder="请选择委托类型" clearable>
                    <el-option v-for="dict in taskTypeOption" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="委托任务地点" prop="Location" class="input-reader-name">
                <el-select v-model="queryParams.Location" placeholder="请选择委托任务地点" clearable>
                    <el-option v-for="dict in locationType" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="委托创建时间" prop="CreatedAt" class="input-reader-name">
                <el-date-picker clearable v-model="queryParams.CreatedAt" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择审核完成时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>



        <el-table v-loading="loading" :data="delegateRecordsList" @selection-change="handleSelectionChange"
            :row-style="{ height: '50px' }">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="委托任务ID" align="center" prop="taskId" />
            <el-table-column label="委托发布者ID" align="center" prop="ownerId" />
            <el-table-column label="委托创建时间" align="center" prop="createdAt" />
            <el-table-column label="委托类型" align="center" prop="type" />
            <el-table-column label="委托状态" align="center" prop="status" width="180">
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view"
                        @click="handleView(scope.row.taskId)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page=queryParams.pageNum :page-sizes="[5, 7, 10, 15]" :page-size=queryParams.pageSize
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加或修改存储委托信息审核记录对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="委托任务ID" prop="DelegateID">
                    <el-input v-model="form.taskId" placeholder="请输入委托任务ID" disabled />
                </el-form-item>
                <el-form-item label="委托内容" prop="ReviewComment">
                    <el-input v-model="form.ReviewComment" type="textarea" placeholder="请输入内容" disabled />
                </el-form-item>
                <el-form-item label="审核完成时间" prop="ReviewTime">
                    <el-date-picker clearable v-model="form.ReviewTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="请选择审核完成时间" disabled>
                    </el-date-picker>
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
    </div>
</template>

<script>
import {
    listDelegateRecords, delDelegate, getDelegateByTaskID, addDelegateauditrecords, updateDelegateauditrecords, getTaskCategories,
} from "@/api/";

import { executeConfirmedRequest } from '@/utils/globalConfirmAction'

export default {
    name: "Delegateauditrecords",
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
            // 总条数
            total: 0,
            // 存储委托信息审核记录表格数据
            delegateRecordsList: [],
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
            //委托类型
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
                    title: ["撤销发布", "退为草稿"],
                    type: ["warning", "warn"],
                    click: ["withdrawReleaseAdmin", "fallbackDraftAdmin"]
                },
                "已接收": {
                    index: 1,
                    title: ["删除记录"],
                    type: ["warning"],
                    click: ["deleteRecordAdmin"]
                }
            },
            operation: {},
            // 表单参数
            form: {},
        };
    },
    created() {
        this.handleType();
        this.getList();

    },
    methods: {
        /** 查询存储委托信息记录列表 */
        getList() {
            this.loading = true;
            this.queryParams.TypePhase = "PUBLISHING_AND_EXECUTION";
            listDelegateRecords(this.queryParams).then((response) => {
                console.log("查询委托信息记录列表", response);
                this.delegateRecordsList = response.data.data.records.map((record) => {

                    record.type = this.taskType[`${record.type}`]; // 确保类型安全

                    return record;
                });
                console.log(this.delegateRecordsList);
                this.total = response.data.data.total;
                this.loading = false;
            });
        },
        getTaskValue(value) {
            return this.taskType[value];
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
                        console.log(this.taskType);
                        // console.log("类型数组", this.taskTypeOption);
                    }
                }
            })
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                RecordID: null,
                DelegateID: null,
                UserID: null,
                ReviewStatus: null,
                ReviewComment: null,
                ReviewTime: null
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;

            console.log("搜索参数：", this.queryParams);
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.RecordID)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.RecordID != null) {
                        updateDelegateauditrecords(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addDelegateauditrecords(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 查看按钮操作 */
        handleView(id) {
            console.log("查看委托", id);

            getDelegateByTaskID(id).then(response => {
                console.log("查看委托信息", response.data.data);
                this.form = response.data.data;
                this.operation = this.operations[response.data.data.status];
                console.log("查看委托选项", this.operation);
                this.open = true;
                this.title = "查看委托信息";
            });
            this.open = true;
        },
        /** 引导按钮操作 */
        handleButtonClick(actionName) {
            console.log("点击按钮", actionName);
            // 在这里实现点击按钮时调用的逻辑，例如：
            this[actionName]()
            // this[actionName]() 或者 this.$emit(actionName)
            // 具体实现取决于您的项目需求和上下文
        },
        /**删除 */
        async deleteRecordAdmin() {
            const id = this.form.taskId;
            console.log("删除委托", id);
            await executeConfirmedRequest(delDelegate, this.form.userId, "是否确认删除该委托？", "提示", "警告", "操作警告", "操作失败，请稍后重试", "操作已取消");
            // this.$confirm('是否确认删除该委托?', "警告", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning"
            // }).then(function () {
            //     return delDelegateauditrecords(id);
            // }).then(() => {
            //     this.getList();
            //     this.$modal.msgSuccess("删除成功");
            //     this.$refs["form"].reset();
            // }).catch(function () { });
        },
        /**退为草稿 */
        FallbackDraft() {
            const id = this.form.taskId;
            console.log("退为草稿", id);
            // this.$confirm('是否确认退为草稿?', "警告", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     type: "warning"
            // }).then(function () {
            //     return FallbackDraft(id);
            // }.then(() => {
            //     this.getList();
            //     this.$modal.msgSuccess("退为草稿成功");
            //     this.$refs["form"].reset();
            // }).catch(function () { }))
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
                this.$refs[formRef].reset();
                console.log("表单已重置！");
            } else {
                console.error("未找到指定的表单引用！");
            }
        }
    }
};
</script>

<style lang="css" scoped>
.input-reader-name /deep/ .el-input__inner {
    width: 150px;
    /* 或其他所需的宽度 */
}

/* 根据需要设置行高 */
.row-height {
    height: 70px;
    /* 设置行高为50像素 */
}
</style>
