<template>
  <div>
        <h1>Friends</h1>
        <div v-if="this.friends.length === 0">
            <p class="fw-lighter fst-italic">You have 0 friends in your network.</p> 
        </div>
        <div v-for="friend in this.friends" :key="friend.id">
            <user-card :user=friend />
            <p>matchedCuisine: {{_self.findMatchedCuisine(friend)}}</p>
            <button class="btn btn-success" @click="_self.findMatchedFavorites(friend)">Pick from Favorites</button>
            <p>matchedFavorites: {{_self.matchedFavorite}}</p>
        </div>

        <h1>All Users</h1>
        <div v-for="user in this.allUsers" :key="user.id">
            <user-card :user=user />
        </div>
  </div>
</template>

<script>
import UserCard from '../components/UserCard.vue';
import { networkCollection, usersCollection, favoritesCollection } from '../firebase'
import _ from 'underscore'
import json from '../components/categories.json'

export default {
    components: { UserCard },
    data() {
        return {
            friends: [],
            allUsers: [],
            matchedCuisine: {},
            matchedFavorite: {}
        }
    },
    methods: {
        findMatchedCuisine(friend) {
            let that = this;
            let obj = {
                me: that.$store.state.userProfile ? that.$store.state.userProfile.inMoodFor.map(cuisine => cuisine.alias) : [],
                friend: friend ? friend.inMoodFor.map(cuisine => cuisine.alias) : []
            }
            
            let matchedCuisine = _.intersection(obj.me, obj.friend);
            
            if (matchedCuisine[0]) {
                let arr = [];
                matchedCuisine.map(cuisine => {
                    let index =  _.indexOf(obj.friend, cuisine)
                    arr.push({
                        index,
                        cuisine
                    })
                });
                let mostInMoodFor = _.min(arr, index => {return index.index});

                var categoryObject = _.find(json.categories, category => {
                    return category.alias === mostInMoodFor.cuisine;
                })

                this.matchedCuisine = categoryObject;
                return categoryObject.title;
            } else {
                return "No similiar moods."
            }
        },
        async findMatchedFavorites(friend) {
            if (this.matchedCuisine.title) {
                var cuisine = this.matchedCuisine.alias;
                var categoryObject = _.find(json.categories, category => {
                    return category.alias === cuisine;
                })

                var myFilteredFavoritesArr = this.$store.state.userFavorites.filter(favorite => {
                    if (_.contains(favorite.categories.map(category => category.alias), cuisine)) {
                        return favorite;
                    }
                });
                // console.log('myFilteredFavoritesArr', myFilteredFavoritesArr.map(favorite => favorite.yelpBusinessId));

                var friendsFilteredFavortiesArr = [];
                return await favoritesCollection.where("userId", "==", friend.id).where("categories", "array-contains", categoryObject)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            friendsFilteredFavortiesArr.push(doc.data())
                        });
                        // console.log("friendsFilteredFavortiesArr", friendsFilteredFavortiesArr.map(favorite => favorite.yelpBusinessId));
                        let matchedRestaurants = _.intersection(myFilteredFavoritesArr.map(favorite => favorite.yelpBusinessId), friendsFilteredFavortiesArr.map(favorite => favorite.yelpBusinessId));

                        if (matchedRestaurants.length > 1) {
                            let id = matchedRestaurants[_.random(0, matchedRestaurants.length - 1)];
                            let justPickOne = _.filter(myFilteredFavoritesArr, favorite => {
                                return favorite.yelpBusinessId === id
                            })
                            // console.log("multiple matchedRestaurants", justPickOne);
                            this.matchedFavorite = justPickOne;
                        } else if (matchedRestaurants.length === 1) {
                            let justOne = _.filter(myFilteredFavoritesArr, favorite => {
                                return favorite.yelpBusinessId === matchedRestaurants[0]
                            })
                            // console.log("one matchedRestaurants", justOne);
                            this.matchedFavorite = justOne;
                        } else {
                            // console.log("zero matchedRestaurants");


                            var myFavoritesArr = this.$store.state.userFavorites;
                            var friendsFavortiesArr = [];

                            favoritesCollection.where("userId", "==", friend.id)
                                .get()
                                .then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        // doc.data() is never undefined for query doc snapshots
                                        friendsFavortiesArr.push(doc.data())
                                    });

                                    let matchedRestaurants = _.intersection(myFavoritesArr.map(favorite => favorite.yelpBusinessId), friendsFavortiesArr.map(favorite => favorite.yelpBusinessId));
                                    if (matchedRestaurants.length > 1) {
                                        let id = matchedRestaurants[_.random(0, matchedRestaurants.length - 1)];
                                        let justPickOne = _.filter(myFavoritesArr, favorite => {
                                            return favorite.yelpBusinessId === id
                                        })
                                        // console.log("no matchedCuisine multiple matchedRestaurants", justPickOne);
                                        this.matchedFavorite = justPickOne;
                                    } else if (matchedRestaurants.length === 1) {
                                        let justOne = _.filter(myFavoritesArr, favorite => {
                                            return favorite.yelpBusinessId === matchedRestaurants[0]
                                        })
                                        // console.log("no matchedCuisine one matchedRestaurants", justOne);
                                        this.matchedFavorite = justOne;
                                    } else {
                                        // console.log("no matchedCuisine zero matchedRestaurants");
                                        this.matchedFavorite = { name: "no matching favorites"}
                                    }
                                })
                                .catch((error) => {
                                    console.log("Error getting documents: ", error);
                                })
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    })
            } else {
                var myFavoritesArr = this.$store.state.userFavorites;
                var friendsFavortiesArr = [];

                return await favoritesCollection.where("userId", "==", friend.id)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            friendsFavortiesArr.push(doc.data())
                        });

                        let matchedRestaurants = _.intersection(myFavoritesArr.map(favorite => favorite.yelpBusinessId), friendsFavortiesArr.map(favorite => favorite.yelpBusinessId));
                        if (matchedRestaurants.length > 1) {
                            let id = matchedRestaurants[_.random(0, matchedRestaurants.length - 1)];
                            let justPickOne = _.filter(myFavoritesArr, favorite => {
                                return favorite.yelpBusinessId === id
                            })
                            // console.log("no matchedCuisine multiple matchedRestaurants", justPickOne);
                            this.matchedFavorite = justPickOne;
                        } else if (matchedRestaurants.length === 1) {
                            let justOne = _.filter(myFavoritesArr, favorite => {
                                return favorite.yelpBusinessId === matchedRestaurants[0]
                            })
                            // console.log("no matchedCuisine one matchedRestaurants", justOne);
                            this.matchedFavorite = justOne;
                        } else {
                            // console.log("no matchedCuisine zero matchedRestaurants");
                            this.matchedFavorite = { name: "no matching favorites"}
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    })
            }
        }
    },
    beforeCreate() {
        let that = this;
        networkCollection.doc(this.$store.state.userProfile.id)
            .get()
            .then((doc) => {
                doc.data().friends.map(async friend => {
                    await usersCollection.get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " => ", doc.data());
                            let parsedUser = doc.data();
                            parsedUser.id = doc.id;
                            
                            if (doc.id === friend) {
                                that.friends.push(parsedUser);
                            } else if (doc.id === that.$store.state.userProfile.id) {
                                return
                            } else {
                                that.allUsers.push(parsedUser);
                            }
                        });
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                })
            }).catch((error) => {
                console.log("Error getting document:", error);
                usersCollection.get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " => ", doc.data());
                            let parsedUser = doc.data();
                            parsedUser.id = doc.id;
                            
                            if (doc.id === that.$store.state.userProfile.id) {
                                return
                            } else {
                                that.allUsers.push(parsedUser);
                            }
                        });
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
            });
    }
}
</script>

<style>

</style>