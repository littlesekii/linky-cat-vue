
<script setup>
import api from "@/api/api";
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { onMounted, ref, useTemplateRef } from "vue";

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
    isLoading.value = false;
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
    isLoading.value = true;
    removeInternalError();

		const body = {
			"email": props.email,
			"verificationCode": verificationCode.value.replace("-", "")
		};

    const res = await api.async.post("/api/email-verification/verify", JSON.stringify(body));
    isLoading.value = false;
		
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
    isLoading.value = false;
    showInternalError("A internal error occurred, please try again later");
    return false;
  }

	return true;
}

async function continueRegister() {
		
  if (!canContinue.value)
		return;

	if (!validate())
		return;

	if (!await verifyEmail())
		return;

	emit("continue", "");
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