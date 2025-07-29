<script setup>
import api from "@/api/api";
import LoginFormComponent from "@/components/AuthFormComponent/LoginFormComponent.vue";

async function login(userCredentials) {

  const body = {
    "username": userCredentials.username,
    "password": userCredentials.password
  };

  const res = await api.async.post("/api/auth/login", JSON.stringify(body));

  if (res.ok) {
    console.log(res);
    console.log(res.text);
  } else {
    const data = await res.json();
    alert(`${data.error}:\n${data.message}.`);
  }



}

</script>

<template>
  <main class="main-container flex">
    <div class="left-container flex f-centered">
      <LoginFormComponent @login="login"/>
    </div>
    <aside class="right-container">
      
    </aside>
  </main>
</template>

<style scoped>
.main-container {
  min-height: 100dvh;

  .left-container {
    flex: 1;
  }
  .right-container {
    flex: 1;

    background-image: url("https://assets.production.linktr.ee/auth/3448/media/banner-login-desktop.f355be949b508c58ec2d.webp");
    background-size: cover;
    background-position: center;
  }

  @media (max-width: 800px) {
    .right-container {
      display: none;
    }
  }
}




</style>