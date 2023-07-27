<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import BoardContainer from "../components/BoardContainer.vue";
    import { inject, onMounted, ref, provide } from 'vue';

    const gameId = ref(useRoute().params.gameId);
    const router = useRouter();

    const user = inject('user');

    const userColor = ref(null);
    const gameExists = ref(null);
    const dataReady = ref(false);
    const isUserAuthorized = ref(false);
    provide('gameId', gameId);
    provide('userColor', userColor);
    provide('gameExists', gameExists);
    const error = ref(false);
    console.log(error);


    onMounted(async () => {
        try {
            const response = await fetch(`http://localhost:3000/games/${gameId.value}`, {method: 'GET'});
            gameExists.value = await response.json();

            if (!gameExists.value) {
                error.value = true
            } else {
                if (gameExists.value.WhiteUserID === user.value.id) {
                    userColor.value = 'w';
                } else if (gameExists.value.BlackUserID === user.value.id) {
                    userColor.value = 'b';
                }
                const authResponse = await fetch(`http://localhost:3000/games/${gameId.value}/authorized`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user.value.id }),
                });
                const authData = await authResponse.json();

                if (!authData.authorized) {
                    error.value = true
                } else {
                    isUserAuthorized.value = true;
                }
            }

            if(error.value){
                router.push({ name: 'Home' });
            }
        } catch (error) {
            router.push({ name: 'Home' });
        }
        dataReady.value = true;
    });
</script>

    <template>
        <BoardContainer v-if="dataReady && isUserAuthorized" />
    </template>

    <style scoped>
    
    </style>