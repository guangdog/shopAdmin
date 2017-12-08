import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  {
    path: '/product',
    component: Layout,
    redirect: 'noredirect',
    name: 'product',
    meta: {
      title: 'product',
      icon: 'component'
    },
    children: [
      { path: 'productList', component: _import('product/productList'), name: 'productInfo', meta: { title: 'productInfo', icon: 'component' }},
      { path: 'productUpdate/:id', component: _import('product/productUpdate'), name: 'productUpdate', meta: { title: 'productUpdate' }, hidden: true }
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'chart',
    meta: {
      title: 'chart',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'chartInfo', meta: { title: 'chartInfo', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }}
    ]
  },

  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/example/table/complex-table',
  //   name: 'order',
  //   meta: {
  //     title: 'order',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: '/example/table',
  //       component: _import('example/table/index'),
  //       redirect: '/example/table/complex-table',
  //       name: 'orderInfo',
  //       meta: {
  //         title: 'orderInfo',
  //         icon: 'table'
  //       }
  //     },
  //     { path: 'complex-table', component: _import('example/table/complexTable'), name: 'orderInfo', meta: { title: 'orderInfo' }}
  //   ]
  // },

  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    name: 'user',
    meta: {
      title: 'user',
      icon: 'user'
    },
    children: [
      { path: 'userList', component: _import('user/userList'), name: 'userInfo', meta: { title: 'userInfo', icon: 'user' }},
      { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }, hidden: true }
    ]
  },

  {
    path: '/banner',
    component: Layout,
    redirect: 'noredirect',
    name: 'banner',
    meta: {
      title: 'banner',
      icon: 'theme'
    },
    children: [
      { path: 'bannerList', component: _import('banner/bannerList'), name: 'bannerInfo', meta: { title: 'bannerInfo', icon: 'theme' }},
      { path: 'bannerUpdate/:id', component: _import('banner/bannerUpdate'), meta: { title: 'bannerUpdate' }, hidden: true }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
