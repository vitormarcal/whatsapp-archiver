<template>
    <main class="container-fluid">
        <form @submit.prevent="userLogin">
            <div>
                <label>Email</label>
                <input type="text" v-model="login.email" />
            </div>
            <div>
                <label>Password</label>
                <input type="text" v-model="login.password" />
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
        </form>
    </main>
</template>

<script>
export default {
    name: "LoginPage",
    data() {
        return {
            login: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        async userLogin() {
           /* try {
                let response = await this.$auth.loginWith('local', { data: this.login })
                console.log(response)
            } catch (err) {
                console.log(err)
            }*/
        }
    }
}
</script>
