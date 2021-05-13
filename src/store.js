import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
// import yelp from 'yelp-fusion'
import axios from 'axios'
import * as fb from './firebase'
import router from './router'

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
        longitude: '-81.5707',
        userProfile: {},
        userFavorites: []
    },
    plugins: [createPersistedState()],
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
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setUserFavorites(state, val) {
            state.userFavorites = val
        }
    },
    actions: {
        businessSearch({ commit }, params) {
            axios.get(`${corsBridge}${yelpUrl}businesses/search`, {
                headers,
                params 
                })
                .then((res) => {
                    //res returns {...businesses, region.center (latitude, longitude), total}
                    // console.log('business search results: ', res)
                    commit('setSearchResults', res.data)
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
                    console.log('categories: ', res.data.categories.filter(onlyRestaurants).map(restaurant => restaurant.title))
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
        },
        async login({ dispatch }, form) {
            // sign user in
            const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
            
            // fetch user profile and set in state
            dispatch('fetchUserProfile', user)
        },
        async signup({ dispatch }, form) {
            // sign user up
            const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

            // create user object in userCollections
            await fb.usersCollection.doc(user.uid).set({
                name: form.name,
                title: form.title,
                email: form.email
            })

            // fetch user profile and set in state
            dispatch('fetchUserProfile', user)
        },
        async fetchUserProfile({ commit }, user) {
            // fetch user profile
            const userProfile = await fb.usersCollection.doc(user.uid).get()

            // set user profile in state
            commit('setUserProfile', userProfile.data())

            // change route to dashboard
            router.push('/home')
        },
        async logout({ commit }) {
            // log user out
            await fb.auth.signOut()

            // clear user data from state
            commit('setUserProfile', {})

            // redirect to login view
            router.push('/login')
        },
        async addToFavorites({ commit }, businessObj)  {
            console.log(commit);
            await fb.favoritesCollection.add(businessObj);
        },
        async addToTrylist({ commit }, businessObj)  {
            console.log(commit);
            await fb.trylistCollection.add(businessObj);
        },
        async getFavorites({ commit }, userId) {
            let favoritesArr = []
            fb.favoritesCollection.where("userId", "==", userId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        favoritesArr.push(doc.data().yelpBusinessId)
                    });
                })
                .then(() => {
                    console.log('favoritesArr', favoritesArr)
                    commit('setUserFavorites', favoritesArr)
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            
            
        }
    }
})