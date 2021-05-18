<template>
  <div>
        <user-card :user="this.friend" />
        <p>Matched Cuisine(s): {{this.matchedCuisines}}</p>
  </div>
</template>

<script>

import { usersCollection } from '../firebase'
import _ from 'underscore'
// import json from '../components/categories.json'
import UserCard from '../components/UserCard.vue'

export default {
  components: { UserCard },
    data() {
        return {
            friend: {},
            matchedCuisines: [],
            matchedFavorite: {}
        }
    },
    methods: {
        
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