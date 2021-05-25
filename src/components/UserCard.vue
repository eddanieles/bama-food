<template>
  <div>
    <b-card v-if="!user.lastName">
      Loading...
    </b-card>

    <b-card v-else no-body class="overflow-hidden" style="max-width: 540px;">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-img :src="user.profileImage ? user.profileImage : require('../assets/background/user1.jpg')" alt="Image" class="rounded-0"></b-card-img>
          <p class="userCardName">{{user.firstName}} {{user.lastName}}</p>
        </b-col>
        <b-col md="6">
          <div class="parentUserCardCuisine">
            <b-card-text class="userCardCuisine">
              <p><big>Wants: {{user.inMoodFor ? user.inMoodFor[0].title : ""}}</big></p>
              <p>Kinda wants: {{user.inMoodFor ? user.inMoodFor[1].title : ""}}</p>
              <p><small>Can eat: {{user.inMoodFor ? user.inMoodFor[2].title : ""}}</small></p>
            </b-card-text>
          </div>
        </b-col>
      </b-row>

      <b-row no-gutters v-if="friendLinks">
        <button class="btn btn-info" @click="removeFriend(user)">Remove Friend</button>
        <router-link :to="`/friends/${user.id}`" class="findLink">Find a restaurant...</router-link>
      </b-row>
      <b-row no-gutters v-else>
        <button class="btn btn-primary" @click="addFriend(user)">Add Friend</button>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
    props: ['user', 'friendLinks'],
    methods: {
      addFriend(user) {
        this.$emit('add-friend', user);
      },
      removeFriend(user) {
        this.$emit('remove-friend', user);
      }
    }
}
</script>

<style>
.parentUserCardCuisine {
    width: 100%;
    height: 100%;
    display: table;
}

.userCardCuisine {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.userCardName {
  text-align: center;
  font-size: small;
}

.findLink {
  text-align: right;
}

</style>