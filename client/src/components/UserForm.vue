<script setup>
import { reactive, ref } from 'vue';
const { onSubmit } = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
});
const defaultValue = {
  login: '',
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
    <h1>Inscription</h1>
    <label for="login" class="label">Login</label>
    <input v-model.trim="formData.login" type="text" id="login" class="input" required />
    <p v-if="errors.login" class="error">{{ errors.login.join('\n') }}</p>
    <label for="email" class="label">Email</label>
    <input v-model.trim="formData.email" type="email" id="email" class="input" required />
    <p v-if="errors.email" class="error">{{ errors.email.join('\n') }}</p>
    <label for="password" class="label">Mot de passe</label>
    <input v-model.trim="formData.password" type="password" id="password" class="input" required />
    <p v-if="errors.password" class="error">{{ errors.password.join('\n') }}</p>
    <button type="submit" class="button">S'inscrire</button>
    <router-link to="/login" class="link">Déjà inscrit ?</router-link>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 35px;
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

.link {
  color: #fff;
  font-size: 14px;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

.button {
  padding: 10px 20px;
  color: #fff;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background: none;
  text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-top: 20px; 
}

button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

pre {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>

