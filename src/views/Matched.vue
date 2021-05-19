<template>
  <div>
        <user-card :user="this.friend" />
        <p>Matched Cuisine(s) from most in the mood for, to least: </p>

        <div v-if="this.matchedCuisines[0]">
            <div v-for="cuisine in this.matchedCuisines" :key="cuisine.index">
                <v-icon v-b-toggle="`collapse-${cuisine.index}`">mdi-format-list-bulleted-square</v-icon>
                <big><span class="text-uppercase">{{cuisine.cuisineObj.title}}: </span></big>
                <b-collapse :id="`collapse-${cuisine.index}`" class="mt-2">
                    <button class="btn btn-success" @click="_self.getFavorites(cuisine)">Get from Favorites</button>
                    <button class="btn btn-primary">Get from Trylist</button>
                    <button class="btn btn-secondary">Get from Nearby</button>
                </b-collapse>
            </div>

            <div>
                {{_self.matchedFavorites[0] ? _self.matchedFavorites : ""}}
            </div>
        </div>

        <div v-else>
            <big><span>You have 0 matched cuisines with {{this.friend.firstName}}.</span></big>
        </div>
  </div>
</template>

<script>

import { usersCollection, favoritesCollection } from '../firebase'
import _ from 'underscore'
// import json from '../components/categories.json'
import UserCard from '../components/UserCard.vue'

export default {
  components: { UserCard },
    data() {
        return {
            friend: {},
            matchedCuisines: [],
            matchedFavorites: []
        }
    },
    methods: {
        async getFavorites(cuisine) {
            var myFilteredFavorites = this.$store.state.userFavorites.filter(favorite => {
                    if (_.contains(favorite.categories.map(category => category.alias), cuisine.cuisineObj.alias)) {
                        return favorite;
                    }
                });

            var friendFilteredFavorites = [];
            await favoritesCollection.where("userId", "==", this.friend.id).where("categories", "array-contains", cuisine.cuisineObj)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            friendFilteredFavorites.push(doc.data())
                        });
                    })
                        
            var matches = _.intersection(myFilteredFavorites.map(favorite => favorite.yelpBusinessId), friendFilteredFavorites.map(favorite => favorite.yelpBusinessId))
            
            this.matchedFavorites = myFilteredFavorites.filter(favorite => {
                    if (_.contains(matches, favorite.yelpBusinessId)) {
                        return favorite;
                    }
                }) 
        }
    },
    beforeCreate() {
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