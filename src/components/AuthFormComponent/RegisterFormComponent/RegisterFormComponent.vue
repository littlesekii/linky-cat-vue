<script setup>
import { reactive, ref } from "vue";
import RegisterFormEmailComponent from "./steps/step1/RegisterFormEmailComponent.vue";
import RegisterFormUserNameComponent from "./steps/step2/RegisterFormUserNameComponent.vue";
import RegisterFormEmailVerificationComponent from "./steps/step3/RegisterFormEmailVerificationComponent.vue";
import RegisterFormPasswordComponent from "./steps/step4/RegisterFormPasswordComponent.vue";
import RegisterFormPageNameComponent from "./steps/step5/RegisterFormPageNameComponent.vue";

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
	"page-name"
];

function continueRegister(data) {
	if (registrationSteps[currentStep.value] == "email") {
		registerData.email = data.email;
	}
	if (registrationSteps[currentStep.value] == "username") {
		registerData.username = data.username;
	}

	++currentStep.value;
}

</script>

<template>
	<!-- <div class="flex f-column f-centered"> -->
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
		/>
		<RegisterFormPageNameComponent 
			v-if="registrationSteps[currentStep] == 'page-name'" 
			@continue="continueRegister"
		/>
		<!-- <br>
		{{ registerData }}
	</div> -->

	
</template>


<style scoped>

</style>