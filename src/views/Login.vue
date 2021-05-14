<template>
  <div>
    <section>
      <div  :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>
          <div>
            <label for="email1">Email</label>
            <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />
          </div>
          <div>
            <label for="password1">Password</label>
            <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />
          </div>
            <button @click="login()" class="button">Log In</button>
            <div class="extras">
                <p><a class="fs-6">Forgot Password</a></p>
                <p><a @click="toggleForm()" class="fs-6">Create an Account</a></p>
            </div>
        </form>
        <form v-else @submit.prevent>
            <h1>Get Started</h1>
            <div>
                <label for="firstName">First Name</label>
                <input v-model.trim="signupForm.firstName" type="text" placeholder="first name..." id="firstName" />
            </div>
            <div>
                <label for="lastName">Last Name</label>
                <input v-model.trim="signupForm.lastName" type="text" placeholder="last name..." id="lastName" />
            </div>
            <div>
                <label for="email2">Email</label>
                <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com" id="email2" />
            </div>
            <div>
                <label for="password2">Password</label>
                <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />
            </div>
            <button @click="signup()" class="button">Sign Up</button>
            <div class="extras">
                <a @click="toggleForm()">Back to Log In</a>
            </div>
        </form>

      </div>
    </section>
  </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                email: '',
                password: ''
            },
            signupForm: {
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            },
            showLoginForm: true
        }
    },
    methods: {
        login() {
            this.$store.dispatch('login', {
                email: this.loginForm.email,
                password: this.loginForm.password
            })
        },
        signup() {
            this.$store.dispatch('signup', {
                email: this.signupForm.email,
                password: this.signupForm.password,
                firstName: this.signupForm.firstName,
                lastName: this.signupForm.lastName
            })
        },
        toggleForm() {
            this.showLoginForm = !this.showLoginForm
        }
    }
}
</script>

<style>
</style>