<template>
  <div>
        <h1>Friends</h1>
        <div v-if="this.friends.length === 0">
            <p class="fw-lighter fst-italic">You have 0 friends in your network.</p> 
        </div>
        <div v-for="friend in this.friends" :key="friend.id">
            <user-card :user=friend />
            <p>{{_self.getRestaurant(friend)}}</p>
        </div>

        <h1>All Users</h1>
        <div v-for="user in this.allUsers" :key="user.id">
            <user-card :user=user />
        </div>
  </div>
</template>

<script>
import UserCard from '../components/UserCard.vue';
import { networkCollection, usersCollection } from '../firebase'
import _ from 'underscore'

export default {
    components: { UserCard },
    data() {
        return {
            friends: [],
            allUsers: [],
            suggestedRestaurant: {}
        }
    },
    methods: {
        getRestaurant(friend) {
            let that = this;
            let obj = {
                me: that.$store.state.userProfile ? that.$store.state.userProfile.inMoodFor.map(cuisine => cuisine.alias) : [],
                friend: friend ? friend.inMoodFor.map(cuisine => cuisine.alias) : []
            }
            
            let matchedCuisine = _.intersection(obj.me, obj.friend);
            if (matchedCuisine[0]) {
                return matchedCuisine
            } else {
                return "no matches in matchedCuisine"
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
    },
    beforeMount() {
        this.getRestaurant();
    }
}
</script>

<style>

</style>