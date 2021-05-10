<template>
  <div>
        <b-form @submit="onSubmit" inline>
            <b-container>
                <b-row>

                    <b-col cols="5">
                        <b-form-group
                            id="input-group-1"
                            label="Find"
                            label-for="input-1"
                        >
                            <!-- <b-form-input
                                id="input-1"
                                placeholder="delivery, takeout, reservations..."
                                v-model="searchTerms"
                            ></b-form-input> -->
                            <v-autocomplete
                                label="delivery, takeout, restaurants..."
                                :filter="this.customFilter"
                                :items="this.options"
                                v-model="searchTerms"
                            ></v-autocomplete>
                        </b-form-group>
                    </b-col>

                    <b-col cols="5">
                        <b-form-group 
                            id="input-group-2" 
                            label="Near" 
                            label-for="input-2"
                        >
                            <b-form-input
                            id="input-2"
                            placeholder="Enter Location"
                            v-model="location"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col class="submitBtn">
                        <b-button type="submit" variant="primary">Submit</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </b-form>
    </div>
</template>

<script>
import json from './categories.json'

export default {
    data() {
        return {
            searchTerms: '',
            location: '',
            options: json.categories.map(category => category.title)
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            let params = {
                term: this.searchTerms,
                location: this.location
            }
            this.$store.dispatch('businessSearch', params);
        },
        customFilter (item, queryText) {
            const textTwo = item.toLowerCase()
            const searchText = queryText.toLowerCase()

            return textTwo.indexOf(searchText) > -1
        },
    }
}
</script>

<style>
.submitBtn {
    padding-top: 35px;
}
</style>