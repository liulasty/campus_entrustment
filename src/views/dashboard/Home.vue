<template>
    <el-row :gutter="20" class="dashboard-container">
        <el-col :span="8">
            <el-card class="box-card announcement-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span><i class="el-icon-bell"></i> 系统公告</span>
                </div>
                <el-carousel height="300px" direction="vertical" :autoplay="true" :interval="5000">
                    <el-carousel-item v-for="item in NewestInfo.systemAnnouncements" :key="item.announcementId">
                        <div class="announcement-content">
                            <h3 class="info-title">
                                <el-tag v-if="item.isPinned" type="danger" size="mini" effect="dark">置顶</el-tag>
                                {{ item.title }}
                            </h3>
                            <p class="info-desc">
                                {{ item.content }}
                            </p>
                            <div class="info-meta">
                                <span class="time"><i class="el-icon-time"></i> {{ item.publishTime }}</span>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </el-card>

            <el-card class="box-card latest-task-card" shadow="hover" style="margin-top: 20px;">
                <div slot="header" class="clearfix">
                    <span><i class="el-icon-tickets"></i> 最新委托</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="$router.push('/viewOnGoingList')">更多</el-button>
                </div>
                <el-table :data="tableData" height="300" style="width: 100%" :show-header="true" size="small">
                    <el-table-column prop="type" label="类型" width="80">
                         <template slot-scope="scope">
                            <el-tag size="mini">{{ scope.row.type }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="内容" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="startTime" label="发布时间" width="140">
                         <template slot-scope="scope">
                            <span style="font-size: 12px; color: #909399;">{{ scope.row.startTime }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-col>

        <el-col :span="16">
            <div class="num-cards">
                <el-card v-for="item in countData" :key="item.name" shadow="hover" class="num-card" :body-style="{ padding: '20px', display: 'flex', alignItems: 'center' }">
                    <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }" />
                    <div class="detail">
                        <p class="price">{{ item.value }}</p>
                        <p class="desc">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>

            <el-card shadow="hover" class="chart-card" style="margin-top: 20px;">
                <div slot="header" class="clearfix">
                    <span><i class="el-icon-s-data"></i> 热门委托统计</span>
                </div>
                <div ref="echarts1" class="echarts-box" style="height: 300px; width: 100%;"></div>
            </el-card>

            <el-row :gutter="20" style="margin-top: 20px;">
                <el-col :span="12">
                     <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>新增数据</span>
                        </div>
                        <div ref="echarts2" style="height: 250px; width: 100%;"></div>
                     </el-card>
                </el-col>
                <el-col :span="12">
                     <el-card shadow="hover">
                         <div slot="header" class="clearfix">
                            <span>数据占比</span>
                        </div>
                        <div ref="echarts3" style="height: 250px; width: 100%;"></div>
                     </el-card>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script>

    import * as echarts from 'echarts';
    import { mapState } from 'vuex';
    import { getData } from '@/api';
    import { data } from 'jquery';


    export default {
        components: {},
        data() {
            return {
                tableData: [{
                    description: '2016-05-03',
                    startTime: '活动名称',
                    type: '参赛资格',
                    location: '0',
                    ownerID: ''

                },
                {
                    description: '2016-05-03',
                    startTime: '活动名称',
                    type: '参赛资格',
                    location: '0',
                    ownerID: ''

                },
                {
                    description: '2016-05-03',
                    startTime: '活动名称',
                    type: '参赛资格',
                    location: '0',
                    ownerID: ''

                },
                {
                    description: '2016-05-03',
                    startTime: '活动名称',
                    type: '参赛资格',
                    location: '0',
                    ownerID: ''

                },],

                countData: [
                    {
                        name: "今日已接受",
                        value: 12,
                        icon: "success",
                        color: "#2ec7c9",
                    },
                    {
                        name: "本周已接受",
                        value: 13,
                        icon: "star-on",
                        color: "#ffb980",
                    },
                    {
                        name: "本月已接受",
                        value: 14,
                        icon: "s-goods",
                        color: "#5ab1ef",
                    },
                    {
                        name: "今日已发布",
                        value: 14,
                        icon: "success",
                        color: "#2ec7c9",
                    },
                    {
                        name: "本周已发布",
                        value: 14,
                        icon: "star-on",
                        color: "#ffb980",
                    },
                    {
                        name: "本月已发布",
                        value: 14,
                        icon: "s-goods",
                        color: "#5ab1ef",
                    },
                ],
                tableLabel: {
                    name: '活动名称',
                    type: '参赛资格',
                    fee: '费用'
                },
                userInfo: {
                    userName: '',
                    type: '',
                    avatarSrc: ''
                },
                NewestInfo: {
                    systemAnnouncements: {},
                    newestTask: {},
                    hotTaskCategory: {},
                    transactionStats: {
                        "今日已接受": 0,
                        "本周已接受": 4,
                        "本月已接受": 7,
                        "今日已发布": 1,
                        "本周已发布": 9,
                        "本月已发布": 13
                    },
                    tasksWithUser: {}
                }
            }
        },
        mounted() {

            const sportsUser = localStorage.getItem('TaskUser')
            const parsedUser = JSON.parse(sportsUser);

            this.userInfo = parsedUser
            console.log("userInfo", this.userInfo)

            getData(2).then((data) => {
                this.NewestInfo = data.data.data
                // console.log("快速信息展示", this.NewestInfo);
                this.tableData = this.NewestInfo.newestTask;
                this.countData.forEach(item => {
                    const key = item.name;
                    if (key in this.NewestInfo.transactionStats) {
                        item.value = this.NewestInfo.transactionStats[key];
                    } else {
                        console.warn(`No matching statistic found for key: ${key}`);
                    }
                });

                // var newMap = Object.keys(this.NewestInfo.hotTaskCategory).map(key => ({
                //     name: key,
                //     taskTypeId: this.NewestInfo.hotTaskCategory[key].typeCount
                // }))
                this.generateEchart1(this.NewestInfo.hotTaskCategory);


            })


            //     getData().then((data) => {
            //         const dataAll = data.data.data
            //         this.tableData = dataAll.tableData
            //         // console.log("tableData", this.tableData)
            //         this.countData[0].value = dataAll.totalNumberAthletes;
            //         this.countData[1].value = dataAll.totalNumberActivities;
            //         this.countData[2].value = dataAll.totalNumberProjects;
            //         this.countData[3].value = dataAll.newAthletesAddedMonth;
            //         this.countData[4].value = dataAll.newActivitiesAddedMonth;
            //         this.countData[5].value = dataAll.newProjectsAddedMonth;


            //         this.tableData.forEach(item => {
            //             item.date = this.DateToString(item.date)
            //         })
            //         const echarts1 = echarts.init(this.$refs.echarts1);
            //         // 指定图表的配置项和数据
            //         var option = {
            //             title: {
            //                 text: '各项报名方式的活动统计'
            //             },
            //             // tooltip: 用于配置图表的工具提示（Tooltip）。
            //             tooltip: {
            //                 // trigger: 'axis': 这表示工具提示将在鼠标悬停在数据点上时触发，并显示与轴相对应的数据值。这通常用于线型图表，以帮助用户查看每个系列在不同数据点上的具体值。
            //                 trigger: 'axis'
            //             },
            //             // legend: 配置图例，用于标识每个系列的名称。
            //             legend: {
            //                 // data: 包含了图例的数据，这些数据与之前配置的各个系列的名称相对应。在这里，图例包括 'Email'、'Union Ads'、'Video Ads'、'Direct' 和 'Search Engine'。
            //                 data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            //             },
            //             // grid: 配置图表的网格，用于控制图表的位置和大小。
            //             grid: {
            //                 // left, right, bottom: 这些属性指定了图表的边距，即图表与容器边界之间的空白区域。这些值通常以百分比或像素表示。
            //                 left: '3%',
            //                 right: '4%',
            //                 bottom: '3%',
            //                 // containLabel: true: 如果设置为 true，则表示网格将包含轴标签和标题等内容。这确保了网格的大小会自动调整，以便完全容纳所有内容。
            //                 containLabel: true
            //             },
            //             // toolbox: 配置图表的工具箱，用于添加一些交互式功能。
            //             toolbox: {
            //                 // feature: 用于配置工具箱中的功能。在这里，只定义了一个功能，即 saveAsImage，它允许用户保存图表为图像文件。工具箱可以包含其他功能，如数据视图、数据区域缩放、刷新等，根据您的需求添加。
            //                 feature: {
            //                     saveAsImage: {}
            //                 }
            //             },
            //             xAxis: {
            //                 type: 'category',
            //                 boundaryGap: false,
            //                 data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            //             },
            //             yAxis: {
            //                 type: 'value'
            //             },
            //             series: [
            //                 // name: 每个系列的名称，将显示在图例中，用于标识每个系列的数据。
            //                 // type: 'line': 指定了这些系列是线型的，即它们将在图表上以线的形式表示。
            //                 // stack: 'Total': 这表示这些系列将在同一堆栈中堆叠。在图表中，这意味着它们的值将相加在一起，以显示它们在每个数据点上的总和。
            //                 // data: 每个系列的具体数据点。在示例中，每个系列包括七个数据点，分别对应不同的时间或类别。
            //                 // {
            //                 //     name: 'Email',
            //                 //     type: 'line',
            //                 //     stack: 'Total',
            //                 //     data: [120, 132, 101, 134, 90, 230, 210]
            //                 // }
            //             ]
            //         };

            //         const { orderData, userData, doughnutData } = dataAll
            //         // console.log("orderData", dataAll.orderData)
            //         const xAxis = Object.keys(orderData.data[0])

            //         option.xAxis = {
            //             data: orderData.date,
            //         }
            //         option.legend = {
            //             data: xAxis,
            //         }
            //         xAxis.forEach(key => {
            //             option.series.push({
            //                 name: key,
            //                 data: orderData.data.map(item => item[key]),
            //                 type: 'line',
            //             })
            //         })

            //         // 使用刚指定的配置项和数据显示图表。
            //         echarts1.setOption(option);

            //         //柱状图
            //         const echarts2 = echarts.init(this.$refs.echarts2);

            //         option = {
            //             tooltip: {
            //                 trigger: 'axis',
            //                 axisPointer: {
            //                     type: 'shadow',
            //                     label: {
            //                         show: true
            //                     }
            //                 }
            //             },
            //             toolbox: {
            //                 show: true,
            //                 feature: {
            //                     mark: { show: true },
            //                     dataView: { show: true, readOnly: false },
            //                     magicType: { show: true, type: ['line', 'bar'] },
            //                     // restore: { show: true },
            //                     saveAsImage: { show: true }
            //                 }
            //             },
            //             calculable: true,
            //             legend: {
            //                 data: ['新增学生', '新增运动员'],
            //                 itemGap: 2,
            //                 left: 'center',
            //                 top: 0,
            //                 align: 'auto',
            //                 width: '165px',
            //                 type: 'scroll',
            //             },
            //             grid: {
            //                 top: '27%',
            //                 left: '1%',
            //                 right: '1%',
            //                 bottom: '5%',
            //                 containLabel: true
            //             },
            //             xAxis: [
            //                 {
            //                     type: 'category',
            //                     data: userData.map(item => item.date)
            //                 }
            //             ],
            //             yAxis: [
            //                 {
            //                     type: 'value',
            //                     name: '人数 ',
            //                     nameTextStyle: {
            //                         align: 'left',
            //                     },
            //                 }
            //             ],
            //             series: [
            //                 {
            //                     name: '新增学生',
            //                     type: 'bar',
            //                     data: userData.map(item => item.addUser)
            //                 },
            //                 {
            //                     name: '新增运动员',
            //                     type: 'bar',
            //                     data: userData.map(item => item.addAthlete)
            //                 }
            //             ]
            //         };

            //         echarts2.setOption(option);
            //         let data_pie = []; // 创建一个空的数组来存储数据
            //         let total_pie = 0;
            //         // 使用循环将用户输入的数据添加到数组中
            //         for (let i = 0; i < doughnutData.length; i++) {
            //             data_pie.push({ value: doughnutData[i].nums, name: doughnutData[i].type });
            //             total_pie = total_pie + doughnutData[i].nums;
            //         }

            //         let data_end = [
            //             {
            //                 // make an record to fill the bottom 50%
            //                 value: total_pie,
            //                 itemStyle: {
            //                     // stop the chart from rendering this piece
            //                     color: 'none',
            //                     decal: {
            //                         symbol: 'none'
            //                     }
            //                 },
            //                 label: {
            //                     show: false
            //                 }
            //             }
            //         ];
            //         data_pie.push(data_end[0]);
            //         //饼图
            //         const echarts3 = echarts.init(this.$refs.echarts3);

            //         // 配置项
            //         option = {
            //             tooltip: {
            //                 // trigger: '参加项目运动员占比'
            //             },
            //             legend: {
            //                 top: '2%',
            //                 left: 'center',
            //                 // doesn't perfectly work with our tricks, disable it
            //                 // 启用选中模式
            //                 selectedMode: false,
            //                 type: 'scroll',
            //             },
            //             series: [
            //                 {
            //                     name: 'Access From',
            //                     type: 'pie',
            //                     // 半径
            //                     radius: ['40%', '80%'],
            //                     // 中心
            //                     center: ['50%', '80%'],
            //                     // 调整起始角度
            //                     startAngle: 180,

            //                     // formatter(param) { return param.name + ' (' + param.percent * 2 + '%)'; } 是用来格式化标签内容的函数。
            //                     // 在这里，param 是传入的参数对象，包含了标签所需的数据。通过这个函数，可以自定义标签的显示内容。
            //                     // 在这个例子中，标签的内容包括了数据项的名称和一个经过修改的百分比。这里的 param.percent * 2 对百分比进行了修改，将其乘以 2。
            //                     label: {
            //                         //表示显示标签，如果设置为 false 则会隐藏标签。

            //                         show: false,

            //                         formatter(param) {
            //                             // correct the percentage
            //                             return param.name + ' (' + param.percent * 2 + '%)';
            //                         }
            //                     },
            //                     data: data_pie,
            //                     tooltip: {
            //                         trigger: 'item', // 鼠标悬停到扇形上触发显示
            //                         formatter(param) {
            //                             // 自定义提示框内容的显示
            //                             return '名称：' + param.name + '<br/>' +
            //                                 '数值：' + param.value + '<br/>' +
            //                                 '占比：' + (param.percent * 2).toFixed(2) + '%';
            //                         }
            //                     }
            //                 },

            //             ],


            //         };
            //         echarts3.setOption(option);
            //     })

        },
        methods: {

            // 获取数据生成条状图
            generateEchart1(data) {
                const taskTypeNames = [];
                const typeCounts = [];

                for (const category in data) {
                    taskTypeNames.push(category);
                    typeCounts.push(data[category].typeCount);
                }


                const echarts1 = echarts.init(this.$refs.echarts1);
                var option = {
                    title: {
                        text: '热门委托统计'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
                    },
                    series: [
                        {
                            name: '委托统计',
                            type: 'bar',
                            data: [23, 23489, 29034, 104970, 131744, 12]
                        },

                    ]
                };

                option.yAxis.data = taskTypeNames;
                option.series[0].data = typeCounts;
                echarts1.setOption(option);


            },

            //时间格式转换
            DateToString(dateString) {

                const date = new Date(dateString);

                const year = date.getFullYear();
                const month = date.getMonth() + 1; // 月份是从0开始计数的，所以需要加1
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();

                // 构建格式化后的字符串
                const formattedDate = `${year}年${month}月${day}日${hours}时${minutes}分`;

                return formattedDate
            }

        },
        // 在组件B中计算属性或mapState来访问状态  

        // computed: {
        //     ...mapState({
        //         avatarSrc: state => state.userInfo.avatarSrc
        //     })

        // }

    }
</script>

<style lang="less" scoped>
    .dashboard-container {
        padding: 10px;
    }

    .box-card {
        margin-bottom: 20px;
        
        .clearfix {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
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

    .announcement-card {
        .announcement-content {
            padding: 10px 20px;
            text-align: left;
            
            .info-title {
                font-size: 16px;
                color: #303133;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                
                .el-tag {
                    margin-right: 8px;
                }
            }
            
            .info-desc {
                font-size: 14px;
                color: #606266;
                line-height: 1.6;
                height: 200px;
                overflow-y: auto;
                margin-bottom: 15px;
            }
            
            .info-meta {
                display: flex;
                justify-content: space-between;
                color: #909399;
                font-size: 12px;
                border-top: 1px solid #ebeef5;
                padding-top: 10px;
            }
        }
    }

    .num-cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        
        .num-card {
            width: 32%;
            margin-bottom: 15px;
            border: none;
            
            .icon {
                width: 60px;
                height: 60px;
                font-size: 30px;
                text-align: center;
                line-height: 60px;
                color: #fff;
                border-radius: 8px;
            }
            
            .detail {
                margin-left: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                
                .price {
                    font-size: 24px;
                    margin-bottom: 5px;
                    line-height: 30px;
                    height: 30px;
                    color: #303133;
                    font-weight: bold;
                    margin: 0;
                }
                
                .desc {
                    font-size: 12px;
                    color: #909399;
                    text-align: center;
                    margin: 0;
                }
            }
        }
    }
    
    .chart-card {
        /deep/ .el-card__body {
            padding: 10px;
        }
    }
</style>