<template>
  <div class="formBox login">
    <form action="#" class="form" @submit.prevent="$emit('login')">
      <h2 class="title">登 陆</h2>
      <input type="text" placeholder="用户名" class="input" v-model="loginInfo.username" />
      <input type="password" placeholder="密码" class="input" v-model="loginInfo.password" />
      <a href="#" class="link">忘记密码？</a>
      <button class="btn">登陆</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    loginInfo: {
      type: Object,
      required: true
    }
  }
};
</script>