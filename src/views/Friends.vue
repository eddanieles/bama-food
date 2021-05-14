<template>
  <div>
      <h1>Friends</h1>
      <div>{{this.friends}}</div>
  </div>
</template>

<script>
import { networkCollection, usersCollection } from '../firebase'

export default {
    data() {
        return {
            friends: []
        }
    },
    beforeCreate() {
        let that = this;
        networkCollection.doc(this.$store.state.userProfile.id)
            .get()
            .then((doc) => {
                doc.data().friends.map(async friend => {
                    await usersCollection.doc(friend).get().then((doc) => {
                        if (doc.exists) {
                            // console.log("Document data:", doc.data());
                            that.friends.push(doc.data())
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                })
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }
}
</script>

<style>

</style>