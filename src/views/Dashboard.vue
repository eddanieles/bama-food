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
                    <business-card :business=business />
                </div>
            </b-col>

            <b-col cols="6">
                <h1>Trylist</h1>
                <div v-for="business in this.$store.state.userTrylist" :key="business.id">
                    <business-card :business=business />
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
            let that = this;
            event.preventDefault();
            var categoryObject = _.find(json.categories, category => {
                return category.title === terms;
            })
            
            let cacheMoodArr = this.$store.state.userProfile.inMoodFor;
            cacheMoodArr[index] = categoryObject;

            var userRef = usersCollection.doc(this.$store.state.userProfile.id);
            userRef.update({
                    inMoodFor: cacheMoodArr
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });

            userRef.get().then((doc) => {
                if (doc.exists) {
                    let user = doc.data();
                    user.id = doc.id;
                    that.$store.dispatch('updatedUserProfile', user)
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

        }
    },
    beforeCreate() {
        this.$store.dispatch('getFavorites', this.$store.state.userProfile.id);
        this.$store.dispatch('getTryList', this.$store.state.userProfile.id);
    }
}
</script>

<style>

</style>