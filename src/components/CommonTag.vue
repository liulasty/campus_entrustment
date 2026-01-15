<template>
    <div class="tabs">
        <el-tag v-for="(item, index) in tags " :key="item.label" :closable="item.name !== 'home'"
            :effect="$route.name === item.name ? 'dark' : 'plain'" @click="changeMenu(item)"
            @close="handleClose(item, index)" size="small">
            {{ item.label }}
        </el-tag>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'CommonTag',
    data() {
        return {
        }
    },
    computed: {
        ...mapState({
            tags: state => state.tab.tabsList
        })
    },
    mounted() {
        // console.log('面包屑',this.$route.name,this.tags)
    },
    methods: {
        // 调用了一个名为mapMutations的函数，并传入了一个参数['closeTag']
        ...mapMutations(['closeTag']),
        //点击tag跳转效果
        changeMenu(item) {
            this.$router.push({ name: item.name })
        },
        // 点击tag删除效果
        handleClose(item, index) {
            //调用store中store函数
            this.closeTag(item)
            const length = this.tags.length
            //删除之后跳转
            if (item.name !== this.$route.name) {
                return
            }
            //删除最后一项
            if (index === length) {
                this.$router.push({
                    name: this.tags[index - 1].name
                })
            } else {
                this.$router.push({
                    name: this.tags[index].name
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
.tabs {
    padding: 10px 20px;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    display: flex;
    align-items: center;
    overflow-x: auto;
    white-space: nowrap;
    
    /* 隐藏滚动条但保留功能 */
    &::-webkit-scrollbar {
        height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    .el-tag {
        margin-right: 8px;
        cursor: pointer;
        border-radius: 4px;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        padding: 0 12px;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        display: flex;
        align-items: center;

        &:hover {
            color: #409EFF;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        /* 覆盖 Element UI 的 dark effect 样式，或者直接在这里利用选择器优先级 */
        &.el-tag--dark {
            background-color: #409EFF;
            color: #fff;
            border-color: #409EFF;
            box-shadow: 0 2px 6px rgba(64, 158, 255, 0.4);

            &:hover {
                background-color: #66b1ff;
                border-color: #66b1ff;
            }
            
            /deep/ .el-tag__close {
                color: #fff;
                &:hover {
                    background-color: rgba(0,0,0,0.2);
                }
            }
        }
        
        /deep/ .el-tag__close {
            margin-left: 8px;
            color: #495060;
            
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>