<template>
    <img :src="profileUrl"  alt="Profile Photo" class="img-fluid rounded-circle mr-2"
         style="height:50px;" id="pic">
</template>

<script>

export default {
    props: ['chatId'],
    computed: {
        profileUrl() {
            if (this.chatExists) {
                return `api/attachments/chat/${this.chatId}/profile-image`
            }
        },
        chatExists() {
            return this.chatId && this.chatId !== -1
        }
    }
}

</script>

<style scoped>

</style>