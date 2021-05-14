<template>
  <div>
      <h1>Friends</h1>
  </div>
</template>

<script>
import { networkCollection } from '../firebase'

export default {
    data() {
        return {
            friends: []
        }
    },
    beforeCreate() {
        networkCollection.doc(this.$store.state.userProfile.id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
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