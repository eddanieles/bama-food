<template>
  <div>
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
            <button type="button" class="btn btn-danger" @click="onClick(business)">Click Me!</button>
        </b-card>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import conversions from 'conversions'

export default {
    props: ['business'],
    components: {
        StarRating
    },
    methods: {
        convertToMiles(meters) {
            return conversions(meters, "meters", "miles")
        },
        onClick(businessObj) {
            let obj = {
                createDate: Date.now(),
                alias: businessObj.alias,
                categories: businessObj.categories.map(category => {
                    return {alias: category.alias, title: category.title}
                }),
                coordinates: {
                    latitude: businessObj.coordinates.latitude,
                    longitude: businessObj.coordinates.longitude
                },
                displayPhone: businessObj.display_phone,
                yelpBusinessId: businessObj.id,
                imageUrl: businessObj.image_url,
                location: businessObj.location,
                name: businessObj.name,
                phone: businessObj.phone,
                rating: businessObj.rating,
                review_count: businessObj.review_count,
                transactions: businessObj.transactions.map(transaction => transaction),
                yelpUrl: businessObj.url
            }
            console.log(obj)
        }
    },
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