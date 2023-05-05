<template>
    <div class="message-item rounded" :class="classObject">
        <div class="message-id">{{ message.id }}</div>
        <div>
            <div class="author">{{ message.author }}</div>
            <div class="message-content" v-html="safeContent"></div>
            <div v-if="attachmentUrl" class="attachment">
                <img v-if="isImageAttachment" :src="attachmentUrl" />
                <video v-else-if="isVideoAttachment" :src="attachmentUrl" controls />
                <audio v-else-if="isAudioAttachment" :src="attachmentUrl" controls />
                <embed v-else-if="isPDF" :src="attachmentUrl" type="application/pdf" width="100%" height="600"></embed>
            </div>
        </div>
        <div class="message-createdAt">{{ formattedDate }}</div>
    </div>
</template>
<script>

export default {
    props: ['message', 'myName'],
    computed: {
        safeContent() {
            return this.message.content.replace(
                /https?:\/\/[^\s]+/g,
                '<a href="$&" target="_blank">$&</a>'
            );
        },
        attachmentUrl() {
            if (this.message?.attachmentName) {
                return `http://localhost:3000/api/messages/${this.message.id}/attachment`
            }
            return false
        },
        isImageAttachment() {
            if (!this.attachmentUrl) return  false
            return this.message.attachmentName && /\.(jpg|jpeg|png|gif)$/i.test(this.message.attachmentName)
        },
        isVideoAttachment() {
            if (!this.attachmentUrl) return  false
            return this.message.attachmentName && /\.(mp4|avi|mov)$/i.test(this.message.attachmentName)
        },
        isAudioAttachment() {
            if (!this.attachmentUrl) return  false
            return this.message.attachmentName && /\.(mp3|wav|opus)$/i.test(this.message.attachmentName)
        },
        isPDF(){
            if (!this.attachmentUrl) return  false
            return this.message.attachmentName && /\.(pdf)$/i.test(this.message.attachmentName)
        },
        formattedDate() {
            return new Date(this.message.date).toUTCString()
        },
        isMyMessage() {
            return this.message.author === this.myName
        },
        isSystemMessage() {
            return !this.message.author
        },
        isOtherUser() {
            return !this.isMyMessage && !this.isSystemMessage
        },
        classObject() {
            return {
                'mx-auto': this.isSystemMessage,
                'system-message': this.isSystemMessage,
                'align-self-end': this.isMyMessage,
                'p1-1': !this.isSystemMessage,
                'my-1': !this.isSystemMessage,
                'my-2': this.isSystemMessage,
                'py-1': this.isSystemMessage,
                'px-2': this.isSystemMessage,
                'mx-3': !this.isSystemMessage,
                'align-self-start': this.isOtherUser,
                'shadow-sm': !this.isSystemMessage,
                'self': this.isMyMessage,
                'other-user': this.isOtherUser
            }
        }
    }
}
</script>
<style>

.message-item {
    display: inline-flex;
    padding: 8px 10px;
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 1px;
    position: relative;
    text-align: left;
    max-width: 50%;
}

.system-message {
    background-color: rgb(53, 53, 38);
    color: rgb(250, 217, 100);
}

.message-id {
    color: rgb(241, 241, 242);
    background-color: rgb(14, 97, 98);

    position: absolute;

    font-size: 10px;
    padding-inline: 7px;
    border-radius: 99px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    top: -0.5em;
    right: -0.5em;
    opacity: 0;
    transition: opacity 0.3s ease 0s;
}

.message-item:hover .message-id{
    opacity: 1;
}

.self {
    color: rgb(241, 241, 242);
    background-color: rgb(14, 97, 98) !important;
}

.self .author {
    margin-bottom: 0.25rem;
    font-weight: bold;
    font-size: 75%;
    color: rgb(31, 122, 236);
}

.other-user {
    background-color: rgb(38, 45, 49);
    color: rgb(241, 241, 242);
}

.message-content {
    overflow-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
}

.system-message .message-content {
    text-align: center;
}

.message-createdAt {
    margin-left: 1rem;
    white-space: nowrap;
    font-size: 75%;
    opacity: 0.6;
    flex: 0 0 auto;
    align-self: flex-end;
}
</style>