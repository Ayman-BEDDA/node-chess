<template>
    <div class="funny-404">
      <h1 class="title">404</h1>
      <p class="description">Oups ! Vous êtes arrivé dans le vide humoristique des pages manquantes.</p>
      <img src="../assets/jordan.png" alt="Image 404" class="funny-image">
      <router-link to="/" class="home-link">Retourner à la page d'accueil</router-link>
    </div>
</template>

  
  <style scoped>
  .funny-404 {
    width: 100%;
    text-align: center;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .title {
    font-size: 5rem;
    color: #f00; /* Couleur rouge pour l'amusement */
  }
  
  .description {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .funny-image {
    width: 250px;
    height: 250px;
    height: auto;
    margin-bottom: 20px;
  }
  
  .home-link {
    display: inline-block;
    background-color: #00f; /* Couleur bleue pour l'amusement */
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
  }
  
  .home-link:hover {
    background-color: #0070f3; /* Couleur bleu clair pour l'amusement */
  }
  </style>
  