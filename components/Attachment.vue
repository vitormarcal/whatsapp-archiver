<template>
    <div v-if="attachmentUrl" class="attachment">
        <b-img fluid v-if="isImageAttachment" :src="src"/>
        <video v-else-if="isVideoAttachment" :src="src" controls/>
        <audio v-else-if="isAudioAttachment" :src="src" controls/>
        <a v-else-if="isPDF || attachmentUrl" :download='message.attachmentName'
           :href="src">{{ message.attachmentName }}</a>
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
                return `api/messages/${this.message.id}/attachment`
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
    },
    async mounted() {
        try {
            if (this.attachmentUrl) {
                console.log(`Buscando ${this.message.id} ${this.attachmentUrl}`)
                const response = await this.$axios.get(this.attachmentUrl, {
                    responseType: 'blob'
                });
                this.src = URL.createObjectURL(response.data);
            }
        } catch (error) {
            console.error(error)
        }
    },
    beforeDestroy() {
        if (this.attachmentUrl && this.src) {
            URL.revokeObjectURL(this.src);
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