<template>
    <div class="article-list">
        <button @click="showCreateModal = true" class="create-button">Créer un article</button>
        <input type="text" v-model="searchQuery" placeholder="Rechercher des articles" class="search-input">
        <table v-if="!isLoading" class="article-list__table responsive-table">
            <thead>
                <tr>
                    <th>Libelle</th>
                    <th>Prix</th>
                    <th>Image</th>
                    <th>Euros</th>
                    <th>Type d'argent</th>
                    <th>Crée à</th>
                    <th>Modifié à</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="filteredArticles.length" v-for="article in paginatedArticles" :key="article.id" class="article-list__item">
                    <td>{{ article.libelle }}</td>
                    <td>{{ article.price }}</td>
                    <td>{{ article.media }}</td>
                    <td>{{ article.euros }}</td>
                    <td>{{ article.money.type }}</td>
                    <td>{{ formatDate(article.createdAt) }}</td>
                    <td>{{ formatDate(article.updatedAt) }}</td>
                    <td>
                        <button @click="editArticle(article.id)" class="update-button">Modifier</button>
                        <button @click="confirmDeleteArticle(article.id)" class="delete-button">Supprimer</button>
                    </td>
                </tr>
                <tr v-if="filteredArticles.length === 0" class="article-list__item article-list__item--empty">
                    <td colspan="7">Pas d'articles</td>
                </tr>
            </tbody>
        </table>
        <h2 v-if="isLoading" class="loading-text">Loading ...</h2>
        <div class="pagination">
            <button @click="previousPage" :disabled="currentPage === 1" class="pagination__button">Précédent</button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination__button">Suivant</button>
        </div>
    </div>
  
    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Créer un article</h3>
                    <button type="button" class="modal-close" @click="cancelCreate">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit="createArticle">
                        <div class="form-group">
                            <label for="newLibelle">Libelle</label>
                            <input type="text" v-model="newArticleForm.libelle" id="newLibelle" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <label for="newPrice">Prix</label>
                            <input type="number" v-model="newArticleForm.price" id="newPrice" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <label for="newEuros">Euros</label>
                            <input type="number" v-model="newArticleForm.euros" id="newEuros" class="input-field" required>
                        </div>
                        <div class="form-group">
                          <label for="newMoney">Type de monnaie</label>
                          <select v-model="newArticleForm.id_money" class="select-field" required>
                            <option disabled value="">En choisir un</option>
                            <!-- Utilisez v-for pour itérer sur la liste des rôles -->
                            <option v-for="money in moneys" :key="money.id" :value="money.id">{{ money.type }}</option>
                          </select>
                        </div>


                        <div class="modal-footer">
                        <button type="submit" class="button primary">Créer</button>
                        <button type="button" class="button" @click="cancelCreate">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- ... -->
  
    <!-- Update article -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Modifier un article</h3>
            <button type="button" class="modal-close" @click="cancelEdit">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit="updateArticle">
              <div class="form-group">
                <label for="libelle">Libelle</label>
                <input type="text" v-model="editArticleForm.libelle" id="libelle" class="input-field" required>
              </div>
              <div class="form-group">
                <label for="price">Prix</label>
                <input type="number" v-model="editArticleForm.price" id="price" class="input-field" required>
              </div>
              <div class="form-group">
                <label for="euros">Euros</label>
                <input type="number" v-model="editArticleForm.euros" id="euros" class="input-field" required>
              </div>
              <div class="form-group">
                <label for="id_money">Type de monnaie:</label>
                <select v-model="editArticleForm.id_money" class="select-field">
                  <option disabled value="">En choisir un</option>
                  <option :value="1">Premium</option>
                  <option :value="2">Free</option>
                  <option :value="3">Euros</option>
                </select>
              </div>
              <div class="form-group">
                <label for="id_money">Type de monnaie:</label>
                <select v-model="editArticleForm.id_money" class="select-field">
                  <option disabled value="">En choisir un</option>
                  <!-- Utilisez v-for pour itérer sur la liste des rôles -->
                  <option v-for="money in moneys" :key="money.id" :value="money.id">{{ money.type }}</option>
                </select>
              </div>

              <div class="modal-footer">
                <button type="submit" class="button primary">Confirmer</button>
                <button type="button" class="button" @click="cancelEdit">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- ... -->
  </template>
  
  <script>
    import dayjs from 'dayjs';
    import 'dayjs/locale/fr';

    dayjs.locale('fr');
    export default {
      methods: {
        formatDate(dateString) {
          const date = dayjs(dateString);
          return date.format('dddd D MMMM, YYYY');
        }
      }
    }
  </script>

  <script setup>
  import { reactive, onMounted, ref, computed, watch } from 'vue';
  
  const articles = reactive([]);
  const isLoading = ref(true);
  const currentPage = ref(1);
  const pageSize = 10;
  const searchQuery = ref('');
  const filteredQuery = ref('');
  const showEditModal = ref(false);
  const showCreateModal = ref(false);
  const selectedArticleId = ref(null);
  const moneys = ref([]);
  const editArticleForm = reactive({
    libelle: '',
    price: '',
    euros: '',
    id_money: ''
  });

  const newArticleForm = reactive({
    libelle: '',
    price: '',
    euros: '',
    id_money: ''
  });
  
  onMounted(async () => {
    const response = await fetch(`http://localhost:3000/articles`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    if (response.ok) {
      articles.push(...(await response.json()));
      isLoading.value = false;
    } else {
      alert('Error while fetching');
    }
  });

  onMounted(async () => {
    // Récupérer les rôles depuis l'API lors du chargement du composant
    moneys.value = await fetchMoneys();
  });
    
  const filteredArticles = computed(() => {
    if (filteredQuery.value === '') {
      return articles;
    } else {
      const query = filteredQuery.value.toLowerCase();
      return articles.filter(article => article.libelle.toLowerCase().includes(query) || article.price.toString().includes(query) || article.money.type.toLowerCase().includes(query));
    }
  });
  
  const paginatedArticles = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredArticles.value.slice(startIndex, endIndex);
  });
  
  const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize));
  
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }
  
  function previousPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }
  
  watch(searchQuery, () => {
    currentPage.value = 1;
    filteredQuery.value = searchQuery.value;
  });
  
  watch([filteredArticles, currentPage], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  });
  
  
  function confirmDeleteArticle(articleId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      deleteArticle(articleId);
    }
  }
  
  function deleteArticle(articleId) {
    fetch(`http://localhost:3000/articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.ok) {
          // Suppression réussie, mettre à jour la liste des utilisateurs
          articles.splice(articles.findIndex(article => article.id === articleId), 1);
        } else {
          // Gérer les erreurs de suppression
          alert('Error while deleting article');
        }
      })
      .catch(error => {
        // Gérer les erreurs de connexion ou de requête
        console.error(error);
      });
  }

  async function fetchMoneys() {
    try {
      const response = await fetch(`http://localhost:3000/moneys`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const moneys = await response.json();
        return moneys;
      } else {
        throw new Error('Error while fetching moneys');
      }
    } catch (error) {
      console.error(error);
      alert('Error while fetching moneys');
      return [];
    }
  }

  async function createArticle() {
    event.preventDefault();

    const newArticle = {
      libelle: newArticleForm.libelle,
      price: newArticleForm.price,
      euros: newArticleForm.euros,
      id_money: newArticleForm.id_money,
      media: "http://placeimg.com/640/480"
    };

    const response = await fetch(`http://localhost:3000/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newArticle)
    });

    if (response.ok) {
      // Création réussie, récupérer le nouvel article avec les informations de type d'argent
      const createdArticle = await response.json();

      // Récupérer les informations de type d'argent pour le nouvel article
      const moneyTypeResponse = await fetch(`http://localhost:3000/moneys/${createdArticle.id_money}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (moneyTypeResponse.ok) {
        const moneyType = await moneyTypeResponse.json();
        createdArticle.money = { type: moneyType.type };

        // Ajouter le nouvel article à la liste des articles
        articles.push(createdArticle);

        // Mettre à jour la liste filtrée pour inclure le nouvel article
        filteredQuery.value = searchQuery.value;

        showCreateModal.value = false; // Fermer le modal de création
      } else {
        // Gérer les erreurs de récupération du type d'argent
        alert('Error while fetching money type for the new article');
      }
    } else {
      // Gérer les erreurs de création
      alert('Error while creating article');
    }
  }


  function cancelCreate() {
      showCreateModal.value = false; // Fermer le modal de création
  }

  
  function editArticle(articleId) {
    const article = articles.find(article => article.id === articleId);
    selectedArticleId.value = articleId;

    const articleMoney = moneys.value.find(money => money.id === article.id_money);
  
    // Afficher le modal de modification avec les données de l'utilisateur
    showEditModal.value = true;
    editArticleForm.libelle = article.libelle;
    editArticleForm.price = article.price;
    editArticleForm.euros = article.euros;
    editArticleForm.id_money = articleMoney ? articleMoney.id : '';
  }
  
  async function updateArticle() {
    event.preventDefault();
    const articleId = selectedArticleId.value;

    // Envoyer les nouvelles données de l'article au serveur
    const updatedArticle = {
      libelle: editArticleForm.libelle,
      price: editArticleForm.price,
      euros: editArticleForm.euros,
      id_money: editArticleForm.id_money,
      updatedAt: new Date().toISOString()
    };

    // Envoyer les nouvelles données de l'article au serveur
    const response = await fetch(`http://localhost:3000/articles/${articleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(updatedArticle)
    });

    if (response.ok) {
      // Modification réussie, récupérer l'article mis à jour avec les informations de type d'argent
      const updatedArticleData = await response.json();

      // Récupérer les informations de type d'argent pour l'article mis à jour
      const moneyTypeResponse = await fetch(`http://localhost:3000/moneys/${updatedArticleData.id_money}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (moneyTypeResponse.ok) {
        const moneyType = await moneyTypeResponse.json();
        updatedArticleData.money = { type: moneyType.type };

        // Mettre à jour les données de l'article dans la liste
        const index = articles.findIndex(article => article.id === articleId);
        articles[index] = updatedArticleData;
        showEditModal.value = false; // Fermer le modal de modification
      } else {
        // Gérer les erreurs de récupération du type d'argent pour l'article mis à jour
        alert('Error while fetching money type for the updated article');
      }
    } else {
      // Gérer les erreurs de modification
      alert('Error while editing article');
    }
  }

  
  function cancelEdit() {
    showEditModal.value = false; // Fermer le modal de modification
  }
  </script>
  
