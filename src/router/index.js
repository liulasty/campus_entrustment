import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import pageOne from '../views/PageOne.vue'
import pageTwo from '../views/PageTwo.vue'
import pageThree from '../views/pageThree'
import Login from '../views/login.vue'
import Sports from '../views/shouye.vue'
import Athlete from '../views/Athlete.vue'
import EventItem from '../views/EventItem.vue'
import AthleteApplication from '../views/AthleteApplication.vue'
import User from '../views/User.vue'
import myInfo from '../views/myInfo.vue'
import CreateDelegation from '@/views/user/CreateDelegation.vue'
import UserList from '@/views/admin/UserList.vue'
import DraftList from '@/views/admin/DraftList.vue'
import AuditList from '@/views/admin/AuditList.vue'
import PublishedList from '@/views/admin/PublishedList.vue'
import DelegationUpdateRecords from '@/views/admin/DelegationUpdateRecords.vue'
import SystemBulletinList from '@/views/admin/SystemBulletinList.vue'
import SystemNoticeList from '@/views/admin/SystemNoticeList.vue'
import DelegationType from '@/views/admin/DelegationType.vue'
import ViewOnGoingList from '@/views/user/ViewOnGoingList.vue'
import MyDelegationAcceptList from '@/views/user/MyDelegationAcceptList.vue'
import MyDelegationPublishList from '@/views/user/MyDelegationPublishList.vue'
import ExpireDelegationList from '@/views/admin/ExpireDelegationList.vue'

Vue.use(VueRouter)
const routes = [
    // 登录页面
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    // 主要页面
    {
        path: '/main',
        component: Main,
        children: [
            {
                path: '',
                components: {
                    default: Home
                }
            },
            { path: '/home', name: 'home', component: Home },
            { path: '/createDelegation', name: 'createDelegation', component: CreateDelegation },
            { path: '/user', name: 'user', component: User },
            { path: '/athlete', name: 'athlete', component: Athlete },
            { path: '/eventItem', name: 'eventItem', component: EventItem },
            { path: '/athleteApplication', name: 'athleteApplication', component: AthleteApplication },
            { path: '/myInfo', name: 'myInfo', component: myInfo },
            { path: '/page1', name: 'page1', component: pageOne },
            { path: '/page2', name: 'page2', component: pageTwo },
            { path: '/page3', name: 'page3', component: pageThree },
            { path: '/userList', name: 'userList', component: UserList },
            { path: '/draftList', name: 'draftList', component: DraftList },
            { path: '/auditList', name: 'auditList', component: AuditList },
            { path: '/publishedList', name: 'publishedList', component: PublishedList },
            { path: '/delegationUpdateRecords', name: 'delegationUpdateRecords', component: DelegationUpdateRecords },
            { path: '/systemBulletinList', name: 'systemBulletinList', component: SystemBulletinList },
            { path: '/systemNoticeList', name: 'systemNoticeList', component: SystemNoticeList },
            { path: '/delegationType', name: 'delegationType', component: DelegationType },
            { path: '/viewOnGoingList', name: 'viewOnGoingList', component: ViewOnGoingList },
            { path: '/myDelegationPublishList', name: 'myDelegationPublishList', component: MyDelegationPublishList },
            { path: '/myDelegationAcceptList', name: 'myDelegationAcceptList', component: MyDelegationAcceptList },
            { path: '/expireDelegationList', name: 'expireDelegationList', component: ExpireDelegationList }

        ]
    },
    // 默认页面
    {
        path: '/',
        name: 'sports',
        component: Sports,
    },


]


// 添加的方法
// 这段代码是为了解决重复点击导航时控制台出现报错的问题。具体来说，它重写了VueRouter的push方法。

// 在原有的代码中，VueRouter的push方法会返回一个Promise对象，当导航成功时，Promise会被resolve，当导航失败时，Promise会被reject。但是，如果在短时间内多次连续点击导航按钮，会导致多个导航请求同时发出，而这些请求会在前一个请求完成之前被取消，从而导致Promise被reject，控制台会出现报错。

// 为了解决这个问题，这段代码将VueRouter的push方法进行了重写。重写后的push方法在调用原有的VueRouter的push方法之前，先将其返回的Promise对象进行了catch处理，即使导航请求被取消，也会将错误捕获并返回一个空的Promise对象，从而避免了控制台报错。

// 最后，这段代码通过export default将重写后的router对象导出，以供其他模块使用。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
    routes,
    mode: 'history',
    base: '/campus_entrustment/'
})


export default router


