<template>
    <div id="chat-list">
        <template v-for="item in chats.data">
            <ChatItem :item="item" :my-name="myName" :active-chat="activeChat"
                      v-on:update:active-chat="handleItemClicked"/>
        </template>

    </div>
</template>
<script>

export default {
    props: ['chats', 'myName', 'activeChat'],
    methods: {
        handleItemClicked(activeChat) {
            this.$emit('update:message-area', activeChat)
        }
    },
    created() {
    }
}

</script>