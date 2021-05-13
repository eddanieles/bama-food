<template>
  <div>
    <b-container>
        <b-row>
            <h1>In the mood for...</h1>
            <b-col>
                <b-form-group
                label="I really want:"
                >
                    <v-autocomplete
                        @change="onChange(0,wantTerms)"
                        :label="this.userCuisineArr[0]"
                        v-bind:filter="this.customFilter"
                        :items="this.options"
                        v-model="wantTerms"
                    ></v-autocomplete>
                </b-form-group>
            </b-col>

           <b-col>
                <b-form-group
                label="I kinda want:"
                >
                    <v-autocomplete
                        @change="onChange(1,kindaTerms)"
                        :label="this.userCuisineArr[1]"
                        v-bind:filter="this.customFilter"
                        :items="this.options"
                        v-model="kindaTerms"
                    ></v-autocomplete>
                </b-form-group>
            </b-col>

            <b-col>
                <b-form-group
                label="I can eat:"
                >
                    <v-autocomplete
                        @change="onChange(2,canEatTerms)"
                        :label="this.userCuisineArr[2]"
                        v-bind:filter="this.customFilter"
                        :items="this.options"
                        v-model="canEatTerms"
                    ></v-autocomplete>
                </b-form-group>
            </b-col>
        </b-row>
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
import BusinessCard from '../components/BusinessCard'
import json from '../components/categories.json'
import _ from 'underscore'
import { usersCollection } from '../firebase'

export default {
    components: {
        BusinessCard
    },
    data() {
        return {
            userCuisineArr: this.$store.state.userProfile.inMoodFor.map(cuisine => cuisine.title),
            options: json.categories.map(category => category.title),
            wantTerms: '',
            kindaTerms: '',
            canEatTerms: ''
        }
    },
    methods: {
        customFilter (item, queryText) {
            const textTwo = item.toLowerCase()
            const searchText = queryText.toLowerCase()

            return textTwo.indexOf(searchText) > -1
        },
        onChange(index, terms) {
            event.preventDefault();
            // console.log(index)
            // console.log(terms)
            var categoryObject = _.find(json.categories, category => {
                return category.title === terms;
            })
            // console.log(categoryObject);
            let cacheMoodArr = this.$store.state.userProfile.inMoodFor;
            cacheMoodArr[index] = categoryObject;

            console.log(cacheMoodArr)

            var userRef = usersCollection.doc(this.$store.state.userProfile.id);
            return userRef.update({
                inMoodFor: cacheMoodArr
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
        }
    }
}
</script>

<style>

</style>