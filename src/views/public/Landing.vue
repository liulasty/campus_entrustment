<template>
    <div id="homeBody">
        <div class="model">
            <div class="content-wrapper">
                <h1 class="main-title">校园委托服务平台</h1>
                <p class="subtitle">Campus Entrustment Service Platform</p>
                <p class="description">连接校园生活，让互助更简单。发布委托，承接任务，一站式校园服务解决方案。</p>
                <div class="action-buttons">
                    <button class="btn btn-primary" @click="ToLogin">
                        立即体验
                    </button>
                    <button class="btn btn-outline" @click="learnMore">
                        了解更多
                    </button>
                </div>
            </div>
            
            <div class="features">
                <div class="feature-item">
                    <i class="el-icon-document-add"></i>
                    <h3>便捷发布</h3>
                    <p>快速发布各类校园委托任务</p>
                </div>
                <div class="feature-item">
                    <i class="el-icon-check"></i>
                    <h3>安全接单</h3>
                    <p>实名认证，保障双方权益</p>
                </div>
                <div class="feature-item">
                    <i class="el-icon-chat-line-round"></i>
                    <h3>实时沟通</h3>
                    <p>即时消息，沟通无障碍</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
        ToLogin() {
            this.$router.push('/login')
        },
        learnMore() {
            // 可以添加滚动到介绍区域或者跳转到关于页面的逻辑
            this.$message.info('更多功能敬请期待');
        }
    }
}
</script>

<style scoped>
#homeBody {
    height: 100vh;
    width: 100%;
    background: url('../../assets/huaduo.png') no-repeat center center/cover;
    position: relative;
    overflow: hidden;
}

#homeBody::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 30, 48, 0.8) 100%);
    z-index: 1;
}

.model {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 0 20px;
}

.content-wrapper {
    text-align: center;
    max-width: 800px;
    margin-bottom: 60px;
    animation: fadeInUp 1s ease-out;
}

.main-title {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 10px;
    background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
    text-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.subtitle {
    font-size: 1.5rem;
    font-weight: 300;
    color: #aab8c2;
    margin-bottom: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.description {
    font-size: 1.1rem;
    color: #e0e6ed;
    margin-bottom: 40px;
    line-height: 1.6;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.btn {
    padding: 12px 36px;
    font-size: 1.1rem;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    font-weight: 500;
}

.btn-primary {
    background: linear-gradient(90deg, #095c91 0%, #0393a3 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(3, 147, 163, 0.4);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(3, 147, 163, 0.6);
}

.btn-outline {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: white;
}

.btn-outline:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
}

.features {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 40px;
    animation: fadeInUp 1s ease-out 0.3s backwards;
}

.feature-item {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    width: 200px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
}

.feature-item i {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #6dd5fa;
}

.feature-item h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #fff;
}

.feature-item p {
    font-size: 0.9rem;
    color: #ccc;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式调整 */
@media (max-width: 768px) {
    .main-title {
        font-size: 2.5rem;
    }
    
    .features {
        flex-direction: column;
        gap: 20px;
    }
    
    .feature-item {
        width: 100%;
        max-width: 300px;
    }
}
</style>
