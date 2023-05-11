<template>
    <div class="chat-item d-flex flex-row p-2 w-100 border-bottom"
         @click="toggleActive()"
         :class="{ 'active': item.id === activeChat.id }">
        <profile-image :chat-id="item.id"/>
        <div class="w-50">
            <div class="name">{{ item.name }}</div>
            <div class="small">
                <i class="far fa-check-circle mr-1"></i>
                <b-icon icon="check2-all " v-if="item.lastMessage.author === myName"></b-icon>
                {{ item.lastMessage.content }}
            </div>
        </div>
        <div class="flex-grow-1 text-right">
            <div class="small">{{ item.lastMessage.date }}</div>
            <div class="badge badge-success badge-pill small">{{ item.messagesCount }}</div>
        </div>

    </div>
</template>
<script>
export default {
    props: ['item', 'myName', 'activeChat'],
    created() {
        console.log(this.item)
    },
    methods: {
        toggleActive() {
            this.$emit('update:active-chat', this.item)
        }
    }
}
</script>
<style>
.chat-item {
    cursor: pointer;
    background: white;
}

.active {
    background: hsl(0, 0%, 90%);
}
</style>