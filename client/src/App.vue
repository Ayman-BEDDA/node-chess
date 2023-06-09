<script setup>
import Button from './components/Button.vue';
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
import { ref, reactive } from 'vue';
import UserForm from './components/UserForm.vue';
import LoginForm from './components/LoginForm.vue';
import UserList from './views/UserList.vue';
import jwtDecode from 'jwt-decode';

// Vue2
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
// export default {
//   components: {
//     HelloWorld,
//     TheWelcome
//   }
// }
function handleClick1() {
  alert('You clicked me 1!');
}
function handleClick2() {
  isYellow.value = !isYellow.value;
}
function handleClick3() {
  theme.main.backgroundColor = theme.main.backgroundColor === 'red' ? 'cyan' : 'red';
  theme.main.color = theme.main.color === 'white' ? 'black' : 'white';
}
const arrayButtons = [
  {
    title: 'Click Me 1',
    variant: 'default',
    onClick: handleClick1
  },
  {
    title: 'Click Me 2',
    variant: 'square',
    onClick: handleClick2
  },
  {
    title: 'Click Me 3',
    variant: 'round',
    onClick: handleClick3,
    disabled: true
  },
  {
    title: 'Click Me 4',
    variant: 'default'
  },
  {
    title: 'Click Me 5',
    variant: 'coucou'
  }
];
const objButtons = {
  button1: {
    title: 'Click Me 1',
    variant: 'default',
    onClick: handleClick1,
    disabled: false
  },
  button2: {
    title: 'Click Me 2',
    variant: 'square',
    onClick: handleClick2,
    disabled: false
  },
  button3: {
    title: 'Click Me 3',
    variant: 'round',
    onClick: handleClick3,
    disabled: true
  }
};

const showWelcome = true;
const addWelcome = true;
const isYellow = ref(false);
const theme = reactive({
  main: {
    backgroundColor: 'red',
    color: 'white'
  }
});

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

async function registerUser(_user) {
  const response = await fetch(`http://localhost:3000/register`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    return Promise.resolve(await response.json());
  }
  throw new Error('Fetch failed');
}
async function loginUser(_user) {
  const response = await fetch(`http://localhost:3000/login`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    const data = await response.json();
    const token = data.token;
    user.value = jwtDecode(token);
    localStorage.setItem('token', token);
    return Promise.resolve(data);
  }
  throw new Error('Fetch failed');
}
</script>

<template>
  <header :style="{ backgroundColor: isYellow ? 'yellow' : 'inherit' }">
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" v-if="addWelcome" />
      <HelloWorld msg="You did it 2!" v-show="showWelcome" />
    </div>
    <button @click="isYellow = !isYellow">toggle yellow</button>
    <Button title="Click Me 2" variant="square" v-bind:onClick="handleClick2" />
    <Button title="Click Me 3" variant="round" :onClick="handleClick3" />
    <Button
      v-for="(button, index) in arrayButtons"
      :key="index"
      :title="button.title"
      :variant="button.variant"
      :onClick="button.onClick"
    />
    <template v-for="(button, key, index) in objButtons" :key="key">
      <Button
        :title="button.title + ' ' + key + ' ' + index"
        :variant="button.variant"
        :onClick="button.onClick"
        v-if="!button.disabled"
      />
    </template>
  </header>

  <main :style="theme.main">
    <TheWelcome />
    <UserForm v-if="!user" :onSubmit="registerUser" />
    <LoginForm v-if="!user" :onSubmit="loginUser" />
    <UserList v-if="user" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
