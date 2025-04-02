<template>
  <div class="session-page">
    <div class="overlay">
      <div id="content">
        <h1>Join our Coaching Info-Session ! *</h1>
        <p class="subtitle">
          Take the next step to becoming a female football coach with Huddle.
          Register now for our free, no-commitment information session.
        </p>
      </div>

      <!-- Choix -->
      <div class="options">
        <div
          class="option"
          :class="{ selected: selectedOption === 'yes' }"
          @click="selectedOption = 'yes'"
        >
          <span class="checkbox">{{
            selectedOption === "yes" ? "✅" : "⬜"
          }}</span>
          <span
            ><strong
              >Yes, register me for the coaching info-session</strong
            ></span
          >
        </div>

        <div
          class="option"
          :class="{ selected: selectedOption === 'no' }"
          @click="selectedOption = 'no'"
        >
          <span class="checkbox">{{
            selectedOption === "no" ? "✅" : "⬜"
          }}</span>
          <span><strong>No, not this time</strong></span>
        </div>
        <p class="note">
          * All details about dates, times, and locations will be sent directly
          to your email.
        </p>
      </div>

      <button class="register-button" @click="submitChoice">
        Complete registration
      </button>

      <img src="/public/img/Logo_SansFond.png" class="logo" alt="Logo Huddle" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
const selectedOption = ref("yes");

function submitChoice() {
  if (selectedOption.value === "yes") {
    router.push("/confirmation?conf=1");
    alert("You are registered for the coaching info-session!");
  } else {
    router.push("/confirmation?conf=2");
    alert("No worries! Maybe next time.");
  }
}
</script>

<style scoped>
.session-page {
  background-image: url("../assets/FondGazon.jpg"); /* remplace par ton image */
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f9d5e7;
  position: relative;
}

.overlay {
  text-align: center;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;
}
#content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
h1 {
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 40px;
  width: 80%;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  width: 80%;
}

.option {
  background-color: #fcd7e9;
  padding: 30px 30px;
  border-radius: 10px;
  cursor: pointer;
  color: black;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
}

.checkbox {
  font-size: 22px;
  color: #6aa24a;
}

.note {
  font-size: 1.5rem;
  margin-top: 10px;
  margin-bottom: 30px;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
}

.register-button {
  background-color: #fcd7e9;
  color: #6aa24a;
  font-weight: bold;
  font-size: 18px;
  border: none;
  width: 50%;
  height: 10%;
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.3s;
}

.register-button:hover {
  background-color: #fbe3ee;
}
</style>
