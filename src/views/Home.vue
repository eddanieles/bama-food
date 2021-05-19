<template>
  <div>
    <p>Latitude: {{this.$store.state.latitude}} Longitude: {{this.$store.state.longitude}}</p>
    <p>Total Results: {{this.$store.state.searchResults.total}}</p>
    <p>Center Location: (Latitude {{this.$store.state.searchResults.region ? this.$store.state.searchResults.region.center.latitude : ""}}, Longitude {{this.$store.state.searchResults.region ? this.$store.state.searchResults.region.center.longitude : ""}})</p>
    <search-form />
    <search-results />
  </div>
</template>

<script>
import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults.vue';

export default {
    components: {
        SearchForm,
        SearchResults
    },
    beforeCreate() {
        let searchTerms = {
            latitude: this.$store.state.latitude,
            longitude: this.$store.state.longitude,
            attributes: "hot_and_new",
            radius: 8050,
            categories: "food,restaurants"
            // open_now: true
        };
        this.$store.dispatch('businessSearch', searchTerms);

        // this.$store.dispatch('getCategories');
    }
}
</script>

<style>

</style>