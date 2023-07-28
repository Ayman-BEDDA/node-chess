<script setup>
import { reactive, ref } from 'vue';

const { onSubmit } = defineProps({
  onSubmit: {
    type: Function,
    required: true
  }
});

const defaultValue = {

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
    <!-- Ajoutez les champs de formulaire pour la déconnexion ici -->
    <button type="submit">Logout</button>
  </form>
</template>