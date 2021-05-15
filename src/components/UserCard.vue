<template>
  <div>
    <b-card no-body class="overflow-hidden" style="max-width: 540px;">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-img :src="user.profileImage ? user.profileImage : require('../assets/background/user1.jpg')" alt="Image" class="rounded-0"></b-card-img>
          <p class="userCardName">{{user.firstName}} {{user.lastName}}</p>
        </b-col>
        <b-col md="6">
          <b-card-text class="userCardCuisine">
            <p><big>Wants: {{user.inMoodFor[0].title}}</big></p>
            <p>Kinda wants: {{user.inMoodFor[1].title}}</p>
            <p><small>Can eat: {{user.inMoodFor[2].title}}</small></p>
          </b-card-text>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
    props: ['user']

}
</script>

<style>
.userCardCuisine {
  text-align: center;
  margin-top: 5rem;
}

.userCardName {
  text-align: center;
  font-size: x-large;
  font-weight: bold;
}
</style>