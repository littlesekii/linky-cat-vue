
<script setup>
import api from "@/api/api";
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { ref, useTemplateRef } from "vue";

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
    isLoading.value = true;
    removeInternalError();

		const body = {
			"username": username.value,
		};

    const res = await api.async.post("/api/auth/register/check-username", JSON.stringify(body));
    isLoading.value = false;
		
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
    isLoading.value = false;
    showInternalError("A internal error occurred, please try again later");
    return false;
  }

	canContinue.value = true;
	return true;
}

async function continueRegister() {
		
  if (!canContinue.value)
		return;

	if (!await validate(username.value))
		return;

	emit("continue", { username: username.value } );
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