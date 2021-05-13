<template>
  <div>
    <b-container>
        <b-row>
            <b-col cols="6">
                <h1>Favorites</h1>
                <div v-for="business in this.$store.state.userFavorites" :key="business.id">
                    <business-card v-bind:business = business />
                </div>
            </b-col>

            <b-col cols="6">
                <h1>Trylist</h1>
                <div v-for="business in this.$store.state.userTrylist" :key="business.id">
                    <business-card v-bind:business = business />
                </div>
            </b-col>
        </b-row>
    </b-container>
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