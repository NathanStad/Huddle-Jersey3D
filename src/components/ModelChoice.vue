<template>
    <div class="model-choice">
        <h1>Choisissez votre modèle de T-shirt</h1>
        <div class="models">
            <div class="model" @click="selectModel('model1')">
                <img src="@/assets/model1.png" alt="Modèle 1" />
                <button>Modèle 1</button>
            </div>
            <div class="model" @click="selectModel('model2')">
                <img src="@/assets/model2.png" alt="Modèle 2" />
                <button>Modèle 2</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ModelChoice",
    methods: {
        selectModel(model) {
            // Redirection vers la page de personnalisation avec le modèle sélectionné
            this.$router.push({ name: 'Customization', query: { model } });
        },
    },
};
</script>

<style scoped>
.model-choice {
    text-align: center;
    margin-top: 50px;
}

.models {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.model {
    text-align: center;
    cursor: pointer;
}

.model img {
    width: 150px;
    height: auto;
    margin-bottom: 10px;
}

.model button {
    margin-top: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}
</style>