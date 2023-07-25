    <script setup>
        import { useRoute, useRouter } from 'vue-router';
        import BoardContainer from "../components/BoardContainer.vue";
        import { onMounted, ref } from 'vue';

        const gameId = ref(useRoute().params.gameId);
        const router = useRouter();

        onMounted(async () => {
        try {
            const response = await fetch(`http://localhost:3000/games/${gameId.value}`, {method: 'GET'});
            const gameExists = await response.json();

            if (!gameExists) {
            router.replace({ name: 'NotFound' });
            }
        } catch (error) {
            console.error(error);
            router.replace({ name: 'NotFound' });
        }
        });
    </script>

    <template>
        <BoardContainer />
    </template>

    <style scoped>
    
    </style>