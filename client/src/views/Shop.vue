<script setup>

import {computed, inject, onMounted, reactive, ref, watch} from "vue";
import { loadStripe } from '@stripe/stripe-js';

const articles  = reactive([]);
const isLoading = ref(true);
const errors = ref({});
const success = ref(false);
const errorsMoney = ref({});
const successMoney = ref();
const selectedCategory = ref("all");
const buys = reactive([]);
const moneysId = reactive([]);
const user = inject('user');
const article = reactive(null);

onMounted(async () => {
  const articlesResponses = await fetch(`http://149.202.52.182:3000/articles`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (articlesResponses.ok) {
    articles.push(...(await articlesResponses.json()));
    isLoading.value = false;
  } else {
    alert('Error while fetching articles');
  }

  const moneysIdResponses = await fetch(`http://149.202.52.182:3000/moneys`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (moneysIdResponses.ok){
    moneysId.push(...(await moneysIdResponses.json()));
  }
});

const selectedArticle = ref(null);
const popupIsOpen = ref(false);

function openPopup(article) {
  selectedArticle.value = article;
  popupIsOpen.value = true;
}

function closePopUp() {
  popupIsOpen.value = false;
}

async function buyArticle(articleId) {
  const response = await fetch(`http://149.202.52.182:3000/articles/${articleId}/buy`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-type': 'application/json'
    },
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    return Promise.resolve(await response.json());
  }
  throw new Error('Fetch failed');
}

function handleBuy() {
  const articleId = selectedArticle.value ? selectedArticle.value.id : null;
  buyArticle(articleId).then(() => {
    success.value = true;
    setTimeout(() => {
      success.value = false;
      closePopUp();
      window.location.reload();
    }, 2000);
  }).catch((error) => {
    errors.value = error;
    setTimeout(() => {
      errors.value = {};
    }, 2000);
  });
}
async function buyMoney(articleId) {
  try {
    const response = await fetch(`http://149.202.52.182:3000/owns/${articleId}/buy-money`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        id_money: articleId
      })
    });
    if (response.status === 422) {
      throw await response.json();
    } else if (response.ok) {
    } else {
      throw new Error('Fetch failed');
    }

  } catch (error) {
    errorsMoney.value = error;
    setTimeout(() => {
      errorsMoney.value = {};
    }, 2000);
    throw error; // Ajout de cette ligne pour rejeter la promesse avec l'erreur
  }
}

function handleBuyMoney() {
  const moneyId = selectedArticle.value ? selectedArticle.value.id : null;
  buyMoney(moneyId).then(() => {
    setTimeout(() => {
      successMoney.value = null;
      closePopUp();
      window.location.reload();
    }, 2000);
  }).catch((error) => {
    errorsMoney.value = error;
    setTimeout(() => {
      errorsMoney.value = {};
    }, 2000);
  });
}

async function payMoney(articleEuros, articleId) {

  handleBuyMoney();

  const stripePromise = loadStripe('pk_test_51NSiaQDP3IyimeBr1KMKlmmg0UqfUKBIwndVIig0aLuMZY5LrIAIwsG5dzVd5YMFj7MlZW35nDXSD7l7EPOQbzOl0084Stjm3s');
  const stripe = await stripePromise;
  const response = await fetch(`http://localhost:3000/owns/pay`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      articleEuros: articleEuros
    })
  });

  if (!response.ok) {
    throw new Error('Fetch failed');
  }

  const data = await response.json();
  const sessionId = data.sessionId;


  const {error} = await stripe.redirectToCheckout({
    sessionId: sessionId,
  });


}


