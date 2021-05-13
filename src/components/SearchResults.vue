<template>
  <div>
      <div v-for="business in this.$store.state.searchResults.businesses" :key="business.id">
        <business-card v-bind:business = business />
    </div>
  </div>
</template>

<script>
import BusinessCard from './BusinessCard.vue';
import { auth } from '../firebase'

export default {
    components: {
        BusinessCard
    },
    beforeMount() {
        // console.log(auth.currentUser.uid)
        this.$store.dispatch('getFavorites', auth.currentUser.uid) 
    }
}

</script>

<style>

</style>