<template>
  <div>
      <b-card 
            v-bind:img-src="`${business.image_url ? business.image_url : business.imageUrl}`" 
            img-height="350px" 
            img-width="350px" 
            img-alt="Image not found." 
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
                <p v-if="business.distance">{{parseFloat(convertToMiles(business.distance)).toFixed(2)}} 
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

            <div v-if="this.$store.state.userProfile.firstName">
                <div v-if="this.checkFavorite(business.id || business.yelpBusinessId)">
                    <button type="button" class="btn btn-primary" @click="addToFavorites(business)"><small>Add to Favorites</small></button>
                </div>
                <div v-else-if="this.$route.path === '/dashboard'">
                    <button type="button" class="btn btn-warning" @click="deleteFromFavorites(business)"><small>Delete from Favorites</small></button>
                </div>

            
                <div v-if="this.checkTrylist(business.id || business.yelpBusinessId)">
                    <button type="button" class="btn btn-info" @click="addToTrylist(business)"><small>Add to Trylist</small></button>
                </div>
                <div v-else-if="this.$route.path === '/dashboard'">
                    <button type="button" class="btn btn-warning" @click="deleteFromTrylist(business)"><small>Delete from Trylist</small></button>
                </div>
            </div>

        </b-card>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import conversions from 'conversions'
import { auth, favoritesCollection, trylistCollection } from '../firebase'
import _ from 'underscore'

export default {
    data() {
        return {
            
        }
    },
    props: ['business'],
    components: {
        StarRating
    },
    methods: {
        checkFavorite(businessId) {
            return _.indexOf(this.$store.state.userFavorites.map(favorite => favorite.yelpBusinessId), businessId) === -1 ? true : false;
        },
        checkTrylist(businessId) {
            return _.indexOf(this.$store.state.userTrylist.map(business => business.yelpBusinessId), businessId) === -1 ? true : false;
        },
        cleanData(businessObj) {
            let obj = {
                userId: auth.currentUser.uid,
                createDate: Date.now(),
                alias: businessObj.alias,
                categories: businessObj.categories.map(category => {
                    return {alias: category.alias, title: category.title}
                }),
                coordinates: {
                    latitude: businessObj.coordinates.latitude,
                    longitude: businessObj.coordinates.longitude
                },
                displayPhone: businessObj.display_phone || businessObj.displayPhone,
                yelpBusinessId: businessObj.id || businessObj.yelpBusinessId,
                imageUrl: businessObj.image_url || businessObj.imageUrl,
                location: businessObj.location,
                name: businessObj.name,
                phone: businessObj.phone,
                price: businessObj.price ? businessObj.price : "",
                rating: businessObj.rating,
                review_count: businessObj.review_count,
                transactions: businessObj.transactions.map(transaction => transaction),
                yelpUrl: businessObj.url || businessObj.yelpUrl
            }
            return obj;
        },
        convertToMiles(meters) {
            return conversions(meters, "meters", "miles")
        },
        addToFavorites(businessObj) {
            let res = this.cleanData(businessObj);
            favoritesCollection.add(res);
        },
        addToTrylist(businessObj) {
            let res = this.cleanData(businessObj);
            trylistCollection.add(res);
        },
        deleteFromFavorites(businessObj) {
            favoritesCollection.where('userId', '==', auth.currentUser.uid)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                       if (doc.data().yelpBusinessId === businessObj.yelpBusinessId) {
                           doc.ref.delete()
                       }
                    })
                })
        },
        deleteFromTrylist(businessObj) {
            trylistCollection.where('userId', '==', auth.currentUser.uid)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                       if (doc.data().yelpBusinessId === businessObj.yelpBusinessId) {
                           doc.ref.delete()
                       }
                    })
                })
        }
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