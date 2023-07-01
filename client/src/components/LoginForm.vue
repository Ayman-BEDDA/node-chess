<script setup>
import { reactive, ref } from 'vue';
const { onSubmit } = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
});
const defaultValue = {
  email: '',
  password: ''
};
const formData = reactive({ ...defaultValue });
const errors = ref({});

function handleSubmit() {
  onSubmit(formData)
    .then(() => {
      Object.assign(formData, defaultValue);
      errors.value = {};
    })
    .catch((_errors) => (errors.value = _errors));
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label for="email">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" />
    <p v-if="errors.email">{{ errors.email.join('\n') }}</p>
    <label for="password">Password</label>
    <input v-model="formData.password" type="password" id="password" />
    <p v-if="errors.password">{{ errors.password.join('\n') }}</p>
    <button type="submit">Submit</button>
  </form>
  {{ formData }}
</template>
