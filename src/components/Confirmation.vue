<template>
    <div class="confirmation">
        <img src="/public/img/Logo_SansFond.png" class="logo" alt="Logo Huddle" />
        <h1>You're all set!</h1>
        <p>{{ contenu }}</p>
    </div>
    <img src="/public/img/030944d95452b06dbc1064629755862e.png" id="deco" alt="Joueuse de football" />

</template>

<script setup>
import { onMounted, ref } from 'vue';

import { useRoute } from 'vue-router';

const contenu = ref('Thanks for joining! Your flyer with your jersey design is ready for pickup.');


const route = useRoute();

onMounted(() => {
    if (route.query.conf === '1') {
        contenu.value = 'Thanks for joining! Your flyer with your jersey design is ready for pickup.';
    }else{
        contenu.value = 'Thanks for joining! Your personalized jersey will soon be on its way.';
    }
});
</script>

<style scoped>
.confirmation {
    font-family: Arial, sans-serif;
    text-align: center;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/FondGazon.jpg");
    background-size: cover;
    overflow: hidden;
}
.logo{
    position: relative;
    bottom: auto;
    right: auto;
}

h1{
    font-size: 7rem;
    margin: 0;
    margin-top: 30px;
    color: #F9D5E7;
}

p{
    font-size: 2rem;
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    color: #F9D5E7;
    width: 50%;
    font-weight: 600;
}

#deco {
    position: absolute;
    bottom: 50%;
    right: 10%;
    transform: translate(50%, 50%);
    width: 30%;
    z-index: 2;
}

</style>
