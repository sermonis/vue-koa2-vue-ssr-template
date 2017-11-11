import Vue from 'vue'
import {sync} from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import {createStore} from './store'
import {createRouter} from './router'
import authMixin from './mixins/auth'
import titleMixin from './mixins/title'
import adaptiveMixin from './mixins/adaptive'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: Vue.config.lang
})

Vue.mixin(titleMixin)

export function createApp() {
    const router = createRouter()
    const store = createStore()

    router.beforeEach((to, from, next) => {
        i18n.locale = to.params.lang || 'ru'
        Vue.config.lang = i18n.locale
        next()
    })

    sync(store, router)

    const app = new Vue({
        mixins: [authMixin, adaptiveMixin],
        computed: {
            langUrl() {
                return `/${this.$i18n.locale}`
            },
            langUkOnly() {
                return this.$i18n.locale === 'uk' ? '/uk/' : '/'
            }
        },
        i18n,
        router,
        store,
        render: h => h(App)
    })

    return {app, router, store, i18n}
}
