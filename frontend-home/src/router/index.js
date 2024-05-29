import { createRouter, createWebHistory } from "vue-router";
import homeRoute from "@/pages/home/router";
import productRoute from "@/pages/product/router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      ...homeRoute
    },
    {
      path: "/p/:id",
      ...productRoute
    },
    { path: "/:notFound(.*)", redirect: "/" },
  ],
});

export { router };
