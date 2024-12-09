import { createRouter, createWebHistory } from "vue-router";
import homeRoute from "@/pages/home/router";
import productRoute from "@/pages/product/router";
import sessionRoute from "@/pages/session/router";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      ...homeRoute
    },
    {
      path: "/session/:id",
      ...sessionRoute
    },
    {
      path: "/p/:id",
      ...productRoute
    },
    { path: "/:notFound(.*)", redirect: "/" },
  ],
});

export { router };
