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
    }
}

</script>

<style>

</style>