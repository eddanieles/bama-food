<template>
  <div>
      <b-card
        :img-src="user.profileImage ? user.profileImage : require('../assets/background/user1.jpg')" 
        img-height="100px" 
        img-width="100px" 
        img-alt="Image not found." 
        img-left class="mb-3" 
        v-bind:title="`${user.firstName} ${user.lastName}`">
        <b-card-text>
            <p>Wants: {{user.inMoodFor[0].title}}</p>
            <p>Kinda wants: {{user.inMoodFor[1].title}}</p>
            <p>Can eat: {{user.inMoodFor[2].title}}</p>
        </b-card-text>
      </b-card>
  </div>
</template>

<script>
export default {
    props: ['user']

}
</script>

<style>

</style>