<template>
    <!-- Contenu de la page d'accueil -->
    <MainMenu :user="user" />
</template>

<script >
import MainMenu from '../components/MainMenu.vue';

export default {
  name: 'Home',
  components: {
    MainMenu
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  // Logique du composant Home
}
</script>

<style scoped>
/* Styles spécifiques à Home.vue */
  h1 {
    margin-left: 1rem;
    font-size: 3em;
    padding: 0;
  }

  /* Pour les écrans plus petits que 1024px */
@media (max-width: 1023px) {
  h1 {
    font-size: 40px;
  }
}

/* Pour les écrans plus petits que 768px */
@media (max-width: 767px) {
  h1 {
    font-size: 30px;
  }
}

/* Pour les écrans plus petits que 480px */
@media (max-width: 479px) {
  h1 {
    font-size: 20px;
  }
}
</style>
