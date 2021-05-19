import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './plugins/base'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/scss/app.scss'


Vue.config.productionTip = false

Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

router.beforeEach((to, from, next) => {
    auth.onAuthStateChanged(function(user) {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        if (!requiresAuth) {
            next()
        } else if (requiresAuth && user) {
            next()
        } else {
            next("/login");
        }
    });
});

new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')
