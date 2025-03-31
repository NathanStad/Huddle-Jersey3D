<template>
    <div class="home">
        <h1>Bienvenue sur notre site !</h1>
        <p>Nous sommes ravis de vous accueillir.</p>
        <button @click="goToNextPage">Passer à la suite</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToNextPage() {
    router.push("/model-choice"); // Assurez-vous que la route "/next" existe dans votre configuration de routeur
}
</script>

<style scoped>
.home {
    text-align: center;
    margin-top: 50px;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}
</style>
