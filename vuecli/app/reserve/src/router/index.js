// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';

import { getAuth, onAuthStateChanged } from "firebase/auth";



import HelloPage from '../views/consoleHomePage.vue'
import deletePage from '../views/deletePage.vue'
import QRCodePage from '../views/QRcodePage.vue'
import checkInOutPage from '../views/checkInOutPage.vue'
import listPage from '../views/listPage.vue'
import LoginView from '../views/LoginPage.vue'
import couponPage from '../views/couponPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloPage,
    meta: { title: 'Home', requiresAuth: false}

  },
  {
    path: '/qrcode',
    name: 'qrcodeReader',
    component: QRCodePage,
    meta: { title: 'QRCodeReader', requiresAuth: false}

  },
  {
    path: '/deletePage/:reserveId',
    name: 'deletePage',
    component: deletePage,
    props: true, 
    meta: { title: '予約削除', requiresAuth: false}
  },
  {
    path: '/checkInOutPage/:reserveId',
    name: 'checkInOutPage',
    component: checkInOutPage,
    props: true, 
    meta: { title: 'チェックイン/アウト', requiresAuth: false}
  },

  {
    path: '/list',
    name: 'list',
    component: listPage,
    meta: { title: '予約者リスト', requiresAuth: false}

  },
  {
    path: '/couponPage',
    name: 'couponPage',
    component: couponPage,
    meta: { title: 'クーポン', requiresAuth: false}

  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login', requiresAuth: false}
},

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


router.afterEach((titleString) => {
  document.title = titleString.meta.title + ' | reserve'
});

// 画面遷移前にログイン済みかをチェックして、未ログイン時はログイン画面に強制遷移させる
let onAuthStateChangedUnsubscribe
router.beforeEach((to, from, next) => {
    const auth = getAuth()

    if (!to.matched.some(record => record.meta.requiresAuth)) {
        next()
    } else {
        if (auth.currentUser) {
            next()
            return
        } else {
            if (typeof onAuthStateChangedUnsubscribe === 'function') {
                onAuthStateChangedUnsubscribe()
            }
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    next()
                } else {
                    next({ name: 'login' })
                }
            })
        }
    }
})


export default router;
