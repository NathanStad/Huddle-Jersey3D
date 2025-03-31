<template>
    <div class="confirmation">
        <h1>Confirmation de vos choix</h1>
        <p>Merci d'avoir confirmé vos choix !</p>
        <div v-if="wantsTShirt">
            <p>Vous avez choisi de recevoir un t-shirt.</p>
            <p>Vous le recevrez dans 7 à 10 jours ouvrables.</p>
        </div>
        <div v-else>
            <p>Vous n'avez pas choisi de recevoir un t-shirt.</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    wantsTShirt: {
        type: Boolean,
        required: true,
    },
});
</script>

<style scoped>
.confirmation {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 20px;
}

h1 {
    color: #333;
}

p {
    color: #555;
}
</style>
