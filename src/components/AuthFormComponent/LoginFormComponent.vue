<script setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";

const emit = defineEmits(["login"]);

const userCredentials = reactive({
  username: "",
  password: ""
});

</script>

<template>
	<section class="register-container flex f-column">
		<header class="header flex f-column">
			<h1 class="title">Welcome back</h1>
			<p class="text">Log in to your account</p>
		</header>

		<form class="form flex f-column" @submit.prevent="emit('login', userCredentials)">
			<input class="input" type="text" placeholder="Username" v-model="userCredentials.username">
      		<input class="input" type="password" placeholder="Password" v-model="userCredentials.password">
			<button class="button b-inctive">Continue</button>
			<p class="text">Don't have a account? <RouterLink class="link" to="/register">Sign up</RouterLink></p>
		</form>

    {{ userCredentials }}
	</section>
</template>


<style scoped>
.text {
	color: var(--text-color-light);
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

		.input, .button {
			margin-bottom: 10px;

			padding: 12px 15px;	
			font-size: 12pt;
		}

		.input {
			border: none;
			/* border: 1.5px solid var(--text-color-light); */
			border-radius: 10px;
			font-size: 11pt;

			background-color: var(--color-gray-lighter);
			color: var(--color-black);
		}

		.input::placeholder {
			color: var(--color-gray-dark);
		}

		.button {
      /* margin-top: 15px; */
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

		.text {
			font-size: 11pt;

			.link {
				color: inherit;
			}
		}
	}
}
</style>