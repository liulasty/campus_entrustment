<template>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        :collapse="isCollapse" background-color="#545c64" text-color="#fff" activeIndex="activeIndex"
        active-text-color="#ffd04b">
        <h3>{{ isCollapse ? '委托' : '校园委托平台' }}</h3>
        <el-menu-item @click="clickMenu(item)" v-for="item in noChildren" :key="item.index" :index="item.index">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{ item.label }}</span>
        </el-menu-item>
        <el-submenu v-for="item in hasChildren" :key="item.label" :index="item.index">
            <template slot="title">
                <i :class="`el-icon-${item.icon}`"></i>
                <span slot="title">{{ item.label }}</span>
            </template>
            <el-menu-item-group v-for="subItem in item.children" :key="subItem.index">
                <el-menu-item @click="clickMenu(subItem)" :index="subItem.index">{{ subItem.label }}</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>



<style lang="less" scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        height: 792px;
    }

    .el-menu {
        height: 100vh;
        border: 0px;

        h3 {
            color: #fff;
            text-align: center;
            line-height: 48px;
            font-size: 16px;
            font-weight: 400;
        }
    }
</style>

<script>



    export default {
        watch: {
            '$route'(to, from) {
                // 在路由变化时触发，你可以在这里更新面包屑的样式
                // 比如根据当前路由信息 to 来设置面包屑样式
                console.log("to ", to)
                this.updateMenuState(to.path);
            }
        },
        data() {
            return {
                isUniqueOpened: true,
                activeIndex: '1',
                //当前打开的菜单
                openeds: [],
                //菜单
                menuData: [
                    {
                        path: '/home',
                        name: 'home',
                        label: '首页',
                        icon: 's-home',
                        url: 'Home/Home',
                        index: '1'
                    },
                    {
                        path: '/createDelegation',
                        name: 'createDelegation',
                        label: '发布委托',
                        icon: 'user',
                        url: 'user/CreateDelegation',
                        index: '2'
                    },
                    {
                        path: '/viewOnGoingList',
                        name: 'viewOnGoingList',
                        label: '浏览委托',
                        icon: 's-custom',
                        url: 'ongoing/ongoing',
                        index: '3'
                    },
                    {
                        label: '我的委托',
                        icon: 's-custom',
                        index: '4',
                        children: [
                            {
                                path: '/myDelegationPublishList',
                                name: 'myDelegationPublishList',
                                label: '我的发布',
                                icon: 'setting',
                                url: 'Other/PageOne',
                                index: '4-1'
                            },
                            {
                                path: '/myDelegationAcceptList',
                                name: 'myDelegationAcceptList',
                                label: '我的接收',
                                icon: 'setting',
                                url: 'Other/PageTwo',
                                index: '4-2'
                            }
                        ]
                    },
                    {
                        path: '/myInfo',
                        name: 'myInfo',
                        label: '个人信息',
                        icon: 's-custom',
                        url: 'eventItemMange/eventItemMange',
                        index: '5',

                    },
                    {
                        path: '/athleteApplication',
                        name: 'athleteApplication',
                        label: '帮助与支持',
                        icon: 's-custom',
                        url: 'athleteApplication/athleteApplication',
                        index: '6'
                    }
                    // ,
                    // {
                    //     label: '其他',
                    //     icon: 'location',
                    //     children: [
                    //         {
                    //             path: '/page1',
                    //             name: 'page1',
                    //             label: '页面1',
                    //             icon: 'setting',
                    //             url: 'Other/PageOne'
                    //         },
                    //         {
                    //             path: '/page2',
                    //             name: 'page2',
                    //             label: '页面2',
                    //             icon: 'setting',
                    //             url: 'Other/PageTwo'
                    //         },
                    //     ]

                    // }
                ]

            };
        },
        methods: {
            handleOpen(key, keyPath) {

                console.log(key, keyPath);

            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            clickMenu(item) {
                console.log("点击菜单", item)

                if (this.$route.path !== item.path) {
                    this.$router.push(item.path)
                } else {
                    // this.refreshPage()
                }
                this.$store.commit('selectMenu', item)

            },
            refreshPage() {
                this.$router.go(0);
            },
            setUserInfo() {
                const userInfo = localStorage.getItem('TaskUser')
                // console.log("userInfo", userInfo)
                this.$store.commit('loginUser', JSON.parse(userInfo))
            },
            extractPathsAndIndices() {
                const result = [];
                this.menuData.forEach((item) => {
                    if (!item.children) {

                        result.push({ path: item.path, index: item.index });
                    } else {

                        item.children.forEach((child) => {

                            result.push({ path: child.path, index: child.index });
                        });
                    }

                });

                return result;
            },
            userPermissions(type) {
                if (type === 'ADMIN') {
                    this.menuData = [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 's-home',
                            url: 'Home/Home',
                            index: '1'
                        },
                        {
                            path: '/userList',
                            name: 'userList',
                            label: '用户管理',
                            icon: 's-home',
                            url: '/userList',
                            index: '2',
                        },
                        {
                            label: '委托管理',
                            icon: 'location',
                            index: '3',
                            children: [
                                {
                                    path: '/draftList',
                                    name: 'draftList',
                                    label: '草稿与审核',
                                    icon: 'setting',
                                    url: 'delegation/draftList',
                                    index: '3-1'
                                },
                                {
                                    path: '/auditList',
                                    name: 'auditList',
                                    label: '发布与接收',
                                    icon: 'setting',
                                    url: 'delegation/auditList',
                                    index: '3-2'
                                },
                                {
                                    path: '/expireDelegationList',
                                    name: 'expireDelegationList',
                                    label: '未完成委托',
                                    icon: 'setting',
                                    url: 'delegation/ExpireDelegationList',
                                    index: '3-3'
                                },
                                {
                                    path: '/delegationUpdateRecords',
                                    name: 'delegationUpdateRecords',
                                    label: '委托更新记录',
                                    icon: 'setting',
                                    url: 'delegation/DelegationUpdateRecords',
                                    index: '3-4'
                                },
                            ]
                        },
                        {
                            label: '系统管理',
                            icon: 'user', index: '4',
                            children: [
                                {
                                    path: '/systemBulletinList',
                                    name: 'systemBulletinList',
                                    label: '系统公告',
                                    icon: 'setting',
                                    url: 'sys/systemBulletinList',
                                    index: '4-1'
                                },
                                {
                                    path: '/systemNoticeList',
                                    name: 'systemNoticeList',
                                    label: '系统通知',
                                    icon: 'setting',
                                    url: 'sys/systemNoticeList',
                                    index: '4-2'
                                },
                            ]
                        },
                        {
                            label: '校园委托相关设置',
                            icon: 's-custom', index: '5',
                            children: [
                                {
                                    path: '/delegationType',
                                    name: 'delegationType',
                                    label: '委托类别',
                                    icon: 'setting',
                                    url: 'setting/delegationType',
                                    index: '5-1'
                                },
                                {
                                    path: '/systemNoticeList',
                                    name: 'systemNoticeList',
                                    label: '系统通知',
                                    icon: 'setting',
                                    url: 'setting/systemNoticeList',
                                    index: '5-2'
                                },
                            ]
                        },
                        {
                            label: "消息管理",
                            icon: "bell",
                            index: "6",
                            children: [
                                {
                                    path: '/notificationReadStatus',
                                    name: 'notificationReadStatus',
                                    label: '消息通知',
                                    icon: 's-comment',
                                    url: 'Other/PageThree',
                                    index: '6-1'
                                },
                                {
                                    path: '/notifications',
                                    name: 'notifications',
                                    label: '消息管理',
                                    icon: 'chat-dot-square',
                                    url: 'Other/PageThree',
                                    index: '6-2'
                                }
                            ]
                        }
                    ]
                }
            },
            initAside() {
                const currentPath = this.$route.path;
                this.menuData.forEach((item) => {
                    if (!item.children) {
                        if (item.path === currentPath) {
                            this.$store.commit('selectMenu', item)
                            this.activeIndex = item.index;
                            if (currentPath === '/home') {
                                console.log('item:', this.menuData);
                            }
                        }
                    } else {
                        item.children.forEach((child) => {
                            if (child.path === currentPath) {
                                this.$store.commit('selectMenu', child)
                                this.activeIndex = child.index;
                            }
                        });
                    }

                });
            },
            updateMenuState(path) {

                const currentPath = path; // 或者使用其他属性如 `$route.params` 根据实际情况
                const activeItem = this.extractPathsAndIndices().find(item => item.path === currentPath);
                console.log(activeItem);
                if (activeItem) {
                    console.log("this.openeds", this.openeds);
                } else {

                    this.activeIndex = 1; // 或默认值
                }


            }
        },
        mounted() {

            this.setUserInfo()
            this.userPermissions(this.$store.state.userInfo.userType)
            this.initAside()
        },
        computed: {
            //没有子菜单
            noChildren() {
                return this.menuData.filter(item => !item.children)
            },
            hasChildren() {
                return this.menuData.filter(item => item.children)
            },
            isCollapse() {
                return this.$store.state.tab.isCollapse
            }

        }
    }

</script>
<style lang="less" scoped>
    .el-menu {
        border-right: none;
    }
</style>