<script setup>
import { reactive, ref } from "vue";
import RegisterFormEmailComponent from "./steps/step1/RegisterFormEmailComponent.vue";
import RegisterFormUserNameComponent from "./steps/step2/RegisterFormUserNameComponent.vue";
import RegisterFormEmailVerificationComponent from "./steps/step3/RegisterFormEmailVerificationComponent.vue";
import RegisterFormPasswordComponent from "./steps/step4/RegisterFormPasswordComponent.vue";
import RegisterFormPageNameComponent from "./steps/step5/RegisterFormPageNameComponent.vue";
import api from "@/api/api";

const isLoading = ref(false);

const emit = defineEmits(["register"]);

const registerData = reactive({
	username: "",
	email: "",
	password: "",
	firstName: "",
	lastName: "",
});

const currentStep = ref(0);
const registrationSteps = [
	"email", 
	"username", 
	"email-verification",
	"password",  
	"page-name",
	"final"
];

async function register() {
	
  const body = {
    "username": registerData.username,
		"email": registerData.email,
    "password": registerData.password,
		"firstName": registerData.firstName,
		"lastName": ""
  };

  try {
		isLoading.value = true;

    const res = await api.async.post("/api/auth/register", JSON.stringify(body));
		isLoading.value = false;

    if (!res.ok) {
			const data = await res.json();
			if (data.errorCode === "AUTH003") {
				alert(data.error);
				return;
			}

			if (data.errorCode === "VAL001") {
				alert(data.error);
				return;
			}
			
			alert("A unexpected error occurred");
			return;
    }

		emit("register");

  } catch {
		isLoading.value = false;
		alert("A internal error occurred, please try again later");
  }

}

function continueRegister(data) {
	if (registrationSteps[currentStep.value] == "email") {
		registerData.email = data.email;
	}
	if (registrationSteps[currentStep.value] == "username") {
		registerData.username = data.username;
	}
	if (registrationSteps[currentStep.value] == "password") {
		registerData.password = data.password;
	}
	if (registrationSteps[currentStep.value] == "page-name") {
		registerData.firstName = data.name;
	}
	
	++currentStep.value;
	if (registrationSteps[currentStep.value] == "final") {
		register();
	}
}

function goBack() {
	if(registrationSteps[currentStep.value] == "password") {
		currentStep.value -= 2;
		return;
	}

	--currentStep.value;
}

</script>

<template>
	<div class="register flex f-column f-centered">
		<button class="button-back" @click="goBack" v-if="currentStep > 0">← Back</button>

		<RegisterFormEmailComponent 
			v-if="registrationSteps[currentStep] == 'email'" 
			@continue="continueRegister"
		/>
		<RegisterFormUserNameComponent 
			v-if="registrationSteps[currentStep] == 'username'" 
			@continue="continueRegister"
		/>
		<RegisterFormPasswordComponent
			v-if="registrationSteps[currentStep] == 'password'" 
			@continue="continueRegister"
		/>
		<RegisterFormEmailVerificationComponent
			v-if="registrationSteps[currentStep] == 'email-verification'" 
			@continue="continueRegister"

			:email="registerData.email"
		/>
		<RegisterFormPageNameComponent 
			v-if="registrationSteps[currentStep] == 'page-name'" 
			@continue="continueRegister"
		/>
	</div>

	
</template>


<style scoped>

.register {
	width: 90%;
	max-width: 500px;
}

.button-back {
	align-self: flex-start;

	width: 90px;
	padding: 10px;
	margin-left: -15px;

	margin-bottom: 10px;

	color: var(--button-color);

	font-size: 13pt;
	font-weight: 500;

	border: none;
	border-radius: 20px;
	background-color: inherit;

	cursor: pointer;
}

.button-back:hover {
	background-color: var(--color-gray-lighter);
}
</style>