<style scoped>
  .create-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .create-button:hover {
    background-color: #0056b3;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-dialog {
    max-width: 400px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .modal-header {
    padding: 10px 20px;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .modal-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: black;
  }
  
  .modal-close {
    border: none;
    background-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
    color: black;
  }
  
  .label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .article-list__table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
  }
  
  .article-list__table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    color: black;
  }
  
  .article-list__table th {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    color: black;
    background-color: #28a745;
  }
  
  .modal-footer {
    padding: 10px 20px;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .button {
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .button.primary {
    background-color: #007bff;
    color: #fff;
    border: none;
  }
  
  .button {
    margin-left: 10px;
    background-color: #ccc;
    color: #000;
    border: none;
  }
  
  .select-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    font-size: 16px;
    cursor: pointer;
  }
  
  /* Pour masquer la flèche par défaut des champs select dans certains navigateurs */
  .select-field::-ms-expand {
    display: none;
  }
  
  /* Pour personnaliser l'apparence de la flèche dans les autres navigateurs */
  .select-field::after {
    content: "";
    position: absolute;
    top: calc(50% - 2px);
    right: 10px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    border-color: #888 transparent transparent transparent;
    pointer-events: none;
  }
  
  .article-list {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  
  .article-list__list {
    list-style: none;
    padding: 0;
  }
  
  .article-list__item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: black;
  }
  
  .article-list__item--empty {
    color: #888;
  }
  
  .loading-text {
    text-align: center;
    margin-top: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: center;
  }
  
  .pagination__button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .pagination__button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .update-button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .delete-button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #d3190b;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .responsive-table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
  }
  
  .responsive-table th,
  .responsive-table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    color: black;
  }
  
  @media (max-width: 600px) {
    .responsive-table td {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }
  
    /* Ajoutez ces styles pour afficher les en-têtes uniquement pour les écrans plus larges */
    .responsive-table th {
      display: none;
    }
  
    .responsive-table td:before {
      content: attr(data-label);
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
    }
  }
  </style>
  