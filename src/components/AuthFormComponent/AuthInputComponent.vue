<script setup>
import { computed, ref } from "vue";

const props = defineProps([
  "type", 
  "placeholder",
  "phFixed",
  "modelValue",
  "buttonText",
  "disabled"
]);
const emit = defineEmits(["update:modelValue", "input"]);

const hasFocus = ref(false);
const inputErrorMsg = ref("");

const placeholderFixed = computed(() => {
  return props.phFixed ? "placeholder-fixed-input" : "";
});

const placeholderMoved = computed(() => {
  return !props.phFixed && (props.modelValue.length > 0 || hasFocus.value) ? "placeholder-moved" : "";
});

function updateModelValue(event) {
  emit("update:modelValue", event.target.value);
  emit("input");
}

function validate() {

  const errorMsg = "Please fill out this field";

  if (props.modelValue === "") {
    showError(errorMsg);
    return false;
  }

  return true;
}

function showError(msg) {
  document.querySelector("#input-group").classList.add("input-group-error");
  document.querySelector("#input-group").classList.add("shake-animation");	
  inputErrorMsg.value = msg;
}

function removeError() {
  document.querySelector("#input-group").classList.remove("input-group-error");
  document.querySelector("#input-group").classList.remove("shake-animation");
  inputErrorMsg.value = "";
}

defineExpose({
  validate,
  showError
});

</script>

<template>

  <!-- Input -->
  <div class="auth-input-component" v-if="type !== 'button'">
    <p 
      class="text input-error-text" 
    >
      {{ inputErrorMsg }}
    </p>
    <div class="input-group flex f-column" id="input-group">      
      <label 
        class="placeholder" 
        :class="placeholderMoved"
        for="input"
      >
        {{ props.placeholder }}
      </label>
      <input 
        class="input" 
        :class="placeholderFixed"
        id="input" 
        placeholder=" " 
        :type="props.type"
        :value="props.modelValue"       

        @focusin="hasFocus = true" 
        @focusout="hasFocus = false" 
        @keydown="e => {if (e.key !== 'Enter') { removeError(); }}"
        @input="updateModelValue"        
      >
    </div>
  </div>

  <!-- Button -->
  <div class="auth-input-component" v-if="type === 'button'">
    <div class="input-group flex f-column">      
      <button class="button" :disabled="props.disabled">{{ props.buttonText }}</button>
    </div>
  </div>
</template>

<style scoped>

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
}

.shake-animation {
  animation: shake 0.4s ease-in-out;
}

.input-group {
  width: 100%;
  margin-bottom: 10px;

  .input, .button {
    padding: 14px 15px;	
    font-size: 12pt;
  }

  .placeholder {
    font-size: 11pt;
    position: absolute;
    padding-left: 15px;
    padding-top: 14px;

    cursor: text;
    color: var(--color-gray-dark);

    transition: padding 0.2s, font-size 0.2s;
    user-select: none;
    -moz-user-select: none;
  }

  .placeholder-moved {
    padding-top: 6px;
    font-size: 9pt;
  }

  .input {
    padding-top: 22px;
    padding-bottom: 6px;

    border: none;
    border-radius: 10px;
    font-size: 11pt;

    background-color: var(--color-gray-lighter);
    color: var(--color-black);
  }

  .placeholder-fixed-input {
    padding: 14px 15px;	
    padding-left: 77px;
  }

  .button {
    border: none;
    border-radius: 25px;

    background-color: var(--button-color);
    color: var(--color-white);
    
    font-weight: bold;

    cursor: pointer;
  }

  .button:disabled {
    background-color: var(--color-gray-light);
		color: var(--color-black-light);

    cursor: default;
  }
}

.input-error-text {
  padding-bottom: 2px;
  padding-left: 2px;
  text-align: left;
  font-size: 11pt;
  font-weight: 500;
  color:var(--error-color);
}

.input-group-error {
  .input {
    box-shadow: inset 0 0 0 2px var(--error-color);
  }
  .placeholder {
    color: var(--error-color);
  }
}

</style>