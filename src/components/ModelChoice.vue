<template>
  <div class="model-choice">
    <h1>Choose your favorite jersey</h1>
    <div class="models">
      <label class="model" :class="{ selected: selectedModel === 1 }">
        <input type="radio" name="model" value="1" v-model="selectedModel" hidden />
        <img src="/img/jersey-color1.png" alt="Modèle 1" @click="selectModel(1)" />
      </label>
      <label class="model" :class="{ selected: selectedModel === 2 }">
        <input type="radio" name="model" value="2" v-model="selectedModel" hidden />
        <img src="/img/jersey-color2.png" alt="Modèle 2" @click="selectModel(2)" />
      </label>
    </div>

    <button 
      @click="confirmSelection" 
      class="confirm-button" 
      :disabled="selectedModel === null"
    >
      LET’S GO
    </button>
    <a class="back" href="/">Back</a>
  </div>
  <img src="/public/img/LogoHuddleVert.png" class="logo" alt="Logo Huddle" />
</template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const selectedModel = ref(null)
  
  function selectModel(model) {
    selectedModel.value = model
  }
  
  function confirmSelection() {
    if (selectedModel.value !== null) {
      router.push({ name: 'Customization', query: { model: selectedModel.value } })
    } else {
      alert('Veuillez choisir un modèle.')
    }
  }
  </script>
  
  <style scoped>
  .model-choice {
    text-align: center;
    font-family: sans-serif;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  h1{
    color: #6AA24A;
    font-size: 5rem;
    margin: 2%;
    font-family: 'Berlin Sans FB', sans-serif;

}
  
  .models {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin: 40px 0;
  }
  
  .model {
    border: 2px solid transparent;
    padding: 10px;
    border-radius: 10px;
    transition: border 0.3s ease;
    cursor: pointer;
  }
  
  .model img {
    width: 350px;
    height: auto;
  }
  
  .model.selected {
    border: 3px solid #6AA24A;
    box-shadow: 0 0 10px rgba(123, 180, 100, 0.5);
  }
  
  .confirm-button {
    background-color: #6AA24A;
    color: #FFFCDE;
    border: none;
    padding: 2% 0.5%;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 5px;
    font-family: 'Berlin Sans FB', sans-serif;
    width: 40%;
    border-radius: 100px;
  }
  
  .confirm-button:hover {
    background-color: #6AA24A;
  }
  .back{
    color: #6AA24A;
    text-decoration: none;
  }
  .confirm-button:disabled {
  background-color: #6AA24A;
  opacity: 0.5;
  cursor: not-allowed;
}
  </style>
  