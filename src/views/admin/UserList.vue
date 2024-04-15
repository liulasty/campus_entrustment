<template>
    <div>
        <el-row :gutter="18">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="userInfoConfig.username">
                        <template slot="prepend">账号</template>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-input name="邮箱" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="userInfoConfig.email">
                        <template slot="prepend">邮箱</template>
                    </el-input>
                </div>

            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-select name="邮箱" v-model="userInfoConfig.isActive" clearable placeholder="请选择">
                        <template slot="prefix">是否激活</template>
                        <el-option label="激活" value=TRUE>
                        </el-option>
                        <el-option label="未激活" value=FALSE>
                        </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <div>
            <div style="margin-top: 20px">
                <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
            </div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="username" label="账号" width="120">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="120">
                </el-table-column>

                <el-table-column label="注册日期" width="120">
                    <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column prop="isActive" label="是否激活" width="120">
                </el-table-column>
                <el-table-column label="激活日期日期" width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isActive">
                            {{ scope.row.activeTime }}
                        </div>
                        <div v-else>
                            <el-button size="small" @click="auxiliaryActivation(scope.row)">辅助激活</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">

                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" @click="handleDelete(scope.row)">删除</el-button>
                        </div>
                        <div v-show="scope.row.role == 'user' && scope.row.isActive == TRUE">

                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :hide-on-single-page="hide_on_single_page" :current-page=userInfoConfig.page
                    :page-sizes="[5, 7, 10, 15]" :page-size=userInfoConfig.size
                    layout="total, sizes, prev, pager, next, jumper" :total="5">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getUserList } from '@/api';
export default {
    data() {
        return {
            hide_on_single_page: true,
            userInfoConfig: {
                username: "",
                email: "",
                isActive: "",
                size: 10,
                page: 1
            },
            total: 0,
            userList: [],
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
        }
    },
    methods: {
        getUserPage() {
            getUserList(this.userInfoConfig).then((res) => {
                console.log(res)
                this.tableData = res.data.data.records
            })
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    },
    mounted() {
        this.getUserPage();
    }
}
</script>
<style lang="less" scoped></style>