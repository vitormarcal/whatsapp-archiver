<template>
    <div v-if="attachmentUrl" class="attachment">
        <b-img fluid v-if="isImageAttachment" :src="attachmentUrl"/>
        <video v-else-if="isVideoAttachment" :src="attachmentUrl" controls/>
        <audio v-else-if="isAudioAttachment" :src="attachmentUrl" controls/>
        <a v-else-if="isPDF || attachmentUrl" :download='message.attachmentName'
           :href="attachmentUrl">{{ message.attachmentName }}</a>
    </div>
</template>

<script>

export default {
    props: ['message'],
    data() {
        return {
            src: undefined
        }
    },
    computed: {
        attachmentUrl() {
            if (this.message?.attachmentName) {
                return `api/attachments/message/${this.message.id}`
            }
            return undefined

        },
        isImageAttachment() {
            if (!this.attachmentUrl) return false
            return this.message.attachmentName && /\.(jpg|jpeg|png|gif|webp)$/i.test(this.message.attachmentName)
        },
        isVideoAttachment() {
            if (!this.attachmentUrl) return false
            return this.message.attachmentName && /\.(mp4|avi|mov)$/i.test(this.message.attachmentName)
        },
        isAudioAttachment() {
            if (!this.attachmentUrl) return false
            return this.message.attachmentName && /\.(mp3|wav|opus)$/i.test(this.message.attachmentName)
        },
        isPDF() {
            if (!this.attachmentUrl) return false
            return this.message.attachmentName && /\.(pdf)$/i.test(this.message.attachmentName)
        }
    }
}
</script>
<style>

.attachment {
    max-width: 100%;
}

.attachment img {
    max-width: 100%;
}
</style>