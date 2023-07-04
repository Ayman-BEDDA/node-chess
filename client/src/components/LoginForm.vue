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
  <form class="form" @submit.prevent="handleSubmit">
    <h1>Connexion</h1>
    <label for="email" class="label">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" class="input" />
    <p v-if="errors.email" class="error">{{ errors.email.join('\n') }}</p>
    <label for="password" class="label">Password</label>
    <input v-model="formData.password" type="password" id="password" class="input" />
    <p v-if="errors.password" class="error">{{ errors.password.join('\n') }}</p>
    <button type="submit" class="button">Submit</button>
  </form>
  <pre>{{ formData }}</pre>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;
}

.label {
  font-size: 16px;
  margin-bottom: 5px;
}

.input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
  font-size: 16px;
}

.error {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

.button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

pre {
  margin-top: 20px;
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
