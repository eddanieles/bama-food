<template>
  <div>
    <b-row>
        <b-col>
            <h1>Favorites</h1>
            <div v-for="business in this.$store.state.userFavorites" :key="business.id">
                <business-card v-bind:business = business />
            </div>
        </b-col>
    </b-row>
  </div>
</template>

<script>
import BusinessCard from '../components/BusinessCard';

export default {
    components: {
        BusinessCard
    }
}
</script>

<style>

</style>