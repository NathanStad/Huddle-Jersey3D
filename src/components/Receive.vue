<template>
  <div class="shipping-container">
    <h1 class="title">How would you like to receive your jersey?</h1>

    <div class="content">
      <!-- Flyer -->
      <div class="flyer"></div>

      <!-- Formulaire -->
      <form class="form" @submit.prevent="handleSubmit">
        <label>
          Street address
          <input type="text" v-model="form.street" required />
          <span v-if="errors.street">{{ errors.street }}</span>
        </label>

        <div class="row">
          <label>
            Postal code
            <input type="text" v-model="form.postal" required />
            <span v-if="errors.postal">{{ errors.postal }}</span>
          </label>
          <label>
            City
            <input type="text" v-model="form.city" required />
            <span v-if="errors.city">{{ errors.city }}</span>
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
      <button 
        class="btn" 
        @click="handleSubmit" 
        :disabled="!isFormValid"
      >
        Ship my jersey home!
      </button>
    </div>

    <!-- Logo -->
    <img src="/public/img/LogoHuddleVert.png" class="logo" alt="Logo Huddle" />
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

if (!localStorage.getItem('inscriptionForm')) {
  window.history.back();
}

const router = useRouter();
const form = reactive({
  street: '',
  postal: '',
  city: '',
  country: 'Switzerland',
});

const errors = reactive({
  street: '',
  postal: '',
  city: ''
});

const isValidStreet = (value) => value.trim().length >= 3;
const isValidPostal = (value) => /^[0-9]{3,10}$/.test(value);
const isValidCity = (value) => /^[A-Za-zÀ-ÖØ-öø-ÿ\-\s]{2,30}$/.test(value);

const validate = () => {
  errors.street = isValidStreet(form.street) ? '' : 'Invalid street address';
  errors.postal = isValidPostal(form.postal) ? '' : 'Invalid postal code';
  errors.city = isValidCity(form.city) ? '' : 'Invalid city';

  return !errors.street && !errors.postal && !errors.city;
};

const isFormValid = computed(() => {
  return (
    form.street.trim() !== '' &&
    form.postal.toString().trim() !== '' &&
    form.city.trim() !== '' &&
    form.country.trim() !== ''
  );
});

function handleSubmit() {
  if (validate()) {
    const shippingData = {
      street: form.street,
      postal: form.postal,
      city: form.city,
      country: form.country
    };
    localStorage.setItem('shippingForm', JSON.stringify(shippingData));
    router.push("/coaching");
  }
}

function takeFlyer() {
  router.push("/coaching");
}
</script>
  
  <style scoped>
    *{
    font-family: 'Montserrat', sans-serif;

  }
  .shipping-container {
    background-color: #fffbdc;
    font-family: 'Arial', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 50px;
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

  .btn:disabled{
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .logo {
    margin-top: 40px;
    font-weight: bold;
    color: #6AA24A;
    font-size: 20px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
