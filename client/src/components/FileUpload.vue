<template>
    <div>
      <div class="container mt-10">
        <div class="card bg-white">
          <img style="" :src="image" alt="">
          <input @change="handleImage" class="custom-input" type="file" accept="image/*">
        </div>
      </div>
      <div class="mt-10" style="text-align: center">
        <h3>SERVER IMAGE</h3>
        <img :src="remoteUrl" alt="">
      </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "FileUpload",
    data() {
        return {
            image: '',
            remoteUrl: ''
        }
    },
  methods: {
    handleImage(e) {
      const selectedImage = e.target.files[0]; // get first file
      this.createBase64Image(selectedImage);
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();

        reader.onload = (e) => {
            this.image = e.target.result;
            this.uploadImage();
        };
      reader.readAsDataURL(fileObject);
    },
    uploadImage() {
        const { image } = this;
        axios.post('http://149.202.52.182:3000/upload', { image })
            .then((response) => {
            this.remoteUrl = response.data.url;
            })
            .catch((err) => {
            return new Error(err.message);
        })
    }
  },

};
</script>

<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
body {
  background: #d8dddb;
}
.container  {
  display: flex;
  justify-content: center;
}
.mt-10 {
  margin-top: 10rem;
}
.bg-white {
  background: #fff;
}
.card {
  height: 10rem;
  width: 20rem;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}
img {
  width: 17rem;
}
</style>