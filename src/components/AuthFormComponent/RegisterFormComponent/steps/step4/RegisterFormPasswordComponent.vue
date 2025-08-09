
<script setup>
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { ref, useTemplateRef } from "vue";

const password = ref("");
const passwordConfirmation = ref("");
const canContinue = ref(false);
const internalErrorMsg = ref("");

const inputPasswordRef = useTemplateRef("input-pw");
const inputPasswordConfirmationRef = useTemplateRef("input-pw-confirmation");
const emit = defineEmits(["continue"]);

const debouncedValidate = utils.debounce(validate, 700);

function onInput(event) {
	debouncedValidate();
}

async function validate() {
	canContinue.value = false;

  // Password validation
	if (!inputPasswordRef.value.validate())
		return false;

  if (password.value.length < 8) {
		inputPasswordRef.value.showError("Password must contain at least 8 characters");
    return false;
	}

  if (!password.value.match("[A-Z]")) {
    inputPasswordRef.value.showError("Password must contain at least one uppercase letter (A-Z)");
    return false;
  }

  if (!password.value.match("[a-z]")) {
    inputPasswordRef.value.showError("Password must contain at least one lowercase letter (a-z)");
    return false; 
  }
    
  if (!password.value.match("[0-9]")) {
    inputPasswordRef.value.showError("Password must contain at least one number");
    return false;  
  }
    
  if (!password.value.match("[!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?]")) {
    inputPasswordRef.value.showError("Password must contain at least one special character (e.g. @, ! or #)");
    return false;  
  }

  // Password confirmation validation
  if (!inputPasswordConfirmationRef.value.validate())
		return false;

  if (password.value !== passwordConfirmation.value) {
    inputPasswordConfirmationRef.value.showError("Password doesn't match");
    return false; 
  }
    
	canContinue.value = true;
  return true;  
}

async function continueRegister() {		

  if (!canContinue.value) {
		return;
	}

	if (!await validate())
		return;

	emit("continue", { password: password.value });
	
}
</script>

<template>
  <section class="register-container flex f-column fade-in-left-to-right">

		<header class="header flex f-column">
			<h1 class="title">Create a password</h1>
			<p class="text">Ensure it is strong, unique, and not used elsewhere. 🔐</p>
		</header>

		<p 
			class="text internal-error-text" 
			v-if=" internalErrorMsg !== '' "
		>
			{{ internalErrorMsg }}
		</p>
    <img class="loading-icon" :src="LOADING_ICON" alt="Loading icon" v-if="isLoading">
    <form class="form flex f-column" @submit.prevent="continueRegister" v-show="!isLoading">
      <AuthInputComponent 
        id="password"
        type="password" 
        v-model="password" 
        placeholder="Password" 
        ref="input-pw" 

        @input="onInput"
      />
      <AuthInputComponent 
        id="password-confirmation"
        type="password" 
        v-model="passwordConfirmation" 
        placeholder="Confirm Password" 
        ref="input-pw-confirmation" 

        @input="onInput"
      />
      <AuthInputComponent
        type="button" 
        :disabled="!canContinue"
        button-text="Continue" 
      />
    </form>
  </section>
</template>


<style scoped>
@keyframes fadeInLeftToRight {
	0% {
		opacity: 0;
		transform: translateX(10px); /* Start off-screen to the left */
	}
	100% {
		opacity: 1;
		transform: translateX(0); /* End at the original position */
	}
}

/* Apply the animation to the element */
.fade-in-left-to-right {
	animation: fadeInLeftToRight 0.2s ease-out forwards;
}

.text {
	color: var(--text-light-color);
	font-weight: lighter;
}

.loading-icon {
	height: 48px;
	margin-bottom: 10px;
}

.register-container {
	width: 100%;

	.header {
		margin-bottom: 30px;
		text-align: left;

		.title {
			margin-bottom: 15px;
			font-size: 34pt;
			font-weight: bold;

			line-height: 36pt;
		}
	}

	.internal-error-text {
		padding-bottom: 4px;
		padding-left: 2px;
		text-align: center;
		font-size: 11pt;
		font-weight: 500;
		color:var(--error-color);
	}

	.form {
		margin: auto;
		width: 100%;
		max-width: 500px;

		text-align: center;

		.text {
			font-size: 11pt;
			.link {
				color: inherit;
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
	}
}

</style>