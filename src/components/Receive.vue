<template>
    <div class="shipping-container">
      <h1 class="title">How would you like to receive your jersey?</h1>
  
      <div class="content">
        <!-- Flyer -->
        <div class="flyer">
            
        </div>
  
        <!-- Formulaire -->
        <form class="form" @submit.prevent="submitForm">
          <label>
            Street adress
            <input type="text" v-model="form.street" required />
          </label>
  
          <div class="row">
            <label>
              Postal code
              <input type="text" v-model="form.postal" required />
            </label>
            <label>
              City
              <input type="text" v-model="form.city" required />
            </label>
          </div>
  
          <label>
            Country
            <select v-model="form.country" required>
              <option>Switzerland</option>
              <option>France</option>
              <option>Germany</option>
              <option>Italy</option>
            </select>
          </label>
        </form>
      </div>
  
      <!-- Boutons -->
      <div class="buttons">
        <button class="btn" @click="takeFlyer">I'll just take the flyer</button>
        <button class="btn" @click="submitForm">Ship my jersey home!</button>
      </div>
  
      <!-- Logo -->
      <img src="/public/img/LogoHuddleVert.png" class="logo" alt="Logo Huddle" />
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router';
const router = useRouter();
  const form = reactive({
    street: '',
    postal: '',
    city: '',
    country: 'Switzerland',
  })
  
  function submitForm() {
    alert(`Shipping to: ${form.street}, ${form.postal} ${form.city}, ${form.country}`)
        router.push("/coaching");

  }
  
  function takeFlyer() {
    alert('Flyer selected. No shipping needed.')
        router.push("/coaching");

  }
  </script>
  
  <style scoped>
    *{
    font-family: 'Montserrat', sans-serif;

  }
  .shipping-container {
    background-color: #fffbe9;
    font-family: 'Arial', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .title {
    font-size: 5rem;
    font-weight: bold;
    color: #6AA24A;
    margin-bottom: 40px;
    text-align: center;
    font-family: 'Berlin Sans FB', sans-serif;
  }
  
  .content {
    display: flex;
    justify-content: space-around;
    gap: 60px;
    align-items: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    width: 80vw;
    height: 50vh;
  }
  
  .flyer img {
    width: 280px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 40%;
  }
  
  .row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  
  input,
  select {
    width: 100% !important;
    padding: 10px 14px;
    border: 2px solid #6AA24A;
    border-radius: 6px;
    font-size: 14px;
    color: #6AA24A;
    background-color: transparent;
    margin-top: 20px;
  }
  
  label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #6AA24A;
    font-weight: 600;
  }
  
  .buttons {
    display: flex;
    gap: 30px;
    margin-top: 20px;
    width: 60%;
    flex-wrap: wrap;
    justify-content: center;
    font-family: 'Berlin Sans FB', sans-serif;
  }

  .flyer{
    width: 30%;
    background-image: url('../assets/FondGazon.jpg');
    height: 100%;
  }
  
  .btn {
    padding: 14px 28px;
    border: none;
    border-radius: 28px;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    min-width: 400px;
    background-color: #6AA24A;
    color: #FFFBE9;
    font-family: 'Berlin Sans FB', sans-serif;
  }
  
  .btn.primary {
  }
  
  .btn.secondary {
    background-color: #cbe3b4;
    color: #365e1f;
  }
  
  .logo {
    margin-top: 40px;
    font-weight: bold;
    color: #6AA24A;
    font-size: 20px;
  }
  </style>
  