<script setup>
import RegisterFormComponent from "@/components/AuthFormComponent/RegisterFormComponent/RegisterFormComponent.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function register() {
  router.push("/login");
}

</script>

<template>
  <main class="main-container flex">
    <div class="left-container flex f-centered">
      <RegisterFormComponent @register="register"/>
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