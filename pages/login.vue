<template>
    <main class="container-fluid">
        <h2 class="h2 text-center mt-5">Input your credentials</h2>
        <b-form @submit.prevent="userLogin" class="d-flex flex-column col-4 ml-auto m-auto">

            <b-form-group
                id="input-group-email"
                label="Email address:"
                label-for="input-email"
                description="We'll never share your email with anyone else."
            >
                <b-form-input
                    id="input-email"
                    v-model="login.email"
                    type="email"
                    placeholder="Enter email"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-password"
                label="Password:"
                label-for="input-password"
            >
                <b-form-input
                    id="input-password"
                    v-model="login.password"
                    type="password"
                    placeholder="Enter Password"
                    required
                ></b-form-input>
            </b-form-group>
            <div>
                <b-button type="submit" variant="success">Login</b-button>
            </div>
        </b-form>
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
            try {
                await this.$auth.loginWith('local', { data: this.login })
                if (this.$auth.loggedIn) {
                    await this.$router.push('/');
                } else {
                    console.log('Usuário não está logado.');
                }
            } catch (err) {
                console.log(err)
            }
        }
    },
    beforeCreate() {
        if (this.$auth.loggedIn) {
            this.$router.push('/');
        }

    }
}
</script>
