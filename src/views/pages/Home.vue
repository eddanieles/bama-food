<template>
  <div>
    <p>Latitude: {{this.$store.state.latitude}} Longitude: {{this.$store.state.longitude}}</p>
    <p>Total Results: {{this.$store.state.searchResults.total}}</p>
    <p>Center Location: (Latitude {{this.$store.state.searchResults.region ? this.$store.state.searchResults.region.center.latitude : ""}}, Longitude {{this.$store.state.searchResults.region ? this.$store.state.searchResults.region.center.longitude : ""}})</p>
    
    <div v-for="business in this.$store.state.searchResults.businesses" :key="business.id">
        <b-card 
            v-bind:img-src="`${business.image_url}`" 
            img-height="350px" 
            img-width="350px" 
            img-alt="Card image" 
            img-left class="mb-3" 
            v-bind:title="`${business.name}`">
            <b-card-sub-title>{{business.categories.map(category => " " + category.title).toString()}}</b-card-sub-title>
            <b-card-text>
                <br>
                <p>
                    {{business.location.address1}} 
                    {{business.location.address2 ? business.location.address2 : ""}},
                    {{business.location.city}}
                    {{business.location.zip_code}}
                </p>
                <p>{{parseFloat(convertToMiles(business.distance)).toFixed(2)}} 
                    <span class="fs-6 fst-italic">miles away</span>
                </p>
                <p v-if="`${business.rating}`">rating:
                    <star-rating 
                        v-bind:increment=0.1 
                        v-bind:rating="parseFloat(business.rating)"
                        v-bind:read-only=true
                        v-bind:inline=true
                        />
                 </p>
                <a v-bind:href="`${business.url}`" target="_blank" class="yelpLink">Go to Yelp business page...</a>
            </b-card-text>
        </b-card>
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import conversions from 'conversions'

export default {
    components: {
        StarRating
    },
    methods: {
        convertToMiles(meters) {
            return conversions(meters, "meters", "miles")
        }
    },
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
.yelpLink {
    font-size: small;
    position: absolute;
    bottom: 0;
    right: 0;
}
</style>