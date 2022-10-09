import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import('@/views/login'),
    component: () => import('@/views/premintbg/login'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/premintbg/dashboard'),
      meta: {title: '仪表盘', icon: 'dashboard' }
    },
    ]
  },
  {
    path: '/puser',
    component: Layout,
    redirect: '/pusers',
    children: [
      {
        path: '/pusers',
        name: 'pusers',
        meta: {title: '用户管理',icon:'eye-open'},
        component: () => import('@/views/premintbg/pusers'),
      },
    ]
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
