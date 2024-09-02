import { createRouter, createWebHashHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";


import HelloPage from '../views/consoleHomePage.vue'
import deletePage from '../views/deletePage.vue'
import QRCodePage from '../views/QRcodePage.vue'
import infoPage from '../views/InfoPage.vue'
import listPage from '../views/listPage.vue'
import LoginView from '../views/LoginPage.vue'
import BingoPage from '../views/BingoPage.vue'
import CouponePage from '../views/couponPage.vue'
import TeamSelectPage from '../views/TeamSelectPage.vue';
import BasePage from '../views/basePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloPage,
    meta: { title: 'Home', requiresAuth: false}

  },
  {
    path: '/base',
    name: 'Base',
    component: BasePage,
    meta: { title: 'Base', requiresAuth: false}

  },
  {
    path: '/qrcode',
    name: 'qrcodeReader',
    component: QRCodePage,
    meta: { title: 'QRCodeReader', requiresAuth: false}

  },
  {
    path: '/coupon:couponId',
    name: 'coupon',
    component: CouponePage,
    props: true, 
    meta: { title: 'CouponePage', requiresAuth: false}

  },
  {
    path: '/deletePage/:reserveId',
    name: 'deletePage',
    component: deletePage,
    props: true, 
    meta: { title: '予約削除', requiresAuth: false}
  },
  {
    path: '/Info',
    name: 'infoPage',
    component: infoPage,
    meta: { title: 'チェックイン/アウト', requiresAuth: true}
  },

  {
    path: '/list',
    name: 'list',
    component: listPage,
    meta: { title: '予約者リスト', requiresAuth: false}

  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login', requiresAuth: false}

  },
  {
    path: '/bingo',
    name: 'bingo',
    component: BingoPage,
    meta: { title: 'bingo', requiresAuth: false}

  },
    {
        path: '/teamselect',
        name: 'TeamSelect',
        component: TeamSelectPage,
        meta: { title: 'チーム選択', requiresAuth: false}
     }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0
    }
  },
});

router.afterEach((to) => {
  document.title = to.meta.title + ' | reserve';
});

// 画面遷移前にログイン済みかをチェックして、未ログイン時はログイン画面に強制遷移させる
let onAuthStateChangedUnsubscribe;
router.beforeEach((to, from, next) => {
    const auth = getAuth();

    if (!to.matched.some(record => record.meta.requiresAuth)) {
        next();
    } else {
        if (auth.currentUser) {
            next();
            return;
        } else {
            if (typeof onAuthStateChangedUnsubscribe === 'function') {
                onAuthStateChangedUnsubscribe();
            }
            onAuthStateChangedUnsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    next();
                } else {
                    next({ name: 'login' });
                }
            });
        }
    }
});

export default router;
