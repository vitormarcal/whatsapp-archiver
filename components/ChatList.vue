<template>
    <div id="chat-list" class="col-12 col-sm-5 col-md-4 flex-column overflow-auto h-100" :class="dynamicClass">
        <template v-for="item in chats">
            <ChatItem :item="item" :my-name="myName" :active-chat="activeChat"
                      v-on:update:active-chat="handleItemClicked"/>
        </template>

    </div>
</template>
<script>

export default {
    props: ['chats', 'myName', 'activeChat', 'mobile'],
    methods: {
        handleItemClicked(activeChat) {
            this.$emit('update:message-area', activeChat)
        }
    },
    computed: {
        dynamicClass() {
            return {
                'd-none': this.mobile && this.chatOpened,
                'd-flex': this.mobile && !this.chatOpened
            }
        },
        chatOpened() {
            return this.activeChat?.id >= 0
        }
    },
    created() {
    }
}

</script>