<template>
  <div>
      <div v-for="business in this.$store.state.searchResults.businesses" :key="business.id">
        <business-card v-bind:business = business />
    </div>
  </div>
</template>

<script>
import BusinessCard from './BusinessCard.vue';

export default {
    components: {
        BusinessCard
    },
    beforeCreate() {
        // console.log("this.$store.state.userProfile", this.$store.state.userProfile)
        this.$store.dispatch('getFavorites', this.$store.state.userProfile.id);
        this.$store.dispatch('getTryList', this.$store.state.userProfile.id);
    },
    created() {
      // console.log("this.$store.state.userFavorites", this.$store.state.userFavorites)
    }
}

</script>

<style>

</style>