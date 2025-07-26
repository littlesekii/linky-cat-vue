import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/MainView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    // {
    //   path: '/another',
    //   name: 'another',
    //   // route level code-splitting
    //   // this generates a separate chunk (AnotherView.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AnotherView.vue'),
    // },
  ],
});

export default router;