onMounted( async () => {
  const buysResponses = await fetch(`http://149.202.52.182:3000/buys`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (buysResponses.ok){
    buys.push(...(await buysResponses.json()));
  }
});

const purchasedArticles = computed(() => buys.filter(item => item.id_user === user.value.id ));

const filteredArticles = computed(() => {
  const purchasedArticleIds = purchasedArticles.value.map(purchased => purchased.id_article);

  if (selectedCategory.value === "all") {
    return articles.filter(article => !purchasedArticleIds.includes(article.id));
  } else if (selectedCategory.value === "free") {
    return articles.filter(article => !purchasedArticleIds.includes(article.id) && article.id_money === moneysId[1]?.id);
  } else if (selectedCategory.value === "premium") {
    return articles.filter(article => !purchasedArticleIds.includes(article.id) && article.id_money === moneysId[0]?.id);
  } else if (selectedCategory.value === "euro") {
    return articles.filter(article => !purchasedArticleIds.includes(article.id) && article.id_money === moneysId[2]?.id);
  } else if (selectedCategory.value === "purchased") {
    return articles.filter(article => purchasedArticleIds.includes(article.id));
  }
});

function filterCategory(category) {
  selectedCategory.value = category;
}

</script>

<template>
  <div v-if="popupIsOpen" class="popup">
    <div class="popup-content">
      <span class="close" @click="closePopUp">&times;</span>
      <p class="error">{{ errors.buy }}</p>
      <p class="error">{{ errors.money }}</p>
      <p class="success" v-if="success">Article acheté avec succès</p>
      <img src="../assets/echiquier-bois.jpg" class="image">
      <h2>{{ selectedArticle.libelle }}</h2>
      <p class="price-pop" v-if="selectedArticle.id_money === moneysId[0]?.id">{{ selectedArticle.price }}<img class="img-coin" src="../assets/premium-coin.svg"></p>
      <p class="price-pop" v-if="selectedArticle.id_money === moneysId[1]?.id">{{ selectedArticle.price }}<img class="img-coin" src="../assets/free-coins.svg"></p>
      <p class="price-pop" v-if="selectedArticle.id_money === moneysId[2]?.id">{{ selectedArticle.euros }} €</p>
      <button v-if="selectedArticle.id_money === moneysId[0]?.id" @click="handleBuy()" class="buy">Acheter</button>
      <button v-if="selectedArticle.id_money === moneysId[1]?.id" @click="handleBuy()" class="buy">Acheter</button>
      <button v-if="selectedArticle.id_money === moneysId[2]?.id" @click="payMoney(selectedArticle.euros, selectedArticle.euros)" class="buy-money">Acheter</button>
    </div>
  </div>
  <div class="shop">
    <div class="section-articles">
      <h1>Articles</h1>
      <div class="menu">
        <button @click="filterCategory('all')">Tous les articles</button>
        <button @click="filterCategory('free')">Articles gratuits</button>
        <button @click="filterCategory('premium')">Articles premium</button>
        <button @click="filterCategory('euro')">Monnaies</button>
        <button @click="filterCategory('purchased')">Articles achetées</button>
      </div>
      <div v-if="!isLoading">
        <div class="all-articles">
          <div v-for="article in filteredArticles" :key="article.id" @click="openPopup(article)">
            <div class="article">
              <img src="../assets/echiquier-bois.jpg" class="image">
              <p class="libelle">{{ article.libelle }}</p>
              <div class="price">
                <p v-if="article.id_money === moneysId[0]?.id">{{ article.price }}</p>
                <p v-if="article.id_money === moneysId[1]?.id">{{ article.price }}</p>
                <p v-if="article.id_money === moneysId[2]?.id">{{ article.euros }}</p>
                <img class="img-coin" v-if="article.id_money === moneysId[0]?.id" src="../assets/premium-coin.svg">
                <img class="img-coin" v-if="article.id_money === moneysId[1]?.id" src="../assets/free-coins.svg">
                <p class="price" v-if="article.id_money === moneysId[2]?.id"> €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<style scoped>

  .shop {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    overflow: auto;
    margin: 0 10px;
    gap: 20px;
    height: 90vh;  }

  .section-articles {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .all-articles{
    display: flex;
    flex-wrap: wrap;
  }

  .article{
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: white 1px solid;
    border-radius: 2%;
    margin: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .article:hover{
    background-color: rgba(255, 255, 255, 0.5);
  }

  .price{
    display: flex;
  }

  .img-coin{
    padding-left: 4px;
  }

  .popup{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-content{
    position: relative;
    background-color: white;
    padding: 20px;
    width: 50%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 1%;
    color: #252849;
  }

  .close{
    position: absolute;
    top: 0;
    right: 14px;
    font-size: 42px;
    font-weight: bold;
    color: #f1f1f1;
    cursor: pointer;
  }

  .buy{
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
  }

  .buy-money{
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
    background-color: #0056b3;
  }

  .price-pop{
    display: flex;
  }

  .success{
    color: green;
  }

  .error{
    color: red;
  }

  .menu {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .menu button {
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .menu button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .menu button.active {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .section-articles {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>