<template>
    <div v-show="visible" class="keyboard-container">
      <div class="simple-keyboard" ref="keyboardContainer"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import Keyboard from 'simple-keyboard'
  import 'simple-keyboard/build/css/index.css'
  
  const props = defineProps({
    targetInput: HTMLInputElement,
    visible: Boolean,
  })
  
  const emit = defineEmits(['update:visible'])
  
  const keyboardInstance = ref(null)
  const keyboardContainer = ref(null)
  const isShifted = ref(false)
  
  function updateValueInVueModel(inputEl, newValue) {
    const key = inputEl.dataset.key
    if (key) {
      const evt = new CustomEvent('update:model-value', {
        detail: { key, value: newValue }
      })
      inputEl.dispatchEvent(evt)
    }
  }
  
  function toggleShift() {
    isShifted.value = !isShifted.value
    const layoutName = isShifted.value ? 'shift' : 'default'
    keyboardInstance.value?.setOptions({ layoutName })
  }
  
  onMounted(() => {
    nextTick(() => {
      keyboardInstance.value = new Keyboard(keyboardContainer.value, {
        onChange: input => {
          if (props.targetInput) {
            props.targetInput.value = input
            props.targetInput.dispatchEvent(new Event('input'))
            updateValueInVueModel(props.targetInput, input)
          }
        },
        onKeyPress: button => {
          if (button === '{enter}') {
            emit('update:visible', false)
          } else if (button === '{bksp}') {
            if (props.targetInput) {
              const newVal = props.targetInput.value.slice(0, -1)
              props.targetInput.value = newVal
              props.targetInput.dispatchEvent(new Event('input'))
              updateValueInVueModel(props.targetInput, newVal)
              keyboardInstance.value.setInput?.(newVal)
            }
          } else if (button === '{shift}') {
            toggleShift()
          }
        },
        layout: {
          default: [
            '0 1 2 3 4 5 6 7 8 9',
            'q w e r t y u i o p é è',
            'a s d f g h j k l ü à',
            'z x c v b n m ä ö . ç',
            '{shift} @ _ - {bksp} {enter}',
            '{space}'
          ],
          shift: [
            '+ ! * % & / ( ) = ?',
            'Q W E R T Y U I O P É È',
            'A S D F G H J K L Ü À',
            'Z X C V B N M Ä Ö . Ç',
            '{shift} @ _ - {bksp} {enter}',
            '{space}'
          ]
        },
        display: {
          '{bksp}': '⌫',
          '{enter}': 'Finish',
          '{space}': '␣',
          '{shift}': '⇧'
        }
      })
    })
  })
  
  watch(() => props.targetInput, (newInput) => {
    if (newInput && keyboardInstance.value?.setInput) {
      keyboardInstance.value.setInput(newInput.value || '')
    }
  })
  
  watch(() => props.visible, (isVisible) => {
    if (isVisible && props.targetInput && keyboardInstance.value?.setInput) {
      keyboardInstance.value.setInput(props.targetInput.value || '')
    }
  })
  </script>
  
  <style scoped>
  .keyboard-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;
    z-index: 999;
    padding: 10px;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
  }
  </style>
  