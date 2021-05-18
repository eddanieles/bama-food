<template>
  <div>
        <h1>Friends</h1>
        <div v-if="this.friends.length === 0">
            <p class="fw-lighter fst-italic">You have 0 friends in your network.</p> 
        </div>
        <div v-for="friend in this.friends" :key="friend.id">
            <router-link :to="`/friends/${friend.id}`">
                <user-card :user=friend />
            </router-link>
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

export default {
    components: { UserCard },
    data() {
        return {
            friends: [],
            allUsers: []
        }
    },
    methods: {
        
    },
    created() {
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