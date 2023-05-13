<template>
    <img :src="profileUrl" alt="Profile Photo" class="img-fluid rounded-circle mr-2"
         style="height:50px;" id="pic">
</template>

<script>

export default {
    props: ['chatId'],
    computed: {
        profileUrl() {
            if (this.chatId && this.chatId !== -1) {
                return `http://localhost:3007/api/chats/${this.chatId}/profile-image.jpg`
            } else {
                return '/default-profile-image.png'
            }
        }
    }
}

</script>

<style scoped>

</style>