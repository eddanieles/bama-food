import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: 'home',
            component: () => import('@/layouts/Layout'),
            children: [
                // Components
                {
                    name: 'Home',
                    path: 'home',
                    component: () => import('@/views/Home'),
                },
                {
                    name: 'Login',
                    path: 'login',
                    component: () => import('@/views/Login'),
                },
                {
                    name: 'User Dashboard',
                    path: 'dashboard',
                    component: () => import('@/views/Dashboard'),
                },
                {
                    name: 'Friends',
                    path: 'friends',
                    component: () => import('@/views/Friends'),
                },
                {
                    name: 'Matched',
                    path: 'friends/:id',
                    component: () => import('@/views/Matched'),
                },
                {
                    name: 'Profile',
                    path: 'profile',
                    component: () => import('@/views/Profile'),
                }
            ]
        },

    ],
})