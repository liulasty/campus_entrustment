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
        <div class="container panel-active">
            <!-- 注册 -->
            <div class="formBox  login">
                <form action="#" class="form" id="form1">
                    <h2 class="title">登 陆</h2>
                    <input type="text" placeholder="用户名" class="input" v-model="loginInfo.username" />
                    <input type="password" placeholder="密码" class="input" v-model="loginInfo.password" />
                    <a href="#" class="link">忘记密码？</a>
                    <button class="btn" @click.prevent="loginCheck">登陆</button>
                </form>
            </div>

            <!-- 登录 -->
            <div class="formBox register">
                <form action="#" class="form" id="form2">
                    <h2 class="title">注 册</h2>
                    <input type="text" placeholder="用户名(4到8个字母、数字或下划线)" class="input" v-model="registerInfo.username" />
                    <input type="password" placeholder="密码" class="input" v-model="registerInfo.password" />
                    <input type="email" placeholder="邮箱" class="input" v-model="registerInfo.email" />
                    <!-- <input type="text" placeholder="电话号码" class="input" v-model="registerInfo.phoneNumber" /> -->
                    <button class="btn" @click.prevent="registerCheck">注册</button>
                </form>

            </div>

            <!-- 浮层 -->
            <div class="overlay-box">
                <div class="overlay">
                    <div class="panel over-left">
                        <button class="btn" id="signIn">无账号？前往注册</button>
                    </div>
                    <div class="panel over-right">
                        <button class="btn" id="signUp">已有账号？立即登陆</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>




<script>
import { login } from '@/api';
import { register } from '@/api'


export default {
    data() {
        return {
            images: [], // 存储已上传的图片
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
                    pattern: /^[a-zA-Z0-9_]{4,16}$/u, // 示例规则：4到16个字母、数字或下划线
                },
                password: {
                    label: '密码',
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/u, // 示例规则：至少8位，包含字母和数字
                },
                email: {
                    label: '邮箱',
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
                },
                phoneNumber: {
                    label: '电话号码',
                    pattern: /^\d{11}$/u, // 示例规则：11位数字
                },
            },
            isValid: true,
            errorMsg: '填写信息不规范',
            src: 'shouyesuolv.jpg',
        };
    },
    mounted() {
        this.beforeLogin();
    },
    methods: {
        //添加监听器
        beforeLogin() {
            const signInBtn = document.getElementById("signIn");
            const signUpBtn = document.getElementById("signUp");
            const container = document.querySelector(".container");

            signInBtn.addEventListener("click", () => {
                container.classList.remove("panel-active");
            });

            signUpBtn.addEventListener("click", () => {
                container.classList.add("panel-active");
            });
        },
        //登录
        loginCheck() {
            console.log("登录")
            // this.loginInfo = {
            //     username: 'majiaqi',
            //     password: '2312034544lz'
            // }
            const msg = this.validate(this.loginInfo, this.rules)
            if (msg.validate === false) {
                this.$message({
                    showClose: true,
                    message: msg.errorMsg,
                    type: 'error'
                });
                return;
            } else {
                login(this.loginInfo).then((data) => {
                    console.log("登录后的参数", data.data);
                    if (data.data.code === 1) {
                        // 存储JWT令牌
                        localStorage.setItem('jwtToken', data.data.data.token);
                        localStorage.setItem('TaskUser', JSON.stringify(data.data.data));

                        this.$store.commit('loginUser', data.data.data);

                        this.$router.push('/main')

                        this.$message({
                            showClose: true,
                            message: '恭喜你，登录成功成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error'
                        });
                    }
                }).catch(err => {
                    this.$message({
                        showClose: true,
                        message: '服务器错误,检查网络连接',
                        type: 'error'
                    });
                });

            }
        },


        // 校验函数
        validateInput(value, key, rule) {
            // console.log(value, key);
            // console.log(rule)

            const rule_label = rule.label;
            const rule_pattern = rule.pattern;
            const rule_min = rule.minLength;
            const rule_max = rule.maxLength;

            //判断输入是否为空
            if (!value.trim()) {
                errorMsg = rule_label + "不能为空";
                console.log(errorMsg);

                return {
                    validate: false,
                    errorMsg: errorMsg
                };
            }

            if (rule_pattern && !rule_pattern.test(value)) {
                errorMsg = label + "格式不正确";
                console.log(errorMsg);

                return {
                    validate: false,
                    errorMsg: errorMsg
                };
            }

            if (rule_min !== null && value.length < rule_min) {
                errorMsg = label + "长度不能小于" + minLength;
                console.log(errorMsg);

                return {
                    validate: false,
                    errorMsg: errorMsg
                };
            }

            if (rule_max !== null && value.length > rule_max) {
                errorMsg = label + "长度不能大于" + maxLength;
                console.log(errorMsg);

                return {
                    validate: false,
                    errorMsg: errorMsg
                };;
            }

            return {
                validate: true,
                errorMsg: null
            };

        },
        // 执行校验
        validate(registerInfo, rules) {
            console.log("校验内容", registerInfo);
            let msg = null;
            for (const key in registerInfo) {
                const value = registerInfo[key];
                // 在这里执行针对每个键值对的操作
                msg = this.validateInput(value, key, rules[key])
                if (!msg.validate) {
                    this.isValid = msg.validate;
                    this.errorMsg = msg.errorMsg;
                    break;
                }


            }
            console.log("校验结果：", msg);
            return {
                validate: this.isValid,
                errorMsg: this.errorMsg
            };

        },
        // 验证注册表单，验证成功返回true，否则返回false
        registerCheck() {

            // console.log("注册", this.registerInfo);
            this.registerInfo = {
                username: "majiaqi",
                password: "2312034544lz",
                email: "2312034544@qq.com",
                phoneNumber: "15619763223",
            }

            const msg = this.validate(this.registerInfo, this.rules)


            if (msg.validate === true) {
                console.log("所有校验通过，执行注册操作或其他逻辑");
                // 实际应用中，此处可能调用 API 进行注册操作
                register(this.registerInfo).then((data) => {
                    console.log("注册后的参数", data.data);
                    if (data.data.code === 1) {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'success'
                        })

                    } else {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error'
                        });

                    }
                });
            } else {
                console.log('有输入不符合要求，提示用户', msg);
                // 实际应用中，此处可能弹出提示框等提示用户
                this.$message({
                    showClose: true,
                    message: msg.errorMsg,
                    type: 'error'
                });
            }




        },



        goShowye() {
            this.$router.push('/')
        }
    }
}

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
