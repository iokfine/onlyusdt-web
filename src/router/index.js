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
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '控制中心', icon: 'dashboard' }
    },
      {
        path: '/coin',
        name: 'market',
        meta: {title: '行情推送'},
        hidden: true,
        component: () => import('@/views/strategy/coin/index'),
      },
      {
        path: '/maTrade',
        name: 'maLeverTrade',
        meta: {title: '交易策略'},
        hidden: true,
        component: () => import('@/views/strategy/maTrade'),
      }
      , {
        path: '/swapGridTrade',
        name: 'swapGridTrade',
        meta: {title: '[永续]网格策略'},
        hidden: true,
        component: () => import('@/views/strategy/swapGridTrade'),
      },
      {
        path: '/mock',
        name: 'mock',
        meta: {title: '模拟测试'},
        hidden: true,
        component: () => import('@/views/strategy/mock'),
      },
      {
        path: '/spotGridTrade',
        name: 'spotGridTrade',
        meta: {title: '[现货]网格交易'},
        hidden: true,
        component: () => import('@/views/strategy/spotGridTrade'),
      },

    ]
  },
  {
    path: '/exchange',
    component: Layout,
    redirect: '/ex',
    children: [
      {
        path: '/ex',
        name: 'exchange',
        meta: {title: '交易所',icon:'eye-open'},
        component: () => import('@/views/exchange/index'),
      },
    ]
  },
  //
  // {
  //   path: '/coin',
  //   meta: { title: 'coin' },
  //   hidden: true,
  //   component: () => import('@/views/coin/index'),
  // },

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
