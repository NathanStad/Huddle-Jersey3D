<template>
    <div class="inscription-form">
        <h1>Formulaire d'Inscription</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label for="firstName">Prénom:</label>
                <input type="text" id="firstName" v-model="form.firstName" required />
            </div>
            <div>
                <label for="lastName">Nom:</label>
                <input type="text" id="lastName" v-model="form.lastName" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="form.email" required />
            </div>
            <div>
                <label for="age">Âge:</label>
                <input type="number" id="age" v-model="form.age" required />
            </div>
            <div>
                <label for="birthDate">Date de naissance:</label>
                <input type="date" id="birthDate" v-model="form.birthDate" required />
            </div>
            <div>
                <label for="phoneNumber">Numéro de téléphone:</label>
                <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
            </div>
            <div>
                <label for="street">Rue:</label>
                <input type="text" id="street" v-model="form.street" required />
            </div>
            <div>
                <label for="city">Ville:</label>
                <input type="text" id="city" v-model="form.city" required />
            </div>
            <div>
                <label for="postalCode">NPA:</label>
                <input type="text" id="postalCode" v-model="form.postalCode" required />
            </div>
            <div>
                <label for="country">Pays:</label>
                <input type="text" id="country" v-model="form.country" required />
            </div>
            <div>
                <label for="isCoach">Souhaitez-vous devenir coach ?</label>
                <input type="checkbox" id="isCoach" v-model="form.isCoach" />
            </div>
            <div>
                <label for="isMember">Souhaitez-vous devenir membre de Huddle ?</label>
                <input type="checkbox" id="isMember" v-model="form.isMember" />
            </div>
            <div>
                <label for="receiveTshirt">Souhaitez-vous recevoir votre t-shirt ?</label>
                <input type="checkbox" id="receiveTshirt" v-model="form.receiveTshirt" />
            </div>
            <button type="submit">Envoyer</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
    firstName: "",
    lastName: "",
    email: "",
    age: null,
    birthDate: "",
    phoneNumber: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    isCoach: false,
    isMember: false,
    receiveTshirt: false,
});

function submitForm() {
    console.log("Formulaire soumis :", form);
    // Ajoutez ici la logique pour traiter les données du formulaire
    window.location.href = "/confirmation";
}
</script>

<style scoped>
.inscription-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.inscription-form h1 {
    text-align: center;
    margin-bottom: 20px;
}

.inscription-form div {
    margin-bottom: 15px;
}

.inscription-form label {
    display: block;
    margin-bottom: 5px;
}

.inscription-form input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.inscription-form button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.inscription-form button:hover {
    background-color: #0056b3;
}
</style>