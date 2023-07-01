<script setup>
const { title, variant } = defineProps({
  title: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => {
      return ['default', 'round', 'square'].includes(value);
    }
  },
  onClick: {
    type: Function,
    default: () => {}
  }
});

const style = {};
let realTitle = title;
switch (variant) {
  case 'square':
    style.borderRadius = '0';
    break;
  case 'round':
    style.borderRadius = '50%';
    style.textTransform = 'uppercase';
    realTitle = title[0];
    break;
}

function handleClick() {
  alert('You clicked me!');
}

// Vue2
// export default {
//   props: {
//     title: {
//       type: String,
//       required: true
//     },
//     variant: {
//       type: String,
//       default: 'default',
//       validator: (value) => {
//         return ['default', 'round', 'square'].includes(value);
//       }
//     }
//   },
//   computed() {
//      realTitle() {
//        return this.variant === "round" ? this.title[0] : this.title;
//      },
//   },
//   methods: {
//     handleClick() {
//       alert('You clicked me!');
//     }
//   },
//};
</script>

<template>
  <button v-bind:style="style" class="btn" v-on:click="onClick">{{ realTitle }}</button>
</template>

<style scoped>
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
</style>
