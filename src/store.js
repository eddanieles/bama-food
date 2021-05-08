import Vue from 'vue'
import Vuex from 'vuex'
// import yelp from 'yelp-fusion'
import axios from 'axios'

Vue.use(Vuex)

const apiKey = 'UNQpLHagw0DG9ypq_WTn6IN38XIuMLjoEDuIOHayHpL5tgtIeRgmmzVcX6azn5Up8tZOkKaIfhLmf6CYNac3XRk4jbSygt4S663HNye3uh5ULWgbcJHhJMmmAwaWYHYx'
// const client = yelp.client(apiKey)
const corsBridge = 'https://cors.bridged.cc/'
const yelpUrl = 'https://api.yelp.com/v3/'
var headers = {
    Authorization: `Bearer ${apiKey}`
}

export default new Vuex.Store({
    state: {
        Sidebar_drawer: null,
        Customizer_drawer: false,
        SidebarColor: 'white',
        SidebarBg: '',
        searchResults: {},
        latitude: '28.3772',
        longitude: '-81.5707'
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
        },
        setCoordinates(state, val) {
            state.longitude = val.longitude;
            state.latitude = val.latitude
        }
    },
    actions: {
        businessSearch({ commit }, searchRequest) {
            axios.get(`${corsBridge}${yelpUrl}businesses/search`, {
                headers,
                params: {
                    term: searchRequest.term,
                    location: searchRequest.location
                }
                })
                .then((res) => {
                    console.log('business search results: ', res.data)
                    commit('setSearchResults', res)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getCategories() {
            axios.get(`${corsBridge}${yelpUrl}categories`, {
                headers
                })
                .then((res) => {

                    function onlyRestaurants(obj) {
                        if (obj.parent_aliases.includes('restaurants') || obj.parent_aliases.includes('food')) {
                            return obj
                        }  
                    }
                    console.log('categories: ', res.data.categories.filter(onlyRestaurants))
                })
                .catch((err) => {
                    console.log(err)
                })

        },
        getLocationCoordinates({ commit }) {
            navigator.geolocation.getCurrentPosition(success);
            function success(pos) {
                var crd = pos.coords;

                // console.log('Your current position is:');
                // console.log(`Latitude : ${crd.latitude}`);
                // console.log(`Longitude: ${crd.longitude}`);
                // console.log(`More or less ${crd.accuracy} meters.`);

                commit('setCoordinates', crd)
            }
        }
            

    }
})