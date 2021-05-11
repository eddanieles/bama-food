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
        <v-list-item>My Profile</v-list-item>
        <v-list-item>My Balance</v-list-item>
        <v-list-item>Inbox</v-list-item>
        <v-list-item>Account Setting</v-list-item>
        <v-list-item @click="logout">Logout</v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
// Utilities
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
  data: () => ({
    href() {
      return undefined;
    }
  }),

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