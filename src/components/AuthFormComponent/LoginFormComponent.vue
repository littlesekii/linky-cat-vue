<!-- eslint-disable indent -->
<script setup>
import api from "@/api/api";
import { computed, reactive, ref, useTemplateRef } from "vue";
import { RouterLink } from "vue-router";

import LOADING_ICON from "@/assets/icons/loading.svg";
import AuthInputComponent from "./AuthInputComponent.vue";

const isLoading = ref(false);
const internalErrorMsg = ref("");

const inputUsernameRef = useTemplateRef("input-username");
const inputPasswordRef = useTemplateRef("input-pw");

const userCredentials = reactive({
	username: "",
	password: ""
});

const emit = defineEmits(["login"]);

function showInternalError(msg) {
	internalErrorMsg.value = msg;
}

function removeInternalError() {
	internalErrorMsg.value = "";
}

function validate() {
	if (!inputUsernameRef.value.validate())
		return false;

	if (!inputPasswordRef.value.validate())
		return false;

	return true;
}

async function login() {

	if (!validate())
		return;
	
  const body = {
    "username": userCredentials.username,
    "password": userCredentials.password
  };

  try {
		isLoading.value = true;
		removeInternalError();

    const res = await api.async.post("/api/auth/login", JSON.stringify(body));
		const data = await res.json();
		isLoading.value = false;

    if (!res.ok) {
			if (data.errorCode === "AUTH001") {
				inputUsernameRef.value.showError("This username is not registered");
				return;
			}

			if (data.errorCode === "AUTH002") {
				userCredentials.password = "";
				inputPasswordRef.value.showError("Incorrect password");
				return;
			}
			
			showInternalError("A unexpected error occurred");
			return;
    }

		emit("login", data);

  } catch {
		isLoading.value = false;
		showInternalError("A internal error occurred, please try again later");
  }

}

</script>

<template>
	<div class="login flex f-column f-centered">
		<img class="loading-icon" :src="LOADING_ICON" alt="Loading icon" v-if="isLoading">
		<section class="login-container flex f-column" v-show="!isLoading">
			<header class="header flex f-column">
				<h1 class="title">Welcome back</h1>
				<p class="text">Log in to your account</p>
			</header>

			<p 
				class="text internal-error-text"
				v-if=" internalErrorMsg !== '' "
			>
				{{ internalErrorMsg }}
			</p>
			<form class="form flex f-column" @submit.prevent="login">

				<AuthInputComponent 
					id="username"
					type="text" 
					v-model="userCredentials.username" 
					placeholder="Username" 
					ref="input-username" 
				/>
				<AuthInputComponent 
					id="password"
					type="password" 
					v-model="userCredentials.password" 
					placeholder="Password" 
					ref="input-pw" 
				/>
				
				<AuthInputComponent
					type="button" 
					button-text="Continue" 
				/>
				<p class="text signup-link">
					Don't have a account? <RouterLink class="link" to="/register">Sign up</RouterLink>
				</p>
			</form>
		</section>
	</div>
</template>

<style scoped>
.text {
	color: var(--text-light-color);
	font-weight: lighter;
}

.loading-icon {
	height: 80px;
}

.login {
	width: 90%;
	max-width: 500px;
}

.login-container {
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

	.signup-link {
		text-align: center;
		font-size: 11pt;
		
		.link {
			color: inherit;
		}
	}
}

</style>