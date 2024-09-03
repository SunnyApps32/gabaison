import { createRouter, createWebHashHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import HomePage from "../views/HomePage.vue";
import QRCodePage from "../views/QRcodePage.vue";
import infoPage from "../views/InfoPage.vue";
import LoginView from "../views/LoginPage.vue";
import CouponePage from "../views/couponPage.vue";
import TeamSelectPage from "../views/TeamSelectPage.vue";
import PlayerGalleryPage from "../views/PlayerGalleryPage.vue";
import BasePage from "../views/basePage.vue";
import CouponList from "../views/couponListPage.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
  {

    path: "/",
    component: MainLayout, // すべてのページを共通レイアウトでラップ
    children: [
      {
        path: "/",
        name: "Home",
        component: HomePage,
        meta: { title: "home", requiresAuth: true },
      },
      {
        path: "/base",
        name: "Base",
        component: BasePage,
        meta: { title: "Base", requiresAuth: true },
      },
      {
        path: "qrcode",
        name: "qrcodeReader",
        component: QRCodePage,
        meta: { title: "QRCodeReader", requiresAuth: true },
      },
      {
        path: "/coupon:couponId",
        name: "coupon",
        component: CouponePage,
        props: true,
        meta: { title: "CouponePage", requiresAuth: true },
      },
      {
        path: "/Info",
        name: "infoPage",
        component: infoPage,
        meta: { title: "ユーザ情報", requiresAuth: true },
      },
      {
        path: "/teamselect",
        name: "TeamSelect",
        component: TeamSelectPage,
        meta: { title: "チーム選択", requiresAuth: true },
      },
      {
        path: "/playergallery",
        name: "PlayerGallery",
        component: PlayerGalleryPage,
        meta: { title: "選手データ", requiresAuth: false },
      },
      {
        path: "/couponlist",
        name: "CouponList",
        component: CouponList,
        meta: { title: "クーポン一覧", requiresAuth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { title: "Login", requiresAuth: false },
  },
];




const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

router.afterEach((to) => {
  document.title = to.meta.title + " | reserve";
});

// 画面遷移前にログイン済みかをチェックして、未ログイン時はログイン画面に強制遷移させる
let onAuthStateChangedUnsubscribe;
router.beforeEach((to, from, next) => {
  const auth = getAuth();

  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
  } else {
    if (auth.currentUser) {
      next();
      return;
    } else {
      if (typeof onAuthStateChangedUnsubscribe === "function") {
        onAuthStateChangedUnsubscribe();
      }
      onAuthStateChangedUnsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          next();
        } else {
          next({ name: "login" });
        }
      });
    }
  }
});

export default router;
