<!-- eslint-disable indent -->
<script setup>
import { computed, reactive } from "vue";
import { RouterLink } from "vue-router";

const emit = defineEmits(["login"]);

const labelMovedPlaceholderUsernameClass = computed(() => {
  return userCredentials.username.length > 0 || inputFocused.username ? "label-placeholder-moved" : "";
});

const labelMovedPlaceholderPasswordClass = computed(() => {
  return userCredentials.password.length > 0 || inputFocused.password ? "label-placeholder-moved" : "";
});

const inputError = reactive({
  username: false,
  password: false
});

const inputFocused = reactive({
  username: false,
  password: false
});

const userCredentials = reactive({
  username: "",
  password: ""
});

function login() {
	
	if (!validateFields())
		return;
	
	emit("login", userCredentials);
}

function validateFields() {

	removeFieldError("username");
	removeFieldError("password");

	if (userCredentials.username.trim() === "") {
		document.querySelector("#ig-username").classList.add("input-error");
		document.querySelector("#ig-username").classList.add("shake-animation");	
		inputError.username = true;
		return false;
	}
	
	if (userCredentials.password.trim() === "") {
		document.querySelector("#ig-password").classList.add("input-error");
		document.querySelector("#ig-password").classList.add("shake-animation");
		inputError.password = true;
		return false;
	}

	return true;
}

function removeFieldError(field) {

	if (field == "username") {
		document.querySelector("#ig-username").classList.remove("input-error");
		document.querySelector("#ig-username").classList.remove("shake-animation");
		inputError.username = false;
	}
	if (field == "password") {
		document.querySelector("#ig-password").classList.remove("input-error");
		document.querySelector("#ig-password").classList.remove("shake-animation");
		inputError.password = false;
	}
}

</script>

<template>
	<section class="register-container flex f-column">
		<header class="header flex f-column">
			<h1 class="title">Welcome back</h1>
			<p class="text">Log in to your account</p>
		</header>

		<form class="form flex f-column" @submit.prevent="login">
			<p 
				class="text input-error-text" 
				id="input-username-error-text"
				v-if="inputError.username"
			>
				Please fill out this field
			</p>
			<div class="input-group flex f-column" id="ig-username">
				<label 
					class="label-placeholder" 
					:class="labelMovedPlaceholderUsernameClass" 
					for="input-username"
				>
					Username
				</label>
				<input 
					class="input" 
					id="input-username" 
					type="text" 
					placeholder=" " 
					@keydown="removeFieldError('username')"
					@focusin="inputFocused.username = true" 
					@focusout="inputFocused.username = false" 
					v-model="userCredentials.username"
				>
				
			</div>
			<p 
				class="text input-error-text" 
				id="input-password-error-text"
				v-if="inputError.password"
			>
				Please fill out this field
			</p>
			<div class="input-group flex f-column" id="ig-password">				
				<label 
					class="label-placeholder" 
					:class="labelMovedPlaceholderPasswordClass" 
					for="input-password"
				>
					Password
				</label>
				<input 
					class="input input-error" 
					id="input-password" 
					type="password" 
					placeholder=" " 
					@keydown="removeFieldError('password')"
					@focusin="inputFocused.password = true" 
					@focusout="inputFocused.password = false" 
					v-model="userCredentials.password"
				>
				
			</div>
			<div class="input-group flex f-column">
				
				<button class="button">Login</button>
			</div>
			<p class="text">Don't have a account? <RouterLink class="link" to="/register">Sign up</RouterLink></p>
		</form>
	</section>
</template>


<style scoped>

.shake-animation {
    animation: shake 0.4s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
}

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

	.form {
		margin: auto;
		width: 100%;
		max-width: 500px;

		text-align: center;

		.input-group {
			width: 100%;
			margin-bottom: 10px;

			.input, .button {
				padding: 14px 15px;	
				font-size: 12pt;
			}

			.label-placeholder {
				font-size: 11pt;
				position: absolute;
				padding-left: 15px;
				padding-top: 13px;

				cursor: text;
				color: var(--color-gray-dark);

				transition: padding 0.2s, font-size 0.2s;
				user-select: none;
				-moz-user-select: none;
			}

			.label-placeholder-moved {
				padding-top: 6px;
				font-size: 9pt;
			}

			.input {
				padding-top: 22px;
				padding-bottom: 6px;

				border: none;
				/* border: 1.5px solid var(--text-color-light); */
				border-radius: 10px;
				font-size: 11pt;

				background-color: var(--color-gray-lighter);
				color: var(--color-black);
			}


			.button {
				border: none;
				border-radius: 25px;

				background-color: var(--button-color);
				color: var(--color-white);
				
				font-weight: bold;

				cursor: pointer;
			}

			.b-inactive {
				background-color: var(--color-gray-light);
				color: var(--color-black-light);
			}

		}

		.input-error {
				.input {
					box-shadow: inset 0 0 0 2px var(--error-color);
				}
				.label-placeholder {
					color: var(--error-color);
				}
			}

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