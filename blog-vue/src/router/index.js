import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import LoginPage from '@/views/LoginPage.vue'
import Cookies from 'js-cookie'
import ArticlesPage from '@/views/UserPages/ArticlesPage.vue'
import AllArticles from '@/views/UserPages/AllArticles.vue'

function getUserType() {
  return Cookies.get('__userType__')
}

function routeUser(userType) {
  switch (userType) {
    case 'editor':
      return { name: 'editor' }
    case 'writer':
      return { name: 'writer' }
    default:
  }
}

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const userLoggedIn = await store.dispatch('postUsers/checkUser')

      if (userLoggedIn) {
        const userType = getUserType()
        return next(routeUser(userType))
      }
      next()
    }
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/EditorDashboard.vue'),
    children: [
      {
        path: '',
        name: 'editor-articles',
        component: ArticlesPage,
        props: true
      },
      {
        path: 'editor-all-articles',
        name: 'editor-all-articles',
        component: AllArticles,
        props: true
      }
    ],
    meta: { requiresAuth: true, requiredUserType: 'editor' }
  },
  {
    path: '/writer',
    name: 'writer',
    component: () => import('../views/WriterDashboard.vue'),
    children: [
      {
        path: '',
        name: 'articles',
        component: ArticlesPage,
        props: true
      },
      {
        path: 'all-articles',
        name: 'all-articles',
        component: AllArticles,
        props: true
      }
    ],
    meta: { requiresAuth: true, requiredUserType: 'writer' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const store = useStore()
  try {
    const userLoggedIn = await store.dispatch('postUsers/checkUser')

    if (requiresAuth && !userLoggedIn) {
      next({ name: 'login' })
    } else if (requiresAuth && userLoggedIn) {
      const requiredUserType = to.meta.requiredUserType

      if (requiredUserType == getUserType()) {
        next()
      } else next(routeUser(getUserType()))
    } else {
      next()
    }
  } catch (err) {
    console.log('Error authentication', err)
  }
})

export default router
