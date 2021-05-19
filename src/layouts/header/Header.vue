<template>
  <v-app-bar app clipped-left clipped-right color="primary" dark>
    <v-toolbar-title class="align-center d-flex">
      <router-link to="/home">
        <span class="logo-icon">
          <img src="../../assets/logo-light-icon.png" />
        </span>
        <span class="logo-text ml-2">
          <img src="../../assets/logo-light-text.png" class="mt-2" />
        </span>
      </router-link>
    </v-toolbar-title>
    <v-app-bar-nav-icon
      class="d-block d-md-none"
      @click="$vuetify.breakpoint.smAndDown ? setSidebarDrawer(!Sidebar_drawer) : $emit('input', !value)"
    />
    <v-spacer />
    <!---right part -->
    <!-- <v-btn dark color="success" href="https://www.wrappixel.com/templates/materialpro-vuetify-admin/">Upgrade to Pro</v-btn> -->
    <v-menu bottom left transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item><router-link to="/profile">My Profile</router-link></v-list-item>
        <v-list-item>Placeholder</v-list-item>
        <v-list-item>Placeholder</v-list-item>
        <v-list-item @click="logout">{{this.$store.state.userProfile.id ? "Logout" : "Login"}}</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Header",

  components: {},

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
     
    }
  },

  computed: {
    ...mapState(["Sidebar_drawer"])
  },

  methods: {
    ...mapMutations({
      setSidebarDrawer: "SET_SIDEBAR_DRAWER"
    }),
    logout() {
      this.$store.dispatch('logout')
    }
  }
};
</script>