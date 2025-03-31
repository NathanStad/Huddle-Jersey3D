<template>
    <div class="container">
      <div class="content-card">
        <h2>Article de démonstration</h2>
        <p>
          Ceci est un exemple de contenu que vous souhaiteriez partager sur les
          réseaux sociaux ou par message.
        </p>
  
        <button class="share-btn" @click="toggleShareMenu" ref="buttonRef">
          <svg
            class="share-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Partager
        </button>
      </div>
  
      <div v-if="menuVisible" class="share-menu" :style="menuPosition">
        <div
          v-for="option in shareOptions"
          :key="option.name"
          class="share-option"
          @click="handleShareOption(option)"
        >
          <div class="option-icon" v-html="option.icon"></div>
          {{ option.name }}
        </div>
      </div>
  
      <div class="device-info">
        {{ deviceInfo }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue'
  
  const menuVisible = ref(false)
  const menuPosition = reactive({ left: '0px', top: '0px' })
  const deviceInfo = ref('Chargement des informations sur votre appareil...')
  const isMobile = ref(false)
  const buttonRef = ref(null)
  
  const shareOptions = [
    {
      name: 'Facebook',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    },
    {
      name: 'Copier le lien',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="#4285F4" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
      action: 'copyLink'
    }
  ]
  
  onMounted(() => {
    isMobile.value = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    deviceInfo.value = isMobile.value
      ? 'Appareil détecté : Mobile - API Web Share disponible'
      : 'Appareil détecté : Ordinateur - Utilisation du menu de partage personnalisé'
  
    document.addEventListener('click', closeOnClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', closeOnClickOutside)
  })
  
  const closeOnClickOutside = (e) => {
    const btn = buttonRef.value
    const menu = document.querySelector('.share-menu')
  
    if (
      menuVisible.value &&
      btn &&
      menu &&
      !btn.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      menuVisible.value = false
    }
  }
  
  const toggleShareMenu = (e) => {
    if (isMobile.value && navigator.share) {
      navigator
        .share({
          title: 'Article de démonstration',
          text: 'Regardez cet article intéressant !',
          url: window.location.href
        })
        .then(() => console.log('Partage réussi'))
        .catch((error) => console.log('Erreur de partage', error))
    } else {
      const rect = e.target.getBoundingClientRect()
      menuPosition.left = rect.left + 'px'
      menuPosition.top = rect.bottom + 5 + 'px'
      menuVisible.value = !menuVisible.value
    }
  }
  
  const handleShareOption = (option) => {
    if (option.action === 'copyLink') {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert('Lien copié !')
          menuVisible.value = false
        })
        .catch((err) => console.error('Erreur lors de la copie du lien', err))
    } else {
      console.log('Partage via', option.name)
      menuVisible.value = false
    }
  }
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .container {
    text-align: center;
    max-width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    justify-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
  }
  
  .content-card {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
  }
  
  h2 {
    margin-bottom: 15px;
    color: #333;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .share-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .share-btn:hover {
    background-color: #3367d6;
    transform: translateY(-2px);
  }
  
  .share-btn:active {
    transform: translateY(0);
  }
  
  .share-icon {
    margin-right: 8px;
    width: 18px;
    height: 18px;
  }
  
  .share-menu {
    position: absolute;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 10px 0;
    width: 200px;
    z-index: 1000;
  }
  
  .share-option {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .share-option:hover {
    background-color: #f5f5f5;
  }
  
  .option-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
  
  .device-info {
    margin-top: 30px;
    font-size: 14px;
    color: #666;
  }
  </style>
  