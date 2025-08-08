
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
		
  if (!canContinue.value)
		return;

	if (!await validate())
		return;

	emit("continue", { password: password.value });
	
}

</script>

<template>
  <section class="register-container flex f-column">
		<header class="header flex f-column">
			<h1 class="title">Join Linky Cat</h1>
			<p class="text">Create your account for free!</p>
		</header>

		<p 
			class="text internal-error-text" 
			v-if=" internalErrorMsg !== '' "
		>
			{{ internalErrorMsg }}
		</p>
    <form class="form flex f-column" @submit.prevent="continueRegister">
      <AuthInputComponent 
        id="password"
        type="password" 
        v-model="password" 
        placeholder="Password" 
        ref="input-pw" 

        @input="debouncedValidate"
      />
      <AuthInputComponent 
        id="password-confirmation"
        type="password" 
        v-model="passwordConfirmation" 
        placeholder="Confirm Password" 
        ref="input-pw-confirmation" 

        @input="debouncedValidate"
      />
      <AuthInputComponent
        type="button" 
        :disabled="!canContinue"
        button-text="Continue" 
      />
      <p class="text">
        Already have an account? <RouterLink class="link" to="/login">Log in</RouterLink>
      </p>
    </form>
  </section>
</template>

<style scoped>
.text {
	color: var(--text-light-color);
	font-weight: lighter;
}

.register-container {
	width: 90%;

	.header {
		margin-bottom: 30px;
		text-align: center;

		.title {
			margin-bottom: 15px;
			font-size: 34pt;
			font-weight: bold;
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