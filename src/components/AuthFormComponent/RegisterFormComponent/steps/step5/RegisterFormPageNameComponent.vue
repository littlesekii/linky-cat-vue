
<script setup>
import AuthInputComponent from "@/components/AuthFormComponent/AuthInputComponent.vue";
import utils from "@/utils/utils";
import { ref, useTemplateRef } from "vue";

const name = ref("");
const canContinue = ref(false);
const internalErrorMsg = ref("");

const inputRef = useTemplateRef("input");
const emit = defineEmits(["continue"]);

const debouncedValidate = utils.debounce(validate, 700);

function onInput(event) {
	debouncedValidate();
}

async function validate() {
	canContinue.value = false;

	if (!inputRef.value.validate())
		return false;

	canContinue.value = true;
	return true;
}

async function continueRegister() {
		
  if (!canContinue.value)
		return;

	if (!await validate(name.value))
		return;

	emit("continue", { name: name.value } );
}

</script>

<template>
  <section class="register-container flex f-column fade-in-left-to-right">
		<header class="header flex f-column">
			<h1 class="title">Enter your name</h1>
			<p class="text">This name will be displayed as your page title. 🏷️</p>
		</header>

		<p 
			class="text internal-error-text" 
			v-if=" internalErrorMsg !== '' "
		>
			{{ internalErrorMsg }}
		</p>
    <form class="form flex f-column" @submit.prevent="continueRegister">
      <AuthInputComponent 
				id="name"
        type="text" 
        v-model="name" 
        placeholder="Name" 
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