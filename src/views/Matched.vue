<template>
  <div>
        <user-card :user="this.friend" />

        <hr>
        <p>{{this.matchedCuisines.length}} matched cuisine(s) from most in the mood for, to least: </p>

        <div v-if="this.matchedCuisines[0]">
            <div v-for="cuisine in this.matchedCuisines" :key="cuisine.index">
                <v-icon v-b-toggle="`collapse-${cuisine.index}`">mdi-format-list-bulleted-square</v-icon>
                <big><span class="text-uppercase">{{cuisine.cuisineObj.title}}: </span></big>
                <b-collapse :id="`collapse-${cuisine.index}`" class="mt-2">
                    <button class="btn btn-success" @click="_self.getMatch(cuisine.cuisineObj.alias, 'favorites')">Get from Favorites</button> | 
                    <button class="btn btn-primary" @click="_self.getMatch(cuisine.cuisineObj.alias, 'trylist')">Get from Trylist</button> | 
                    <button class="btn btn-secondary" @click="_self.getNearby(cuisine.cuisineObj.alias)">Get from Nearby</button>
                </b-collapse>
            </div>
            
        </div>

        <div v-else>
            <big><span>You have 0 matched cuisines with {{this.friend.firstName}}.</span></big>
            <div>Select from {{this.friend.firstName}} {{this.friend.lastName}} perference's:</div>
            <div v-for="cuisine in this.friend.inMoodFor" :key="cuisine.alias">
                <v-icon v-b-toggle="`collapse-${cuisine.alias}`">mdi-format-list-bulleted-square</v-icon>
                <big><span class="text-uppercase">{{cuisine.title}}: </span></big>
                <b-collapse :id="`collapse-${cuisine.alias}`" class="mt-2">
                    <button class="btn btn-success" @click="_self.getMatch(cuisine.alias, 'favorites')">Get from Favorites</button> | 
                    <button class="btn btn-primary" @click="_self.getMatch(cuisine.alias, 'trylist')">Get from Trylist</button> | 
                    <button class="btn btn-secondary" @click="_self.getNearby(cuisine.alias)">Get from Nearby</button>
                </b-collapse>
            </div>
        </div>

        <hr>
        <div v-if="this.selectedFavorite">
            <div v-if="this.selectedFavorite.name">
                <p>{{this.matchedHelperText}}</p>
                <business-card :business="this.selectedFavorite" />
            </div>
            <div v-else>
                {{this.selectedFavorite}}
            </div>
        </div>
  </div>
</template>

<script>

import { usersCollection, favoritesCollection, trylistCollection } from '../firebase'
import _ from 'underscore'
import json from '../components/categories.json'
import UserCard from '../components/UserCard.vue'
import BusinessCard from '../components/BusinessCard.vue'

export default {
  components: { UserCard, BusinessCard },
    data() {
        return {
            friend: {},
            matchedCuisines: [],
            selectedFavorite: false,
            matchedHelperText: ""
        }
    },
    methods: {
        async getMatch(cuisine, list) {
            if (list == 'favorites') {
                var stateList = this.$store.state.userFavorites;
                var collection = favoritesCollection;
            } else if (list == 'trylist') {
                stateList = this.$store.state.userTrylist;
                collection = trylistCollection;
            }
            var myFilteredFavorites = stateList.filter(favorite => {
                    if (_.contains(favorite.categories.map(category => category.alias), cuisine)) {
                        return favorite;
                    }
                });

            var categoryObject = _.find(json.categories, category => {
                return category.alias === cuisine;
            })

            var friendFilteredFavorites = [];
            await collection.where("userId", "==", this.friend.id).where("categories", "array-contains", categoryObject)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            friendFilteredFavorites.push(doc.data())
                        });
                    });
                        
            var matches = _.intersection(myFilteredFavorites.map(favorite => favorite.yelpBusinessId), friendFilteredFavorites.map(favorite => favorite.yelpBusinessId));
            
            if (matches.length > 1) {
                var matchedFavorites = myFilteredFavorites.filter(favorite => {
                    if (_.contains(matches, favorite.yelpBusinessId)) {
                        return favorite;
                    }
                }) 

                let index = _.random(0, matches.length - 1);

                this.matchedHelperText = `There are ${matches.length} matches for ${categoryObject.title.toLowerCase()} between your ${list} and your friend's ${list}`;
                this.selectedFavorite = matchedFavorites[index];
            }
            else if (matches.length === 1) {
                myFilteredFavorites.filter(favorite => {
                    if (favorite.yelpBusinessId === matches[0]) {
                        this.matchedHelperText = `There are ${matches.length} matches for ${categoryObject.title.toLowerCase()} between your ${list} and your friend's ${list}`;
                        this.selectedFavorite = favorite;
                    }
                }) 
            }
            else {
                this.selectedFavorite = `There are 0 matches for ${categoryObject.title.toLowerCase()} between your ${list} and your friend's ${list}.`;
            }
        },
        getNearby(cuisine) {
            let that = this;
            
            let searchTerms = {
                latitude: this.$store.state.latitude,
                longitude: this.$store.state.longitude,
                radius: 5000,
                term: cuisine
            };

            this.$store.dispatch('businessSearch', searchTerms)
                .then(() => {

                    var categoryObject = _.find(json.categories, category => {
                        return category.alias === cuisine;
                    })
                    that.matchedHelperText = `There are ${that.$store.state.searchResults.total} ${categoryObject.title.toLowerCase()} restaurants within three miles.`;

                    if (that.$store.state.searchResults.total == 0) {
                        that.selectedFavorite = `No results for ${categoryObject.title.toLowerCase()} within 3 miles`;
                    } else {
                        let index = _.random(0, that.$store.state.searchResults.businesses.length - 1);
                        that.selectedFavorite = that.$store.state.searchResults.businesses[index];
                    }
                })
        }
    },
    beforeCreate() {
        this.$store.dispatch('getFavorites', this.$store.state.userProfile.id);
        this.$store.dispatch('getTryList', this.$store.state.userProfile.id);

        let that = this;

        usersCollection.doc(this.$route.params.id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    that.friend = doc.data();
                    that.friend.id = doc.id;

                    let obj = {
                        me: that.$store.state.userProfile.inMoodFor.map(cuisine => cuisine.alias),
                        friend: that.friend.inMoodFor.map(cuisine => cuisine.alias)
                    }
                    
                    let matches = _.intersection(obj.me, obj.friend);

                    if (matches[0]) {
                        let arr = [];
                        matches.map(cuisine => {
                            var cuisineObj = _.find(that.friend.inMoodFor, category => {
                                return category.alias === cuisine;
                            });
                            let index =  _.indexOf(obj.friend, cuisine);
                            arr.push({
                                index,
                                cuisineObj
                            });
                        });

                        arr.sort(function(a, b) {
                            return a.index - b.index;
                        });

                        that.matchedCuisines = arr;
                    } 
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }
}
</script>

<style>

</style>