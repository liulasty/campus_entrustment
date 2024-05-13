<template>
    <div class="app-container">
        <el-row>
            <el-form size="small" :inline="true" label-width="98px">
                <el-form-item label="委托类型" prop="categoryName" class="input-reader-name">
                    <el-input v-model="queryParams.categoryName" placeholder="请输入委托类型" clearable />
                </el-form-item>
                <el-form-item label=" 公告状态" prop="isEnable" class="input-reader-name">
                    <el-select v-model="queryParams.isEnable" clearable>
                        <el-option label="启用" value="1" />
                        <el-option label="禁用" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型描述" prop="description" class="input-reader-name">
                    <el-input v-model="queryParams.description" placeholder="请输入委托类型描述关键词" clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>

            </el-form>

        </el-row>
        <el-row class="table-btn-group">

            <el-col :span="24" class="table-btn-group-right">
                <el-button type="primary" class="add-btn" size="small" @click="addDialogForm = true"
                    round>添加委托类型</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="list" border stripe>
                <el-table-column prop="categoryId" label="编号" width="100" />
                <el-table-column prop="categoryName" label="委托类型" width="200" />
                <el-table-column prop="categoryDescription" label="详情" width="400" show-overflow-tooltip />
                <el-table-column prop="isEnabled" label="状态" width="200">
                    <template slot-scope="scope">

                        <el-tag :type="scope.row.isEnabled === true ? 'success' : 'primary'" disable-transitions>
                            {{scope.row.isEnabled === true ? '已启用' : '已禁用'}}
                        </el-tag>
                    </template>

                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small"
                            @click="handleUpdate(scope.row.categoryId)">编辑</el-button>
                        <el-button type="warning" size="small"
                            @click="handleDelete(scope.row.categoryId)">删除</el-button>
                        <el-button type="scope.row.isEnabled === true ? 'success' : 'primary'" size="small"
                            @click="handleEnable(scope.row.categoryId,scope.row.isEnabled)">
                            {{scope.row.isEnabled === true ? '禁用' :'启用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page=queryParams.pageNum :page-sizes="[3, 5, 7, 10]" :page-size=queryParams.pageSize
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-row>
        <div>
            <el-dialog title="添加委托类型" :visible.sync="addDialogForm" width="30%">
                <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" size="small">
                    <el-form-item label="委托类型" prop="categoryName">
                        <el-input v-model="addForm.categoryName" placeholder="请输入委托类型" clearable />
                    </el-form-item>
                    <el-form-item label="委托类型描述" prop="categoryDescription">
                        <el-input v-model="addForm.categoryDescription" placeholder="请输入委托类型描述" clearable />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogForm = false">取 消</el-button>
                    <el-button type="primary" @click="addDelegationType">添 加</el-button>
                </span>
            </el-dialog>
            <el-dialog title="编辑委托类型" :visible.sync="updateDialogForm" width="30%">
                <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px" size="small">
                    <el-form-item label="委托类型" prop="categoryName">
                        <el-input v-model="updateForm.categoryName" placeholder="请输入委托类型" clearable />
                    </el-form-item>
                    <el-form-item label="委托类型描述" prop="categoryDescription">
                        <el-input v-model="updateForm.categoryDescription" placeholder="请输入委托类型描述" clearable />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateDialogForm = false">取 消</el-button>
                    <el-button type="primary" @click="updateDelegationType">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import {
        getDelegationTypeList, getDelegationTypeById, updateDelegationTypeAdmin, addDelegationTypeAdmin,
        deleteDelegationType, enableDelegationType
    } from "@/api/";
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'
    export default {
        name: "DelegationType",
        data() {
            return {
                queryParams: {
                    pageNum: 1,
                    pageSize: 5,
                },
                total: 0,
                type: "error",
                open: false,
                list: [],
                addDialogForm: false,
                addForm: {
                    categoryName: "",
                    categoryDescription: "",
                },
                updateDialogForm: false,
                updateForm: {},
                rules: {
                    categoryName: [
                        { required: true, message: "请输入委托类型", trigger: "blur" },
                    ],
                    categoryDescription: [
                        { required: true, message: "请输入委托类型描述", trigger: "blur" },
                    ],
                },

            }
        },
        methods: {
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            resetQuery() {
                this.queryParams = {
                    description: "",
                    status: "",
                    pageNum: 1,
                    pageSize: 5,
                };
                this.getList();
            },
            getList() {
                this.loading = true;
                console.log("查询参数：", this.queryParams);
                getDelegationTypeList(this.queryParams).then(response => {
                    if (response.data.code == 1) {
                        this.list = response.data.data.records.map((record) => {
                            return record;
                        });
                        this.total = response.data.data.total;
                    } else {
                        this.$message({
                            message: response.data.data.msg,
                            type: "error",
                        });
                    }
                });

            },

            handleSizeChange(val) {
                this.queryParams.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getList();
            },
            handleUpdate(id) {
                this.updateDialogForm = true;
                getDelegationTypeById(id).then(response => {
                    if (response.data.code == 1) {
                        this.updateForm = response.data.data;
                    } else {
                        this.$message({
                            message: response.data.data.msg,
                            type: "error",
                        });
                    }
                });
            },
            updateDelegationType() {
                this.$refs.updateForm.validate(valid => {
                    if (valid) {
                        updateDelegationTypeAdmin(this.updateForm).then(response => {
                            if (response.data.code == 1) {
                                this.$message({
                                    message: response.data.msg,
                                    type: "success",
                                });
                                this.updateDialogForm = false;
                                this.getList();
                            } else {
                                this.$message({
                                    message: response.data.msg,
                                    type: "error",
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            async handleDelete(id) {

                await executeConfirmedRequest(
                    deleteDelegationType,
                    id,
                    '确认删除该委托类型？',
                    '确认信息',
                    '操作成功',
                    '操作警告',
                    '操作失败，请稍后重试',
                    '操作已取消'
                )
                this.getList();
            },
            async handleEnable(id, status) {
                console.log("id, status", id, status);
                if (status == 1) {
                    await executeConfirmedRequest(
                        enableDelegationType,
                        id,
                        '确认禁用该委托类型？',
                        '确认信息',
                        '操作成功',
                        '操作警告',
                        '操作失败，请稍后重试',
                        '操作已取消'
                    )
                } else {
                    await executeConfirmedRequest(
                        enableDelegationType,
                        id,
                        '确认启用该委托类型？',
                        '确认信息',
                        '操作成功',
                        '操作警告',
                        '操作失败，请稍后重试',
                        '操作已取消'
                    )

                }
                this.getList();

            },
            async addDelegationType() {
                await executeConfirmedRequest(
                    addDelegationTypeAdmin,
                    this.addForm,
                    '确认添加该委托类型？',
                    '确认信息',
                    '操作成功',
                    '操作警告',
                    '操作失败，请稍后重试',
                    '操作已取消'
                )
                this.addDialogForm = false;
                this.getList();

            }
        },

        created() {
            this.getList();
        },
    }

</script>
<style lang="less" scoped>
    .table-btn-group-right {
        margin-bottom: 10px;
        text-align: right;
    }
</style>