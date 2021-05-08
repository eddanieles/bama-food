<template>
  <div>
    <p>Latitude: {{this.$store.state.latitude}} Longitude: {{this.$store.state.longitude}}</p>
    <p>Total Results: {{this.$store.state.searchResults.total}}</p>
    <p>Center Location: (Latitude {{this.$store.state.searchResults.region ? this.$store.state.searchResults.region.center.latitude : ""}}, Longitude {{this.$store.state.searchResults.region ? this.$store.state.searchResults.region.center.longitude : ""}})</p>
    
    <div v-for="business in this.$store.state.searchResults.businesses" :key="business.id">
        <b-card v-bind:img-src="`${business.image_url}`" img-height="350px" img-width="350px" img-alt="Card image" img-left class="mb-3">
            <b-card-text>
                <p>name: {{business.name}}</p>
                <p>url: {{business.url}}</p>
                <p>categories: {{business.categories}}</p>
                <p>
                    {{business.location.address1}} 
                    {{business.location.address2 ? business.location.address2 : ""}},
                    {{business.location.city}}
                    {{business.location.zip_code}}
                </p>
                <p>distance: {{business.distance}}</p>
                <p>rating: {{business.rating}}</p>
            </b-card-text>
        </b-card>
    </div>
  </div>
</template>

<script>
export default {
    beforeCreate() {

        let searchTerms = {
            latitude: this.$store.state.latitude,
            longitude: this.$store.state.longitude,
            attributes: "hot_and_new",
            radius: 8050,
            categories: "food,restaurants",
            open_now: true
        };
        this.$store.dispatch('businessSearch', searchTerms);

        // this.$store.dispatch('getCategories');

    }
}
</script>

<style>

</style>