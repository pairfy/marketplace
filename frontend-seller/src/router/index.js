import { createRouter, createWebHistory } from "vue-router";
import dashboardRoute from "@/pages/dashboard/router";
import entryRoute from "@/pages/entry/router";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      ...entryRoute,
    },
    {
      path: "/dashboard",
      ...dashboardRoute,
    },
    { path: "/:notFound(.*)", redirect: "/" },
  ],
});

export { router };
