<template>
    <div id="chat-list">
        <template v-for="item in chats.data">
            <ChatItem :item="item" :my-name="myName"/>
        </template>

    </div>
</template>
<script>

export default {
    props: ['chats', 'myName'],
    created() {
    }
}

</script>