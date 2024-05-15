<template>
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{loadingText}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Loading',
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    mounted() {
      this.loadingText = this.text
    },


    data() {
      return {
        loadingText: ''
      }
    },
  }
</script>

<style>
  .loading-spinner {
    /* 添加你喜欢的加载动画样式 */
    background-color: greenyellow;
  }

  .loading-text {
    color: rgb(251, 202, 202);
    margin-top: 10px;
  }
</style>