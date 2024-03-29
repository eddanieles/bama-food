import Vue from 'vue'
import Router from 'vue-router'

import Layout from './layouts/Layout'
import Home from './views/Home'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Friends from './views/Friends'
import Matched from './views/Matched'
import Profile from './views/Profile'

Vue.use(Router)

const routes = [
    {
        path: '/',
        redirect: 'home',
        component: Layout,
        children: [
            {
                name: 'Home',
                path: 'home',
                component: Home
            },
            {
                name: 'Login',
                path: 'login',
                component: Login
            },
            {
                name: 'User Dashboard',
                path: 'dashboard',
                component: Dashboard,
                meta: {
                    requiresAuth: true
                }
            },
            {
                name: 'Friends',
                path: 'friends',
                component: Friends,
                meta: {
                    requiresAuth: true
                }
            },
            {
                name: 'Matched',
                path: 'friends/:id',
                component: Matched,
                meta: {
                    requiresAuth: true
                }
            },
            {
                name: 'Profile',
                path: 'profile',
                component: Profile,
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },

]

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})