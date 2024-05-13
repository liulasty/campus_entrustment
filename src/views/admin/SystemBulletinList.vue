<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="100px">
            <el-form-item label="公告内容" prop="description" class="input-reader-name">
                <el-input v-model="queryParams.description" placeholder="请输入委托内容关键词" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="公告状态" prop="status" class="input-reader-name">
                <el-select v-model="queryParams.status" clearable>
                    <el-option label="草稿" value="DRAFT" />
                    <el-option label="已发布" value="PUBLISHED" />
                    <el-option label="已撤回" value="WITHDRAWN" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序规则" prop="queryRules" class="input-reader-name">
                <el-select v-model="queryParams.queryRules">
                    <el-option label="发布时间" value="1" />
                    <el-option label="生效时间" value="2" />
                    <el-option label="更新时间" value="3" />
                    <el-option label="创建时间" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>



<script>
    import { getSystemBulletinList } from "@/api/";
    export default {
        name: "SystemBulletinList",
        data() {
            return {
                showSearch: true,
                loading: true,
                total: 0,
                descriptions: "",
                taskType: {},
                message: "",
                queryParams: {
                    pageNum: 1,
                    pageSize: 5,
                },
                TypeOption: {
                    "1": "系统公告",
                    "2": "系统通知",
                    "3": "系统消息"
                }

            }
        },
        methods: {
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            /** 获取公告列表 */
            getList() {
                this.loading = true;
                console.log("查询参数：", this.queryParams);
                getSystemBulletinList(this.queryParams).then(response => {
                    if (response.data.code == 1) {
                        this.viewOnGoingList = response.data.data.records.map((record) => {
                            record.type = this.taskType[`${record.type}`]; // 确保类型安全
                            return record;
                        });
                        this.total = response.data.data.total;
                        this.loading = false;
                        console.log(this.viewOnGoingList);
                        console.log(this.total);
                        console.log(this.loading);

                    } else {
                        this.$message({
                            message: response.data.msg,
                            type: 'error'
                        });
                        this.loading = false;
                    }
                });
            }
        }
    }



</script>
<style lang="less" scoped>

</style>