
<script setup>
import api from "@/api/api";
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { ref, useTemplateRef } from "vue";

import LOADING_ICON from "@/assets/icons/loading.svg";

const username = ref("");
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

	if (username.value.length > 32) {
		inputRef.value.showError("Username length can't be over 32 characters");
    return false;	
	}

  if (username.value.match("[^A-Za-z0-9._]")) {
    inputRef.value.showError("Username can only contain letters (A-Z, a-z), numbers, underscores, and periods");
    return false;
  }

	if (!username.value.match("[A-Za-z0-9]")) {
    inputRef.value.showError("Username must contain at least one letter (A-Z, a-z) or number");
    return false;
  }

	if (username.value.includes("..")) {
    inputRef.value.showError("Username can't contain more than one period in a row");
    return false;
  }

	if (username.value.startsWith(".") || username.value.endsWith(".")) {
		inputRef.value.showError("Username can't start or end with a period");
    return false;
	}

  // Server validation
  try {
    removeInternalError();

		const body = {
			"username": username.value,
		};

    const res = await api.async.post("/api/auth/register/check-username", JSON.stringify(body));
		
    if (!res.ok) {
      const data = await res.json();
      if (data.errorCode === "AUTH003") {
        inputRef.value.showError("This username is already taken");
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

	if (!await validate(username.value)) {
		isLoading.value = false;
		return;
	}

	isLoading.value = false;
	emit("continue", { username: username.value } );
}

</script>

<template>
  <section class="register-container flex f-column fade-in-left-to-right">

		<header class="header flex f-column">
			<h1 class="title">Choose your username</h1>
			<p class="text">This is how people find your page! ✨</p>
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
				id="username"
        type="text" 
        v-model="username" 
        placeholder="linky.cat/" 
				ph-fixed="true"
        ref="input" 

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