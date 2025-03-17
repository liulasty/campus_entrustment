<template>
  <div id="LogionBody">
    <div class="demo-image__placeholder">
      <div class="block">
        <div class="image-container" @click="goShowye">
          <el-image :src="src" class="custom-image"></el-image>
          <div class="text-overlay">
            校园委托系统
          </div>
        </div>
      </div>
    </div>
    <div class="container" :class="{ 'panel-active': isPanelActive }">
      <!-- 登录 -->
      <LoginForm
          :loginInfo="loginInfo"
          @login="loginCheck"
          @togglePanel="togglePanel"
      />

      <!-- 注册 -->
      <RegisterForm
          :registerInfo="registerInfo"
          @register="registerCheck"
          @togglePanel="togglePanel"
      />

      <!-- 浮层 -->
      <div class="overlay-box">
        <div class="overlay">
          <div class="panel over-left">
            <button class="btn" @click="togglePanel(false)">已有账号？立即登陆</button>
          </div>
          <div class="panel over-right">
            <button class="btn" @click="togglePanel(true)">无账号？前往注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
import { login, register } from '@/api';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

export default {
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      isPanelActive: false,
      loginInfo: {
        username: '',
        password: ''
      },
      registerInfo: {
        username: '',
        password: '',
        email: '',
        phoneNumber: ''
      },
      rules: {
        username: {
          label: '用户名',
          pattern: /^[a-zA-Z0-9_]{4,16}$/u,
        },
        password: {
          label: '密码',
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/u,
        },
        email: {
          label: '邮箱',
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
        },
        phoneNumber: {
          label: '电话号码',
          pattern: /^\d{11}$/u,
        },
      },
      src: 'shouyesuolv.jpg',
    };
  },
  methods: {
    togglePanel(isActive) {
      this.isPanelActive = isActive;
    },
    async loginCheck() {
      const msg = this.validate(this.loginInfo, this.rules);
      if (!msg.validate) {
        this.$message({
          showClose: true,
          message: msg.errorMsg,
          type: 'error'
        });
        return;
      }

      try {
        const { data } = await login(this.loginInfo);
        if (data.code === 1) {
          localStorage.setItem('jwtToken', data.data.token);
          localStorage.setItem('TaskUser', JSON.stringify(data.data));
          this.$store.commit('loginUser', data.data);
          this.$router.push('/main');
          this.$message({
            showClose: true,
            message: '恭喜你，登录成功',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: data.msg,
            type: 'error'
          });
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: '服务器错误, 检查网络连接',
          type: 'error'
        });
      }
    },
    async registerCheck() {
      const msg = this.validate(this.registerInfo, this.rules);
      if (!msg.validate) {
        this.$message({
          showClose: true,
          message: msg.errorMsg,
          type: 'error'
        });
        return;
      }

      try {
        const { data } = await register(this.registerInfo);
        this.$message({
          showClose: true,
          message: data.msg,
          type: data.code === 1 ? 'success' : 'error'
        });
      } catch (error) {
        this.$message({
          showClose: true,
          message: '服务器错误, 检查网络连接',
          type: 'error'
        });
      }
    },
    validateInput(value, key, rule) {
      if (!value.trim()) {
        return {
          validate: false,
          errorMsg: rule.label + "不能为空"
        };
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return {
          validate: false,
          errorMsg: rule.label + "格式不正确"
        };
      }

      return {
        validate: true,
        errorMsg: "校验通过"
      };
    },
    validate(formData, rules) {
      for (const key in formData) {
        const msg = this.validateInput(formData[key], key, rules[key]);
        if (!msg.validate) {
          return msg;
        }
      }
      return {
        validate: true,
        errorMsg: "校验通过"
      };
    },
    goShowye() {
      this.$router.push('/');
    }
  }
};
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    .demo-image__placeholder {
        padding-top: 2%;
        padding-left: 2%;
    }

    .custom-image {
        width: 180px;

    }

    .image-container {
        position: relative;
    }

    .text-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        color: white;
    }

    /* 将样式单独放在一个 CSS 文件中 */
    #LogionBody {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-image: url('../assets/huaduo.png');
      background-size: cover;
    }

    .container {
      width: 100%;
      max-width: 758px;
      height: 420px;
      position: relative;
      margin: auto;
    }


    .formBox {
        height: 100%;
        position: absolute;
        top: 0;
        transition: all 0.6s ease-in-out;
    }

    .login {
        left: 0;
        width: 50%;
        z-index: 2;
    }

    .register {
        left: 0;
        opacity: 0;
        width: 50%;
        z-index: 1;
    }

    .form {
        background-color: #e9e9e9;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 3rem;
        height: 100%;
        text-align: center;
    }

    .input {
        background-color: #fff;
        border: none;
        padding: 0.9rem 0.9rem;
        margin: 0.5rem 0;
        width: 100%;
    }

    .title {
        font-weight: 300;
        margin: 0;
        margin-bottom: 1.25rem;
    }

    .link {
        color: #333;
        font-size: 16px;
        margin: 1.5rem 0;
        text-decoration: none;
    }


    .btn {
        background-color: #095c91;
        background-image: linear-gradient(90deg, #095c91 0%, #0393a3 74%);
        border-radius: 5px;
        border: none;
        color: #e9e9e9;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: bold;
        letter-spacing: 0.1rem;
        padding: 0.9rem 4rem;
        text-transform: uppercase;
        transition: transform 80ms ease-in;
    }

    .form>.btn {
        margin-top: 1.5rem;
    }

    .btn:active {
        transform: scale(0.95);
    }



    .overlay-box {
        height: 100%;
        left: 50%;
        overflow: hidden;
        position: absolute;
        top: 0;
        transition: transform 0.6s ease-in-out;
        width: 50%;
        z-index: 100;
    }

    .overlay {
        background-color: rgba(255, 255, 255, 0.25);
        height: 100%;
        left: -100%;
        position: relative;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
        width: 200%;
    }

    .panel {
        width: 50%;
        height: 100%;
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        text-align: center;
        top: 0;
        transform: translateX(0);
        transition: transform 0.6s ease-in-out;
    }

    .over-left {
        transform: translateX(-20%);
    }

    .over-right {
        right: 0;
        transform: translateX(0);
    }



    .panel-active .login {
        transform: translateX(100%);
    }

    .panel-active .register {
        opacity: 1;
        transform: translateX(100%);
        z-index: 3;
    }

    .panel-active .overlay-box {
        transform: translateX(-100%);
    }

    .panel-active .overlay {
        transform: translateX(50%);
    }

    .panel-active .over-left {
        transform: translateX(0);
    }

    .panel-active .over-right {
        transform: translateX(20%);
    }
</style>