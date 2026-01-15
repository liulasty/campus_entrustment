<template>
  <div class="header-container">
    <div class="l-content">
      <el-button 
        @click="handleMenu" 
        class="menu-toggle-btn"
        icon="el-icon-s-fold" 
        size="small"
        circle>
      </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item 
          v-for="item in tags" 
          :key="item.path" 
          :to="{ path: item.path }" 
          :id="generateUniqueId(item)"
          :class="generateItemClass(item)">
          {{ item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="r-content">
      <div class="action-item">
        <el-tooltip content="全屏" placement="bottom">
            <i class="el-icon-full-screen action-icon"></i>
        </el-tooltip>
      </div>
      <div class="action-item">
          <el-badge :value="3" class="item">
            <i class="el-icon-bell action-icon" @click="handleNotice"></i>
          </el-badge>
      </div>
      <el-dropdown trigger="click" class="avatar-dropdown">
        <div class="avatar-wrapper">
          <img class="userIcon" :src="avatarSrc || require('../assets/avatar.jpg')" alt="用户">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="dialogAvatarVisible = true">
            <i class="el-icon-user"></i>
            修改头像
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="handleLogout">
            <i class="el-icon-switch-button"></i>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>


      <el-dialog title="修改头像" :visible.sync="dialogAvatarVisible" @close="handleDialogClose" :width="dialogWidth"
        class="my-dialog" append-to-body>
        <avatarShowVue :initialSrc="avatarSrc" />
      </el-dialog>
      <el-dialog title="通知中心" :visible.sync="dialogNoticeVisible" @close="handleDialogClose" width="800px"
        class="my-dialog" top="10vh" append-to-body>
        <noticeVue :userId="userId" />
      </el-dialog>
    </div>
  </div>
</template>

<script>

  import avatarShowVue from './avatarShow.vue';
  import { mapState } from 'vuex';
  import { logout } from '@/api';
  import { uploadAvatar } from '@/api';
  import noticeVue from './noticeList.vue';

  export default {
    components: {
      avatarShowVue,
      noticeVue,
    },
    data() {
      return {
        dialogAvatarVisible: false,
        imageUrl: '',
        initialImageSrc: '',
        avatarSrc: '',
        dialogWidth: '600px',
        dialogNoticeVisible: false,
        userId: '',
      }

    },
    watch: {
      '$route'(to, from) {
        // 在路由变化时触发，你可以在这里更新面包屑的样式
        // 比如根据当前路由信息 to 来设置面包屑样式
        this.updateBreadcrumbStyle(to)
      },
      showTooltip: function (newVal, oldVal) {
        // 在这里处理 showTooltip 值的变化
        console.log("newVal", newVal),
          console.log("old", oldVal)
      }
    },
    methods: {
      handleDialogClose() {
        console.log("userInfo.avatarSrc", this.$store.state.userInfo)
        this.avatarSrc = this.$store.state.userInfo.avatarSrc;
        console.log("this.avatarSrc", this.avatarSrc)
      },


      generateUniqueId(item) {
        // 生成一个基于路由项的唯一 ID，可以根据需要自定义生成逻辑
        return `breadcrumb-item-${item.path}`;
      },
      generateItemClass(item) {
        // 生成类名，例如 "special" 类名
        if (item.path === this.$route.path) {
          return 'current_bread';
        } else {
          if (this.$route.path === '/home' & item.path === '/') {
            return 'current_bread';
          }
          return '';
        }
      },
      handleMenu() {
        this.$store.commit('collapseMenu')
      },
      updateBreadcrumbStyle(to) {
        // 根据 to 对象来更新面包屑样式，这里可以根据具体需求修改样式
        // 例如，你可以设置一个数据属性，然后在模板中使用这个属性来控制面包屑样式
        if (to.path === '/home' || to.path === '/') {
          console.log(to, '/home')
          const current_bread = document.getElementById('breadcrumb-item-' + to.path)

        } else {
          console.log(to, '其他')
          const current_bread = document.getElementById('breadcrumb-item-' + to.path)

        }
        this.$store.commit('selectMenu', to)
      },
      handleLogout() {
        let userId = this.$store.state.userInfo.userId
        // 删除JWT令牌
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('TaskUser');
        if (userId > 0) {
          logout().then((data) => {
            console.log("退出登录", data)


            // this.$store.commit('removeUser');
            this.$router.push('/login');
            // window.location.reload();

          })
        } else {
          this.$router.push('/login');
          // window.location.reload();

        }



      },
      handleNotice() {
        this.dialogNoticeVisible = true
      }
    },
    // computed 是一个对象，用于定义计算属性
    computed: {
      // ...mapState 意味着将 mapState 返回的所有属性都添加到 computed 对象中。
      //创建一个名为 tags 的计算属性，它将获取 Vuex 的状态中 state.tab.tabsList 的数据。
      ...mapState({
        tags: state => state.tab.tabsList
      })
    },
    mounted() {
      // console.log(this.tags, 'tags')
      const TaskUser = localStorage.getItem('TaskUser')
      if (TaskUser) {
        this.userId = JSON.parse(TaskUser).userId;
      }
      const parsedUser = JSON.parse(TaskUser);
      // this.avatarSrc = parsedUser.avatarSrc;
    }

  }
</script>

<style lang="less" scoped>
  .header-container {
    background-color: #ffffff;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 1000;
    transition: all 0.3s ease;

    .l-content {
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;

      .menu-toggle-btn {
        margin-right: 20px;
        border: none;
        font-size: 20px;
        color: #606266;
        background: transparent;
        transition: all 0.3s;
        
        &:hover {
          color: #409EFF;
          transform: scale(1.1);
          background-color: rgba(64, 158, 255, 0.1);
        }
      }

      .custom-breadcrumb {
        font-size: 14px;
        line-height: 60px;
        margin-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        /deep/ .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: #909399;
            font-weight: 500;
            transition: color 0.3s;
            
            &.is-link:hover {
              color: #409EFF;
              font-weight: 600;
            }
          }

          &:last-child .el-breadcrumb__inner {
             color: #303133;
             font-weight: 700;
          }
        }
      }
    }

    .r-content {
      display: flex;
      align-items: center;
      height: 100%;
      flex-shrink: 0;

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        height: 100%;
        color: #606266;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 4px;

        &:hover {
          background: rgba(0, 0, 0, 0.04);
          color: #409EFF;
        }
        
        .action-icon {
          font-size: 20px;
        }

        .item {
          display: flex;
          align-items: center;
          
          /deep/ .el-badge__content {
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        }
      }

      .avatar-dropdown {
        margin-left: 20px;
        cursor: pointer;

        .avatar-wrapper {
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 24px;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.04);
          }
          
          .userIcon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;

            &:hover {
              transform: rotate(360deg);
            }
          }

          .el-icon-caret-bottom {
            margin-left: 8px;
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  /* 响应式适配 */
  @media screen and (max-width: 768px) {
    .header-container {
      padding: 0 12px;

      .l-content {
        .custom-breadcrumb {
          display: none; // 移动端隐藏面包屑
        }
      }

      .r-content {
        .action-item {
          padding: 0 8px;
          
          .action-icon {
            font-size: 18px;
          }
        }

        .avatar-dropdown {
          margin-left: 10px;
          
          .avatar-wrapper {
            .userIcon {
              width: 32px;
              height: 32px;
            }
          }
        }
      }
    }
  }

  /* 覆盖Element UI 样式 */
  /deep/.el-dialog__header {
    border-bottom: 1px solid #ebeef5;
    padding: 20px;
  }
  
  /deep/.el-dialog__body {
    padding: 30px 20px;
  }
  
  /deep/.el-dialog {
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }
</style>