<script setup>
import { defineProps, reactive, ref, computed } from 'vue';

const props = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
});

const defaultValue = {
    password: '',
    passwordConfirm: ''
};

const formData = reactive({ ...defaultValue });
const errors = ref({});

const passwordsMatch = computed(() => {
  return formData.password === formData.passwordConfirm;
});

function handleSubmit() {
    if (passwordsMatch.value) {
        props.onSubmit(formData).then(() => {
            formData.password = '';
            errors.value = {};
        }).catch((errors) => {
            errors.value = errors;
        });
    } else {
        errors.value.passwordConfirm = ['Les mots de passe ne correspondent pas'];
    }
}

</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h1>Réinitialisation</h1>
    <label for="password" class="label">Nouveau mot de passe</label>
    <input v-model="formData.password" type="password" id="password" class="input"/>
    <p v-if="errors.password" class="error">{{ errors.password.join('\n') }}</p>
    <label for="passwordConfirm" class="label">Confirmer le mot de passe</label>
    <input v-model="formData.passwordConfirm" type="password" id="passwordConfirm" class="input"/>
    <p v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm.join('\n') }}</p>
    <button type="submit" class="button">Confirmer</button>
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