<template>
    <div id="message-area">
        <div class="messages">
            <div v-for="message in messages" :key="message.id">
                {{ message.content }}
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: ['activeChat'],
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
        //await this.getMessages()
    }
}

</script>