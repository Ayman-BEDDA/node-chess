    <script setup>
        import { onMounted } from 'vue';
        import { useRoute, useRouter } from 'vue-router';
        import BoardContainer from "../components/BoardContainer.vue";

        const route = useRoute();
        const router = useRouter();
        let gameId = route.params.gameId;

    </script>

    <template>
        <BoardContainer />
    </template>

    <style scoped>
    
    </style>