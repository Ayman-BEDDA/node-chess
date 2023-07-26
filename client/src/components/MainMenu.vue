<script setup>

import { inject } from 'vue';
import router from '../router';

const user = inject('user');

function navigateTo(route) {
    router.push(`/${route}`);
}

</script>

<template>
  <div class="main-menu">
    <div class="button v12" @click="navigateTo('play')">
      <span class="label">Play</span>
      <span class="icon">
          <span></span>
      </span>
    </div>
    <div class="button v12" @click="navigateTo('stats')">
      <span class="label">Stats</span>
      <span class="icon">
          <span></span>
      </span>
    </div>
    <div class="button v12" @click="navigateTo('shop')">
      <span class="label">Shop</span>
      <span class="icon">
          <span></span>
      </span>
    </div>
    <div v-if="user?.id_role === 1" class="button v12" @click="navigateTo('admin/home')">
      <span class="label">Admin</span>
      <span class="icon">
          <span></span>
      </span>
    </div>
  </div>
</template>

  
<style scoped>
.main-menu {
    width: 100%;
    height: 80%;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    }

  .main-menu .button {
  margin: 20px;
  float: left;
  position: relative;
  font-family: arial;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  font-size: 35px;
}

/* Pour les écrans plus petits que 1024px */
@media (max-width: 1023px) {
  .main-menu .button {
    font-size: 40px;
  }
}

/* Pour les écrans plus petits que 768px */
@media (max-width: 767px) {
  .main-menu .button {
    font-size: 30px;
  }
}

/* Pour les écrans plus petits que 480px */
@media (max-width: 479px) {
  .main-menu .button {
    font-size: 20px;
  }
}
.main-menu .button .label {
  padding: 10px;
  display: inline-block;
  text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
}
  
.main-menu .button.v12:hover .icon {
  transform: scale(0.9) skew(0deg, 0deg);
}
.main-menu .button.v12:hover .icon:before {
  width: 0;
}
.main-menu .button.v12:hover .icon:after {
  width: 100%;
}
.main-menu .button.v12:hover .icon span:before, .main-menu .button.v12:hover .icon span:after {
  height: 0;
}
.main-menu .button.v12 .label {
  padding: 10px 22px;
}
.main-menu .button.v12 .icon {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skew(-40deg, 0deg);
  transition: all 0.2s;
}
.main-menu .button.v12 .icon:before, .main-menu .button.v12 .icon:after {
  content: "";
  height: 1px;
  width: 30px;
  position: absolute;
  display: block;
  background: #f0202f;
  transition: width 0.2s;
  transition-delay: 0.2s;
}
.main-menu .button.v12 .icon:before {
  left: 0;
  top: 0;
}
.main-menu .button.v12 .icon:after {
  right: 0;
  bottom: 0;
}
.main-menu .button.v12 .icon span:before, .main-menu .button.v12 .icon span:after {
  content: "";
  background: #f0202f;
  position: absolute;
  display: block;
  width: 2px;
  height: 30px;
  transition: height 0.2s;
  transition-delay: 0.2s;
}
.main-menu .button.v12 .icon span:before {
  left: 0;
  top: 0;
}
.main-menu .button.v12 .icon span:after {
  right: 0;
  bottom: 0;
}
.main-menu .button.v12:hover .icon {
  transform: scale(0.9) skew(0deg, 0deg);
}
.main-menu .button.v12:hover .icon:before {
  width: 0;
}
.main-menu .button.v12:hover .icon:after {
  width: 50%;
  right: 25%;
}
.main-menu .button.v12:hover .icon span:before, .main-menu .button.v12:hover .icon span:after {
  height: 0;
}
.main-menu .button.v12 .label {
  padding: 10px 50px;
}
.main-menu .button.v12 .icon {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: skew(-40deg, 0deg);
  transition: all 0.2s;
}
.main-menu .button.v12 .icon:before, .main-menu .button.v12 .icon:after {
  content: "";
  height: 1px;
  width: 30px;
  position: absolute;
  display: block;
  background: #f0202f;
  transition: all 0.2s;
  transition-delay: 0.2s;
}
.main-menu .button.v12 .icon:before {
  left: 0;
  top: 0;
}
.main-menu .button.v12 .icon:after {
  right: 0;
  bottom: 0;
}
.main-menu .button.v12 .icon span:before, .main-menu .button.v12 .icon span:after {
  content: "";
  background: #f0202f;
  position: absolute;
  display: block;
  width: 2px;
  height: 30px;
  transition: all 0.2s;
  transition-delay: 0.2s;
}
.main-menu .button.v12 .icon span:before {
  left: 0;
  top: 0;
}
.main-menu .button.v12 .icon span:after {
  right: 0;
  bottom: 0;
}
</style>
  