import Vue from 'vue'
import Vuex from 'vuex'
// import yelp from 'yelp-fusion'
import axios from 'axios'

Vue.use(Vuex)

const apiKey = 'UNQpLHagw0DG9ypq_WTn6IN38XIuMLjoEDuIOHayHpL5tgtIeRgmmzVcX6azn5Up8tZOkKaIfhLmf6CYNac3XRk4jbSygt4S663HNye3uh5ULWgbcJHhJMmmAwaWYHYx'
// const client = yelp.client(apiKey)

export default new Vuex.Store({
    state: {
        Sidebar_drawer: null,
        Customizer_drawer: false,
        SidebarColor: 'white',
        SidebarBg: '',
        searchResults: {}
      },
    mutations: {
        SET_SIDEBAR_DRAWER (state, payload) {
            state.Sidebar_drawer = payload
        },
        SET_CUSTOMIZER_DRAWER (state, payload) {
            state.Customizer_drawer = payload
        },
        SET_SIDEBAR_COLOR (state, payload) {
            state.SidebarColor = payload
        }, 
        setSearchResults(state, val) {
            state.searchResults = val
        }
    },
    actions: {
        search({ commit }, searchRequest) {
            axios.get(`https://cors.bridged.cc/https://api.yelp.com/v3/businesses/search`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                },
                params: {
                    term: searchRequest.term,
                    location: searchRequest.location
                }
                })
                .then((res) => {
                    console.log(res)
                    commit('setSearchResults', res)
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }
})