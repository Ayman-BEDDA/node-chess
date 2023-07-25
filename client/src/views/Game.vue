<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import BoardContainer from "../components/BoardContainer.vue";
    import { inject, onMounted, ref } from 'vue';

    const gameId = ref(useRoute().params.gameId);
    const router = useRouter();

    const user = inject('user');

    onMounted(async () => {
        try {
            const response = await fetch(`http://localhost:3000/games/${gameId.value}`, {method: 'GET'});
            const gameExists = await response.json();

            if (!gameExists) {
                router.push({ name: 'Home' });
            } else {
                const authResponse = await fetch(`http://localhost:3000/games/${gameId.value}/authorized`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user.value.id }),
                });
                const authData = await authResponse.json();

                if (!authData.authorized) {
                    router.push({ name: 'Home' });
                }
            }
        } catch (error) {
            console.error(error);
            router.push({ name: 'Home' });
        }
    });
</script>

    <template>
        <BoardContainer />
    </template>

    <style scoped>
    
    </style>