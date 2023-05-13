<template>

    <main class="container-fluid">
        <div class="row h-100">
            <ChatList :chats="chats"
                      :my-name="myName"
                      :active-chat="activeChat"
                      v-on:update:message-area="refreshMessageArea"/>

            <MessageArea :my-name="myName" :active-chat="activeChat" @update:edit-chat="handleUpdateEditChat"/>
        </div>

    </main>

</template>

<script>
export default {
    name: 'IndexPage',
    data() {
        return {
            myName: 'Vítor Marçal',
            messages: [],
            activeChat: {id: -1}
        }
    },
    methods: {
        async handleUpdateEditChat() {
            const chat = await this.$axios.$get('http://localhost:3007/api/chats/' + this.activeChat.id)
            const index = this.chats.findIndex(it => it.id === chat.id);
            this.activeChat = chat
            if (index !== -1) {
                this.chats.splice(index, 1, chat);
            }

        },
        refreshMessageArea(activeChat) {
            this.activeChat = activeChat
        }
    },
    async asyncData({$axios}) {
        const {count, data} = await $axios.$get('http://localhost:3007/api/chats/')
        return {count, chats: data}
    }
}
</script>
<style>
main {
    width: 100vw;
    height: 100vh;
}
</style>
