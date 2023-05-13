<template>
    <div id="chat-list" class="col-12 col-sm-5 col-md-4 d-flex flex-column overflow-auto h-100">
        <template v-for="item in chats">
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