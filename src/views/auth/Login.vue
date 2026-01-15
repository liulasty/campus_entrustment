<template>
  <div id="LogionBody">
    <div class="background-overlay"></div>
    <div class="content-container">
      <div class="brand-section" @click="goShowye">
        <div class="brand-logo">
          <i class="el-icon-school"></i>
        </div>
        <h1 class="brand-title">校园委托系统</h1>
        <p class="brand-slogan">连接 · 互助 · 共赢</p>
      </div>
      
      <div class="auth-card-wrapper">
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
                <h3>已有账号？</h3>
                <p>请登录以继续使用服务</p>
                <button class="btn ghost" @click="togglePanel(false)">立即登录</button>
              </div>
              <div class="panel over-right">
                <h3>没有账号？</h3>
                <p>立即注册加入我们</p>
                <button class="btn ghost" @click="togglePanel(true)">注册账号</button>
              </div>
            </div>
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
          
          // 使用 replace 而不是 push，防止用户点击后退按钮返回登录页
          this.$router.replace('/home');
          
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
    /* Reset & Base */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #LogionBody {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-image: url('../../assets/huaduo.png');
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(9, 92, 145, 0.8) 0%, rgba(3, 147, 163, 0.8) 100%);
      backdrop-filter: blur(5px);
      z-index: 1;
    }

    .content-container {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .brand-section {
      text-align: center;
      color: white;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .brand-section:hover {
      transform: scale(1.05);
    }

    .brand-logo {
      font-size: 48px;
      margin-bottom: 10px;
    }

    .brand-title {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .brand-slogan {
      font-size: 16px;
      opacity: 0.9;
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .auth-card-wrapper {
      background: white;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      overflow: hidden;
      width: 768px;
      max-width: 100%;
      min-height: 480px;
    }

    .container {
      width: 100%;
      height: 480px;
      position: relative;
      background: #fff;
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
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 3rem;
        height: 100%;
        text-align: center;
    }

    .input {
        background-color: #f3f4f6;
        border: none;
        padding: 12px 15px;
        margin: 8px 0;
        width: 100%;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .input:focus {
        outline: none;
        background-color: #fff;
        box-shadow: 0 0 0 2px rgba(3, 147, 163, 0.2);
    }

    .title {
        font-weight: 700;
        margin-bottom: 20px;
        color: #333;
        font-size: 24px;
    }

    .link {
        color: #666;
        font-size: 14px;
        margin: 15px 0;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .link:hover {
        color: #0393a3;
    }

    .btn {
        background: linear-gradient(90deg, #095c91 0%, #0393a3 100%);
        border-radius: 25px;
        border: none;
        color: #ffffff;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        padding: 12px 45px;
        text-transform: uppercase;
        transition: transform 80ms ease-in, box-shadow 0.3s ease;
        margin-top: 20px;
        box-shadow: 0 4px 15px rgba(3, 147, 163, 0.3);
    }

    .btn:active {
        transform: scale(0.95);
    }

    .btn:hover {
        box-shadow: 0 6px 20px rgba(3, 147, 163, 0.4);
    }

    .btn.ghost {
        background: transparent;
        border: 2px solid #ffffff;
        box-shadow: none;
    }

    .btn.ghost:hover {
        background: rgba(255, 255, 255, 0.1);
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
        background: linear-gradient(135deg, #095c91 0%, #0393a3 100%);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 0 0;
        color: #ffffff;
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
        padding: 0 40px;
    }

    .panel h3 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .panel p {
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0.5px;
        margin-bottom: 30px;
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
        z-index: 5;
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

    /* Responsive Design */
    @media (max-width: 768px) {
        .auth-card-wrapper {
            width: 90%;
            min-height: 600px;
        }

        .container {
            height: 600px;
        }

        .formBox {
            width: 100%;
            height: 60%;
            top: 40%;
        }

        .overlay-box {
            width: 100%;
            height: 40%;
            top: 0;
            left: 0;
        }

        .overlay {
            width: 100%;
            height: 250%; /* Adjust for vertical movement */
            left: 0;
            top: -100%;
        }
        
        /* Disable complex animation for mobile simpler view */
        /* ... Mobile specific styles would go here for full responsiveness */
    }
</style>