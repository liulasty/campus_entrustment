<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="98px">
            <el-form-item label="委托任务ID" prop="DelegateID">
                <el-input v-model="queryParams.DelegateID" placeholder="请输入委托任务ID" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="审核结果状态" prop="ReviewStatus">
                <el-select v-model="queryParams.ReviewStatus" placeholder="请选择审核结果状态" clearable>
                    <el-option v-for="dict in type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="审核完成时间" prop="ReviewTime">
                <el-date-picker clearable v-model="queryParams.ReviewTime" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择审核完成时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
                    @click="handleUpdate">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete">删除</el-button>
            </el-col>

        </el-row>

        <el-table v-loading="loading" :data="delegateauditrecordsList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="审核记录ID" align="center" prop="RecordID" />
            <el-table-column label="委托任务ID" align="center" prop="DelegateID" />
            <el-table-column label="管理员ID" align="center" prop="UserID" />
            <el-table-column label="审核结果状态“已批准”、“已拒绝”、“待定”" align="center" prop="ReviewStatus" />
            <el-table-column label="审核意见或说明" align="center" prop="ReviewComment" />
            <el-table-column label="审核完成时间" align="center" prop="ReviewTime" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.ReviewTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page=queryParams.pageNum :page-sizes="[5, 7, 10, 15]" :page-size=queryParams.pageSize
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加或修改存储委托信息审核记录对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="委托任务ID" prop="DelegateID">
                    <el-input v-model="form.DelegateID" placeholder="请输入委托任务ID" />
                </el-form-item>
                <el-form-item label="管理员ID" prop="UserID">
                    <el-input v-model="form.UserID" placeholder="请输入管理员ID" />
                </el-form-item>
                <el-form-item label="审核意见或说明" prop="ReviewComment">
                    <el-input v-model="form.ReviewComment" type="textarea" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="审核完成时间" prop="ReviewTime">
                    <el-date-picker clearable v-model="form.ReviewTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="请选择审核完成时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listDelegateRecords, getDelegateauditrecords, delDelegateauditrecords, addDelegateauditrecords, updateDelegateauditrecords } from "@/api/";

import initLayui from "@/layui/layuiInit";

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
            delegateauditrecordsList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                DelegateID: null,
                UserID: null,
                ReviewStatus: null,
                ReviewComment: null,
                ReviewTime: null
            },
            // 类型数组
            type: [
                { label: "已批准", value: 1 },
                { label: "已拒绝", value: 2 },
                { label: "待定", value: 3 }
            ],
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                DelegateID: [
                    { required: true, message: "委托任务ID不能为空", trigger: "blur" }
                ],
                UserID: [
                    { required: true, message: "管理员ID不能为空", trigger: "blur" }
                ],
                ReviewStatus: [
                    { required: true, message: "审核结果状态不能为空", trigger: "change" }
                ],
            }
        };
    },
    created() {
        //   this.getList();
    },
    methods: {
        /** 查询存储委托信息审核记录列表 */
        getList() {
            this.loading = true;

            listDelegateauditrecords(this.queryParams).then(response => {
                this.delegateauditrecordsList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
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
            // this.getList();
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
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加存储委托信息审核记录";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const RecordID = row.RecordID || this.ids
            getDelegateauditrecords(RecordID).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改存储委托信息审核记录";
            });
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
        /** 删除按钮操作 */
        handleDelete(row) {
            const RecordIDs = row.RecordID || this.ids;
            this.$modal.confirm('是否确认删除存储委托信息审核记录编号为"' + RecordIDs + '"的数据项？').then(function () {
                return delDelegateauditrecords(RecordIDs);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('system/delegateauditrecords/export', {
                ...this.queryParams
            }, `delegateauditrecords_${new Date().getTime()}.xlsx`)
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.queryParams.pageSize = val
            this.getUserPage()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.queryParams.pageNum = val
            this.getUserPage()
        },
    }
};
</script>