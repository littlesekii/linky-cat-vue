
<script setup>
import api from "@/api/api";
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { onMounted, ref, useTemplateRef } from "vue";

import LOADING_ICON from "@/assets/icons/loading.svg";

const props = defineProps(["email"]);

const verificationCode = ref("");
const isLoading = ref(false);
const canContinue = ref(false);
const internalErrorMsg = ref("");

const inputRef = useTemplateRef("input");
const emit = defineEmits(["continue"]);

const debouncedValidate = utils.debounce(validate, 700);

onMounted(async () => {
	try {
		const body = {
			"email": props.email
		};

    const res = await api.async.post("/api/email-verification/send", JSON.stringify(body));
		
    if (!res.ok) {
      showInternalError("A unexpected error occurred");
      return false;
    }
  } catch {
    showInternalError("A internal error occurred, please try again later");
    return false;
  }

});

function showInternalError(msg) {
  internalErrorMsg.value = msg;
}

function removeInternalError() {
  internalErrorMsg.value = "";
}

function onInput(event) {
	canContinue.value = false;
	formatInput(event.target);
	debouncedValidate();
}

function formatInput(input) {
	let formattedInput = input.value;

	formattedInput = formattedInput.toUpperCase();

	formattedInput = formattedInput.replace(/[^A-Z0-9-]/g, ""); // Remove all invalid characters
	
	// Ensure only one dash at position 3
  if (formattedInput.length > 0) {
    formattedInput = formattedInput.replace(/-/g, ""); // Remove all dashes
    if (formattedInput.length > 3) {
      formattedInput = formattedInput.slice(0, 6); // Limit total chars (excluding dash)
      formattedInput = formattedInput.slice(0, 3) + "-" + formattedInput.slice(3);
    }
  }

	input.value = formattedInput;
	verificationCode.value = formattedInput;
}

function validate() {
	canContinue.value = false;

	if (!inputRef.value.validate())
		return false;

	if (!verificationCode.value.match("^[A-Z0-9]{3}-[A-Z0-9]{3}$")) {
		inputRef.value.showError("Invalid verification code");
		return false;
	}

	canContinue.value = true;
	return true;
}

async function verifyEmail() {
  try {
    removeInternalError();

		const body = {
			"email": props.email,
			"verificationCode": verificationCode.value.replace("-", "")
		};

    const res = await api.async.post("/api/email-verification/verify", JSON.stringify(body));
		
    if (!res.ok) {
      const data = await res.json();
      if (data.errorCode === "MAIL001") {
        inputRef.value.showError("Invalid verification code");
        return false;
      }
			
      showInternalError("A unexpected error occurred");
      return false;
    }
  } catch {
    showInternalError("A internal error occurred, please try again later");
    return false;
  }

	return true;
}

async function continueRegister() {
	isLoading.value = true;

  if (!canContinue.value) {
		isLoading.value = false;
		return;
	}

	if (!validate()) {
		isLoading.value = false;
		return;
	}

	if (!await verifyEmail()) {
		isLoading.value = false;
		return;
	}
		
	isLoading.value = false;
	emit("continue", "");
}

defineExpose({isLoading});

</script>

<template>
  <section class="register-container flex f-column fade-in-left-to-right" v-show="!isLoading">	
		<header class="header flex f-column">
			<h1 class="title">Verify your email</h1>
			<p class="text">We sent a email verification code to <span style="font-weight: 700;">{{ props.email }}</span>.</p>
		</header>

		<p 
			class="text internal-error-text" 
			v-if=" internalErrorMsg !== '' "
		>
			{{ internalErrorMsg }}
		</p>
    
    <form class="form flex f-column" @submit.prevent="continueRegister">
      <AuthInputComponent 
				id="verification-code"
        type="text" 
        v-model="verificationCode" 
        placeholder="Verification code" 
        ref="input" 

        @input="onInput"
      />
      <AuthInputComponent
        type="button" 
        :disabled="!canContinue"
        button-text="Verify" 
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

.loading-icon-container {
	height: 136px;
}

.register-container {
	width: 100%;

	.header {
		margin-bottom: 20px;
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