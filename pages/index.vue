<template>

    <main class="container-fluid">
        <div class="row h-100">
            <ChatList :chats="chats"
                      :my-name="myName"
                      :active-chat="activeChat"
                      :mobile="isMobile"
                      v-on:update:message-area="refreshMessageArea"/>

            <MessageArea :my-name="myName"
                         :mobile="isMobile"
                         :active-chat="activeChat"
                         @update:destroy-chat="destroyChat"
                         @update:edit-chat="handleUpdateEditChat"/>
        </div>

    </main>

</template>

<script>
export default {
    name: 'IndexPage',
    middleware: ['auth'],
    data() {
        return {
            myName: 'Vítor Marçal',
            activeChat: {id: -1},
            chats: [],
            count: 0,
            isMobile: false
        }
    },
    methods: {
        async handleUpdateEditChat() {
            const chat = await this.$axios.$get('api/chats/' + this.activeChat.id)
            const index = this.chats.findIndex(it => it.id === chat.id);
            this.activeChat = chat
            if (index !== -1) {
                this.chats.splice(index, 1, chat);
            }

        },
        destroyChat() {
            this.activeChat = {id: -1}
        },
        refreshMessageArea(activeChat) {
            this.activeChat = activeChat
        },
        async getChatInfo() {
            const host = window.location
            const {count, data} = await this.$axios.$get(`${host}api/chats/`)
            this.chats = data
            this.count = count

        },
        checkWindowSize() {
            this.isMobile = window.innerWidth <= 575;
        },
    },
    mounted() {
        this.checkWindowSize();
        window.addEventListener('resize', this.checkWindowSize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkWindowSize);
    },
    created() {
        this.getChatInfo()
    }
}
</script>
<style>
main {
    width: 100vw;
    height: 100vh;
}
</style>
