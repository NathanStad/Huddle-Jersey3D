<template>
  <div class="form-page">
    <div class="form-container">
      <div class="text-form">
        <h1>Almost there !</h1>
        <p>Fill in your details to continue</p>
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <label for="firstName">First name</label>
            <input type="text" id="firstName" v-model="form.firstName" required />
            <span v-if="errors.firstName">{{ errors.firstName }}</span>
          </div>
          <div class="input-group">
            <label for="lastName">Last name</label>
            <input type="text" id="lastName" v-model="form.lastName" required />
            <span v-if="errors.lastName">{{ errors.lastName }}</span>
          </div>
          <div class="input-group">
            <label for="email">Email address</label>
            <input type="email" id="email" v-model="form.email" required />
            <span v-if="errors.email">{{ errors.email }}</span>
          </div>
          <div class="input-group phone-input">
            <label for="phoneNumber">Phone number</label>
            <div class="phone-wrapper">
              <select v-model="form.countryCode">
                <option value="+41">+41</option>
                <option value="+33">+33</option>
              </select>
              <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
            </div>
            <span v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
          </div>
        </form>
      </div>
      <div class="shirt-preview">
        <img src="/img/jersey-color1.png" alt="Shirt preview" />
      </div>
    </div>
    <div class="form-submit">
      <button 
        type="submit" 
        class="next-button" 
        @click="handleSubmit" 
        :disabled="!isFormValid"
      >
        NEXT
      </button>
      <div class="back-link" @click="back">Back</div>
    </div>
    <img src="/public/img/LogoHuddleVert.png" class="logo" alt="Logo Huddle" />
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();


if (!(localStorage.getItem('lastExportedFile'))) {
  window.history.back();
}

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  countryCode: "+41"
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: ""
});

const isValidName = (value) => /^[A-Za-zÀ-ÖØ-öø-ÿ\-]{2,30}$/.test(value);
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const isValidPhone = (value) => /^[0-9]{7,15}$/.test(value);

const validate = () => {
  let isValid = true;
  errors.firstName = isValidName(form.firstName) ? '' : 'Invalid first name';
  errors.lastName = isValidName(form.lastName) ? '' : 'Invalid last name';
  errors.email = isValidEmail(form.email) ? '' : 'Invalid email';
  errors.phoneNumber = isValidPhone(form.phoneNumber) ? '' : 'Invalid phone number';
  return !errors.firstName && !errors.lastName && !errors.email && !errors.phoneNumber;
};

const isFormValid = computed(() => {
  return (
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phoneNumber.trim() !== "" &&
    form.countryCode.trim() !== ""
  );
});

function handleSubmit() {
  if (validate()) {
    const data = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.countryCode + form.phoneNumber
    };
    localStorage.setItem('inscriptionForm', JSON.stringify(data));
    router.push("/receive");
  }
}

function back() {
  window.history.back();
}
</script>
  <style scoped>
  *{
    font-family: 'Berlin Sans FB', sans-serif;

  }
  .form-page {
    background-color: #fffbdc;
    font-family: 'Arial Rounded MT Bold', sans-serif;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  
  .form-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
    height: 70vh;
    width: 80vw;
  }
  
  .text-form {
    flex: 1;
  }
  
  .text-form h1 {
    color: #6AA24A;
    font-size: 5rem;
    font-weight: bold;
  }
  
  .text-form p {
    color: #6AA24A;
    margin-bottom: 30px;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .input-group label {
    color: #6AA24A;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .input-group input,
  .input-group select {
    padding: 10px;
    border: 2px solid #6AA24A;
    border-radius: 8px;
    background: transparent;
    font-size: 1rem;
    color: #6AA24A;
  }
  
  .phone-input .phone-wrapper {
    display: flex;
    gap: 10px;
  }
  
  .phone-wrapper select {
    width: 80px;
  }
  #phoneNumber{
    width: 100%;
  }
  .next-button {
    width: 40%;
    height: 40%;
    padding: 14px;
    background-color: #6AA24A;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    border: none;
    border-radius: 30px;
    margin-top: 20px;
    cursor: pointer;
  }
  .next-button:disabled {
    opacity: 0.5;
  }
  
  .next-button:hover {
    background-color: #6AA24A;
  }
  
  .back-link {
    margin-top: 10px;
    color: #6AA24A;
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
  }
  .form-submit{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 20%;
  }
  .shirt-preview {
    flex: 1;
    text-align: center;
  }
  
  .shirt-preview img {
    width: 100%;
  }
  </style>
