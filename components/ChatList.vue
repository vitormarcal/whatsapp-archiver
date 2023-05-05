<template>
    <div id="chat-list">
        <template v-for="item in chats.data">
            <ChatItem :item="item"/>
        </template>

    </div>
</template>
<script>

export default {
    props: ['chats'],
    created() {
    }
}

</script>