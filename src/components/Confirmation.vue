<template>
  <div class="confirmation">
    <img src="/public/img/Logo_SansFond.png" class="logo" alt="Logo Huddle" />
    <h1>You're all set!</h1>
    <p>{{ contenu }}</p>
  </div>
  <img
    src="/public/img/030944d95452b06dbc1064629755862e.png"
    id="deco"
    alt="Joueuse de football"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";

import { useRoute } from "vue-router";

const contenu = ref(
  "Thanks for joining! Your flyer with your jersey design is ready for pickup."
);

onMounted(() => {
  if (localStorage.getItem("shippingForm") === "true") {
    submitClientFromStorage();
    contenu.value =
      "Thanks for joining! Your personalized jersey will soon be on its way.";
  } else {
    submitClientFromStorage();
    contenu.value =
      "Thanks for joining! Your flyer with your jersey design is ready for pickup.";
  }
});

async function submitClientFromStorage() {
  const inscriptionForm = JSON.parse(
    localStorage.getItem("inscriptionForm") || "{}"
  );
  const shippingForm = JSON.parse(localStorage.getItem("shippingForm") || "{}");
  const lastExportedFile = localStorage.getItem("lastExportedFile") || null;
  let coaching = localStorage.getItem("coachingSession") || false;

  if (
    !inscriptionForm ||
    !inscriptionForm.firstName ||
    !inscriptionForm.email ||
    !inscriptionForm.phone
  ) {
    alert("Données d'inscription manquantes");
    return;
  }
  // On va récupérer le jersey par son nom de fichier pour obtenir l'ID
  let jerseyId = null;

  try {
    const response = await fetch("http://localhost:3001/jerseys");
    const jerseys = await response.json();

    const found = jerseys.find((j) => j.drawingFile === lastExportedFile);
    if (found) {
      jerseyId = found.id;
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du jersey :", err);
  }

  if (coaching === "true") {
    coaching = true;
  } else{
    coaching = false;
  }

  const clientData = {
    firstName: inscriptionForm.firstName,
    lastName: inscriptionForm.lastName,
    email: inscriptionForm.email,
    phoneNumber: inscriptionForm.phone,
    street: shippingForm.street || null,
    postalCode: shippingForm.postal || null,
    city: shippingForm.city || null,
    country: shippingForm.country || null,
    supportCoach: coaching,
  };

  if (jerseyId) {
    clientData.jerseyId = jerseyId;
  }

  try {
    const res = await fetch("http://localhost:3001/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Client créé :", data);
      alert("Client enregistré !");
      // Tu peux rediriger ou nettoyer les données ici si besoin
    } else {
      console.error("❌ Erreur serveur :", data.error);
      alert("Erreur lors de la création du client");
    }
  } catch (err) {
    console.error("❌ Erreur réseau :", err);
    alert("Impossible de contacter le serveur");
  }
}
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
.logo {
  position: relative;
  bottom: auto;
  right: auto;
}

h1 {
  font-size: 7rem;
  margin: 0;
  margin-top: 30px;
  color: #f9d5e7;
}

p {
  font-size: 2rem;
  font-family: "Montserrat", sans-serif;
  margin: 0;
  color: #f9d5e7;
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
