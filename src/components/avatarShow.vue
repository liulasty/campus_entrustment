<template>
  <div class="avatarShow">
    <img :src="imageSrc" class="avatarSrc" alt="展示的图片" />
    <label for="uploadBtn" class="customBtn" style="margin: 20px;">
      <el-button id="uploadBtn1" type="primary" @click="handleUpload">上传图片</el-button>
    </label>
    <div class="imageUploadItem">
      <p>请选择图片文件：只允许上传图片文件，支持格式包括 JPG、PNG、GIF 等常见图片格式。</p>
      <p>图片大小限制：上传的图片文件大小不得超过 5MB。</p>
      <p>图片清晰度：请确保上传的图片清晰，避免模糊或失真的情况。</p>
      <p>建议尺寸：建议使用正方形或接近正方形的图片，以获得最佳效果。</p>
    </div>
    <input type="file" id="uploadBtn" @change="uploadImage" accept="image/*" style="display: none;">

  </div>
</template>

<script>


import { uploadAvatar } from '@/api'
export default {
  name: 'avatarShow',
  props: {
    initialSrc: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageSrc: this.initialSrc, // 初始展示的图片,
      isUpload: 1,
      imgInfo: {
        size: 0,
        type: '',
        width: 0,
        height: 0,
        proportion: 1,
      },
    };
  },
  methods: {
    validateFileSize(file) {
      const maxSizeInMB = 5;
      const fileSizeInMB = file.size / (1024 * 1024);
      this.imgInfo.size = fileSizeInMB;
      if (fileSizeInMB > maxSizeInMB) {
        this.$message.error('图片大小不能超过5MB');
        this.isUpload = 0;
        return false;
      }

      return true;
    },

    validateFileType(file) {
      const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
      // 使用正则表达式的测试方法来检查文件扩展名
      if (!allowedExtensions.test(file.name)) {
        this.$message.error('只允许上传JPG、PNG、GIF格式的图片');
        this.isUpload = 0;
        return false;
      } else {
        this.imgInfo.type = true;
      }

      return true;
    },

    async validateImageDimensions(file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const width = img.width;
        const height = img.height;
        this.imgInfo.width = width;
        this.imgInfo.height = height;
        this.imgInfo.proportion = width / height;
        if (width / height > 1.5 || width / height < 0.66) {
          this.$message.error('建议使用正方形或接近正方形的图片' + this.imgInfo.proportion);
          this.isUpload = 0;
          return false;
        }

        return true;
      } catch (error) {
        console.error('图片加载失败:', error);
        this.$message.error('图片加载失败，请检查网络或图片格式');
        this.isUpload = 0;
        return false;
      }
    },
    async uploadImage(event) {
      const file = event.target.files[0];

      // 判断图片是否符合要求
      if (!file) {
        console.log("图片是否符合要求", this.isUpload);
        return;
      }
      // 图片限制验证
      try {
        if (!(await this.validateFileSize(file))) throw new Error('文件大小不符合要求');
        if (!(await this.validateFileType(file))) throw new Error('文件类型不符合要求');
        if (!(await this.validateImageDimensions(file))) throw new Error('图片尺寸不符合要求');
      } catch (error) {
        console.log(error.message);
        return;
      }

      console.log(this.imgInfo);
      if (this.isUpload == 1) {
        uploadAvatar(file).then((result) => {
          if (result.data.code != 0) {
            this.$notify({
              title: '修改结果',
              message: result.data.msg,
              type: 'success'
            });
            this.imageSrc = "https://" + result.data.data;
            // 在组件中调用 mutations 中的方法
            this.$store.commit('updatedAvatarSrc', this.imageSrc);
            console.log("上传头像后", this.$store.state.userInfo);
          } else {
            this.$notify.error({
              title: '修改失败',
              message: result.data.msg
            });
          }
        })
      }

    },
    handleUpload() {
      const uploadBtn = document.getElementById('uploadBtn');
      uploadBtn.click();
    },

  },


};

</script>

<style lang="less" scoped>
* {
  position: relative;

}

.avatarShow {
  height: 400px;
}

.avatarSrc {
  height: 400px;
  width: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.customBtn {
  margin-top: 20px;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  float: right;
  top: 300px;
}

.customBtn:hover {
  background-color: rgba(0, 128, 255, 0.1);
}

.imageUploadItem {
  position: relative;
  top: -420px;
  width: 318px;
  right: -414px;
  background-color: #333;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  opacity: 0.9;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);

  & p {
    margin-bottom: 0.5rem;
    line-height: 1.5;
    font-size: 0.9rem;
    color: #aaa;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}
</style>