<template>
    <div class="main-container">
        <el-container class="full-height">
            <el-aside width="auto" class="app-aside">
                <common-aside />
            </el-aside>
            <el-container class="app-content-container">
                <el-header class="app-header">
                    <common-header />
                </el-header>
                <div class="tags-view-container">
                    <common-tag />
                </div>
                <el-main class="app-main">
                    <transition name="fade-transform" mode="out-in">
                        <router-view class="router-view" />
                    </transition>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
    .main-container {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: #f0f2f5;
    }

    .full-height {
        height: 100%;
    }

    .app-aside {
        background-color: #304156;
        transition: width 0.3s;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
        z-index: 1001;
        overflow-x: hidden;
    }

    .app-content-container {
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .app-header {
        padding: 0;
        height: 60px !important;
        background-color: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        z-index: 1000;
    }

    .tags-view-container {
        height: 34px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
        padding: 0 10px;
        display: flex;
        align-items: center;
    }

    .app-main {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: #f0f2f5;
        position: relative;
    }

    .router-view {
        background: #fff;
        padding: 20px;
        border-radius: 4px;
        min-height: calc(100% - 40px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    /* 页面切换动画 */
    .fade-transform-leave-active,
    .fade-transform-enter-active {
        transition: all .5s;
    }

    .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
    }

    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
</style>

<script>
    import CommonAside from '../../components/CommonAside.vue'
    import CommonHeader from '../../components/CommonHeader.vue';
    import CommonTag from '@/components/CommonTag.vue';

    export default {
        components: {
            CommonAside,
            CommonHeader,
            CommonTag
        },
        data() {
            return {

            }
        }
    }
</script>