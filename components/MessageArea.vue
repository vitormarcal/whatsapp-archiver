<template>
    <div class="message-area d-flex flex-column">
        <template v-for="message in messages">
            <message-item :message="message" :my-name="myName"/>
        </template>
    </div>
</template>
<script>

export default {
    props: ['activeChat', 'myName'],
    data() {
        return {
            messages: [],
        }
    },
    computed: {
        async getMessages() {
            if (this.activeChat.id !== -1) {
                const url = `http://localhost:3000/api/chats/${this.activeChat.id}/messages`
                const response = await this.$axios.$get(url)
                this.messages = response.data
            }
        },
    },
    async created() {
    }
}

</script>
<style>
.message-area {
    flex: 1 !important;
    overflow: auto;

    background-color: rgb(13, 20, 24);
    background-image: url("/bg-dark.png");
}
</style>