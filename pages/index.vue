<template>

    <main  class="container-fluid">
        <div class="row h-100">
            <ChatList :chats="chats"
                      :my-name="myName"
                      :active-chat="activeChat"
                      v-on:update:message-area="refreshMessageArea"/>

            <MessageArea :my-name="myName" :active-chat="activeChat"/>
        </div>

    </main>

</template>

<script>
export default {
    name: 'IndexPage',
    data() {
        return {
            myName: 'Vítor  Marçal',
            messages: [],
            activeChat: {id: -1}
        }
    },
    methods: {
        refreshMessageArea(activeChat) {
            this.activeChat = activeChat
        }
    },
    async asyncData({$axios}) {
        const chats = await $axios.$get('http://localhost:3000/api/chats/')
        return {chats}
    }
}
</script>
<style>
main {
    width: 100vw;
    height: 100vh;
}
</style>
