
<script setup>
import api from "@/api/api";
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { ref, useTemplateRef } from "vue";

import LOADING_ICON from "@/assets/icons/loading.svg";

const email = ref("");
const isLoading = ref(false);
const canContinue = ref(false);
const internalErrorMsg = ref("");

const inputRef = useTemplateRef("input");
const emit = defineEmits(["continue"]);

const debouncedValidate = utils.debounce(validate, 700);

function showInternalError(msg) {
  internalErrorMsg.value = msg;
}

function removeInternalError() {
  internalErrorMsg.value = "";
}

function onInput(event) {
	debouncedValidate();
}

async function validate() {
	canContinue.value = false;

	if (!inputRef.value.validate())
		return false;

	const charRange = "A-Za-z\\u00C0-\\u017F\\u0400-\\u04FF\\u4E00-\\u9FFF\\u3040-\\u30FF"; // Latin-1 \ Cyrillic \ Chinese \ Japanese
  if (!email.value.match(`^[0-9${charRange}!#$%'*=?^_\`{}|~.\\/+-]+@[0-9${charRange}.-]+\\.[${charRange}]{2,}(?:\\.[${charRange}]{2,})?$`)) {
    inputRef.value.showError("Invalid email format");
    return false;
  }
	
	if (email.value.includes("..")) {
		inputRef.value.showError("Invalid email format");
    return false;
	}
	
	const local = email.value.split("@")[0];
	if (local.startsWith(".") || local.endsWith(".")) {
		inputRef.value.showError("Invalid email format");
    return false;
	}

	const domain = email.value.split("@")[1];
	if (domain.startsWith(".") || domain.startsWith("-")) {
		inputRef.value.showError("Invalid email format");
    return false;
	}

  // Server validation
  try {
    removeInternalError();

		const body = {
			"email": email.value,
		};

    const res = await api.async.post("/api/auth/register/check-email", JSON.stringify(body));
		
    if (!res.ok) {
      const data = await res.json();
      if (data.errorCode === "AUTH003") {
        inputRef.value.showError("This email is already registered");
        return false;
      }
			
      showInternalError("A unexpected error occurred");
      return false;
    }
  } catch {
    showInternalError("A internal error occurred, please try again later");
    return false;
  }

	canContinue.value = true;
	return true;
}

async function continueRegister() {
	isLoading.value = true;

  if (!canContinue.value) {
		isLoading.value = false;
		return;
	}

	if (!await validate(email.value)) {
		isLoading.value = false;
		return;
	}

	isLoading.value = false;
	emit("continue", { email: email.value });
}

</script>

<template>
  <section class="register-container flex f-column">
		<header class="header flex f-column">
			<h1 class="title">Join Linky Cat</h1>
			<p class="text">Create your account for free! 🐈‍⬛</p>
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
				id="email"
        type="text" 
        v-model="email" 
        placeholder="Email" 
        ref="input" 

        @input="onInput"
      />
			
      <AuthInputComponent
        type="button" 
        :disabled="!canContinue"
        button-text="Continue" 
				
      />
    </form>
		<p class="text login-link">
			Already have an account? <RouterLink class="link" to="/login">Log in</RouterLink>
		</p>
  </section>
</template>

<style scoped>
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
		margin-bottom: 20px;
		text-align: center;

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

		.input-error-text {
			padding-bottom: 2px;
			padding-left: 2px;
			text-align: left;
			font-size: 11pt;
			font-weight: 500;
			color:var(--error-color);
		}
	}

	.login-link {
		text-align: center;
		font-size: 11pt;
		
		.link {
			color: inherit;
		}
	}
}

</style>