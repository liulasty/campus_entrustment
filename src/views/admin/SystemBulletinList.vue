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
                    <el-option label="草稿" value="草稿" />
                    <el-option label="已发布" value="已发布" />
                    <el-option label="已撤回" value="已撤回" />
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
        <div>
            <el-row class="table-btn-group">
                <el-col :span="24" class="table-btn-group-right">
                    <el-button type="primary" class="add-btn" size="small" @click="addDialogSystemBulletin"
                        round>添加系统公告</el-button>

                </el-col>
            </el-row>
            <el-row class="table-container">
                <el-col>
                    <el-table :data="list" border style="width: 100%">
                        <el-table-column fixed prop="createdAt" label="创建日期" width="170">
                        </el-table-column>
                        <el-table-column prop="title" label="主题" width="130" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="content" label="内容" width="150" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="status" label="公告状态" width="100">
                        </el-table-column>
                        <el-table-column prop="publishTime" label="发布时间" width="170">
                        </el-table-column>
                        <el-table-column prop="isPinned" label="是否置顶" width="60" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.isPinned" type="success">是</el-tag>
                                <el-tag v-else type="info">否</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="startEffectiveTime" label="开始时间" width="170" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="endEffectiveTime" label="结束时间" width="170" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="updatedAt" label="最后更新时间" width="170" show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column fixed="right" label="操作" width="250">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="handleUpdate(scope.row.announcementId)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="small"
                                    @click="handleDelete(scope.row.announcementId)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-col>
                <el-col class="toolbar">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="queryParams.pageNum" :page-sizes="[5, 7, 10]" :page-size="queryParams.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-col>
            </el-row>

        </div>
        <div>
            <el-dialog title="更改系统公告" :visible.sync="open" width="700px" append-to-body>
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-form-item label="公告主题" prop="title">
                        <el-input v-model="form.title" placeholder="请输入公告内容" />
                    </el-form-item>
                    <el-form-item label="公告状态" prop="status">
                        <el-select v-model="form.status">
                            <el-option label="草稿" value="草稿" />
                            <el-option label="已发布" value="已发布" />
                            <el-option label="已撤回" value="已撤回" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公告内容" prop="content">
                        <el-input v-model="form.content" type="textarea" placeholder="请输入公告内容" />
                    </el-form-item>
                    <el-form-item label="公告生效时间" prop="startEffectiveTime">
                        <el-date-picker v-model="dateTimeRange" type="datetimerange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否置顶" prop="isPinned">
                        <el-switch v-model="form.isPinned" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="公告发布时间" prop="publishTime">
                        <el-date-picker v-model="form.publishTime" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleUpdateSubmit">确 定</el-button>
                    <el-button @click="open = false">取 消</el-button>
                </div>
            </el-dialog>

        </div>


    </div>
</template>



<script>
    import { getSystemBulletinList, deleteSystemBulletin, getSystemBulletinById, updateSystemBulletin } from "@/api/";
    import { executeConfirmedRequest } from '@/utils/globalConfirmAction'
    export default {
        name: "SystemBulletinList",
        data() {
            return {
                list: [],
                open: false,
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
                },
                form: {},
                dateTimeRange: [],
                rules: {
                    description: [
                        { required: true, message: "公告内容不能为空", trigger: "blur" }
                    ],
                    title: [
                        { required: true, message: "公告主题不能为空", trigger: "blur" }
                    ],
                    content: [
                        { required: true, message: "公告内容不能为空", trigger: "blur" }
                        // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                    ],
                    startEffectiveTime: [
                        { required: true, message: "公告生效时间不能为空", trigger: "blur" }
                    ],
                    endEffectiveTime: [
                        { required: true, message: "公告失效时间不能为空", trigger: "blur" }
                        // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                    ],
                    status: [
                        { required: true, message: "公告状态不能为空", trigger: "blur" }
                    ],
                },
            }
        },
        created() {
            this.getList();
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
                        this.list = response.data.data.records.map((record) => {
                            // record.publishTime = new Date(record.publishTime);
                            // record.startEffectiveTime = new Date(record.startEffectiveTime);
                            // record.endEffectiveTime = new Date(record.endEffectiveTime);
                            return record;
                        });
                        this.total = response.data.data.total;
                        this.loading = false;


                    } else {
                        this.$message({
                            message: response.data.msg,
                            type: 'error'
                        });
                        this.loading = false;
                    }
                });
            },
            strToDate(dateString) {
                // 假设dateString的格式为 "YYYY年MM月DD日HH:mm:ss"  
                const parts = dateString.split(/[年月日:]/); // 使用年月日和冒号作为分隔符分割字符串  

                // 提取并转换年、月、日、时、分、秒  
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // 注意月份从0开始  
                const day = parseInt(parts[2], 10);
                const hours = parseInt(parts[3], 10);
                const minutes = parseInt(parts[4], 10);
                const seconds = parseInt(parts[5], 10);

                // 创建一个新的Date对象  
                const date = new Date(year, month, day, hours, minutes, seconds);
                // console.log("转换后的日期：", date);
                // 返回Date对象  
                return date;
            },
            dateToString(date) {


                // 获取年、月、日、小时、分钟和秒
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // 月份从 0 开始，需要加 1
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                // 格式化为指定字符串
                const formattedDateString = `${year}年${month < 10 ? '0' + month : month}月${day < 10 ? '0' + day : day}日${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

                // console.log("格式化后的日期：", formattedDateString);
                return formattedDateString;
            },
            handleUpdate(id) {
                console.log("获取公告", id);
                getSystemBulletinById(id).then(response => {
                    if (response.data.code == 1) {
                        this.form = response.data.data;
                        this.dateTimeRange = [this.strToDate(this.form.startEffectiveTime), this.strToDate(this.form.endEffectiveTime)];
                        this.form.publishTime = this.strToDate(this.form.publishTime);
                        console.log("获取公告", this.form, this.dateTimeRange);
                        this.open = true;
                    } else {
                        this.$message({
                            message: response.data.msg,
                            type: 'error'
                        });
                    }
                });
            },
            async handleDelete(id) {
                await executeConfirmedRequest(
                    deleteSystemBulletin,
                    { announcementId: id },
                    "确认删除该公告？",
                    "确认信息",
                    "删除成功",
                    "删除失败",
                    "删除取消"
                )
                this.getList();
            },
            handleSizeChange(val) {
                this.queryParams.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.queryParams.pageNum = val;
                this.getList();
            },
            handleUpdateSubmit() {

                this.$refs["form"].validate(valid => {


                    if (valid && this.dateTimeRange[0] > this.form.publishTime) {
                        this.form.startEffectiveTime = this.dateToString(this.dateTimeRange[0]);
                        this.form.endEffectiveTime = this.dateToString(this.dateTimeRange[1]);
                        this.form.publishTime = this.dateToString(this.form.publishTime);
                        this.form.createdAt = null;
                        this.form.updatedAt = null;

                        updateSystemBulletin(this.form).then(response => {
                            if (response.data.code == 1) {
                                this.$message({
                                    message: response.data.msg,
                                    type: 'success'
                                });
                                this.open = false;
                                this.getList();
                            } else {
                                this.$message({
                                    message: response.data.msg,
                                    type: 'error'
                                });
                            }
                        });


                    } else {
                        if (this.dateTimeRange[0] < this.form.publishTime) {
                            this.$message({
                                message: "发布时间不能大于生效时间",
                                type: 'error'
                            });
                        }
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            addDialogSystemBulletin() {

            }
        }
    }



</script>
<style lang="less" scoped>

</style>