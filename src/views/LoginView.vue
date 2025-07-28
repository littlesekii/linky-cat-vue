<script setup>
import LoginFormComponent from "@/components/AuthFormComponent/LoginFormComponent.vue";
</script>

<template>
  <main class="main-container flex">
    <div class="left-container flex f-centered">
      <LoginFormComponent/>
    </div>
    <aside class="right-container">
      
    </aside>
  </main>
</template>

<style scoped>
.main-container {
  min-height: 100dvh;
}

.left-container {
  flex: 1;
}
.right-container {
  flex: 1;

  background-image: url("https://assets.production.linktr.ee/auth/3448/media/banner-login-desktop.f355be949b508c58ec2d.webp");
  background-size: cover;
  background-position: center;
}
</style>