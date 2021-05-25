<template>
  <div>
        <h1>Friends</h1>
        <div v-if="!this.friends[0]">
            <p class="fw-lighter fst-italic">Loading...</p> 
        </div>
        <div v-else-if="this.friends.length === 0">
            <p class="fw-lighter fst-italic">You have 0 friends in your network.</p> 
        </div>
        <div v-for="friend in this.friends" :key="friend.id">
            <user-card :user=friend :friendLinks="true" @remove-friend="removeFriend"/>
        </div>

        <h1>All Users</h1>
        <div v-for="user in this.allUsers" :key="user.id">
            <user-card :user=user @add-friend="addFriend" />
        </div>
  </div>
</template>

<script>
import UserCard from '../components/UserCard.vue';
import { firebase } from '@firebase/app'
import { networkCollection, usersCollection } from '../firebase'
import _ from 'underscore'

export default {
    components: { UserCard },
    data() {
        return {
            friends: [],
            allUsers: []
        }
    },
    methods: {
        async removeFriend(userId) {
            let that = this;
            networkCollection
                .doc(this.$store.state.userProfile.id)
                .update({
                    friends: firebase.firestore.FieldValue.arrayRemove(userId)
                })

            await usersCollection
                    .doc(userId)
                    .get()
                    .then((doc) => {
                        let parsedUser = doc.data();
                        parsedUser.id = doc.id;
                        that.allUsers.push(parsedUser);
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                    });

            this.friends = _.filter(this.friends, user => {
                return user.id != userId
            })
        },
        async addFriend(userId) {
            let that = this;
            networkCollection
                .doc(this.$store.state.userProfile.id)
                .update({
                    friends: firebase.firestore.FieldValue.arrayUnion(userId)
                })

            await usersCollection
                    .doc(userId)
                    .get()
                    .then((doc) => {
                        let parsedUser = doc.data();
                        parsedUser.id = doc.id;
                        that.friends.push(parsedUser);
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                    });

            this.allUsers = _.filter(this.allUsers, user => {
                return user.id != userId
            })
        }
    },
    beforeCreate() {
        let that = this;
        networkCollection.doc(this.$store.state.userProfile.id)
            .get()
            .then((doc) => {
                doc.data().friends.map(async friend => {
                    await usersCollection
                    .doc(friend)
                    .get()
                    .then((doc) => {
                        let parsedUser = doc.data();
                        parsedUser.id = doc.id;
                        that.friends.push(parsedUser);
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                })
            })
            .then(() => {
                usersCollection.get().then((querySnapshot) => {
                    let friendsIds = that.friends.map(friend => friend.id);
                    querySnapshot.forEach((doc) => {
                        if (!friendsIds.includes(doc.id) && doc.id != that.$store.state.userProfile.id) {
                            let parsedUser = doc.data();
                            parsedUser.id = doc.id;
                            that.allUsers.push(parsedUser);
                        }
                        
                    });
                });
            })
            .catch((error) => {
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