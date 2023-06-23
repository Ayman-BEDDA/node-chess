<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="button">
    <button>{{ title }}</button>
  </div>
</template>

<style scoped>
button {
  background-color: #41b883;
  border: none;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #35495e;
}
</style>