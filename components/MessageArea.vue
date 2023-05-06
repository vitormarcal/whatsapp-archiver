<template>
    <div class="message-area d-none d-sm-flex flex-column col-12 col-sm-7 col-md-8 p-0 h-100" ref="chatWindow"
         @scroll="loadMoreMessages">
        <template v-for="message in messages">
            <message-item :message="message" :my-name="myName"/>
        </template>
    </div>
</template>
<script>

export default {
    props: ['activeChat', 'myName'],
    data() {
        return {
            messages: [],
            config: {}
        }
    },
    watch: {
        activeChat(newVal, oldVal) {
            console.log(`O nome mudou de ${oldVal.id} para ${newVal.id}`);

            this.$set(this.config, newVal.id, {offset: 0})
            this.messages = []
            this.loadMoreMessages()
        }

    },
    methods: {
        async loadMoreMessages() {
            const chatWindow = this.$refs.chatWindow;
            let firstQuery = this.firstQuery;

            if (this.existsChat && chatWindow.scrollTop === 0) {
                console.log(`carrega mais mensagens para ${this.activeChat.id}`);
                this.getMessages().then(() => {
                    console.log(`mensagens carregadas para ${this.activeChat.id}`);
                    if (!firstQuery) {
                        chatWindow.scrollTop = 20;
                    } else {
                        chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight;
                    }

                })
            }

        },
        async getMessages() {
            if (this.existsChat) {
                const limit = 50
                const offset = this.config[this.chatId].offset
                const url = `http://localhost:3000/api/chats/${this.activeChat.id}/messages?offset=${offset}&limit=${limit}`
                const response = await this.$axios.$get(url)
                this.messages = [...response.data, ...this.messages]
                this.config[this.chatId].offset += limit
            }
        },
    },
    computed: {
        chatId() {
            return this.activeChat?.id || -1
        },
        existsChat() {
            return this.activeChat.id !== -1
        },
        firstQuery() {
            return this.config[this.chatId].offset === 0
        }
    },
    mounted() {
        this.$nextTick(() => {
            const chatWindow = this.$refs.chatWindow;
            chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight;
        });
    }
}

</script>
<style>
.message-area {
    flex: 1 !important;
    overflow: auto;

    background-color: rgb(13, 20, 24);
    background-image: url("/bg-dark.png");
    border-left: 1px solid white;
}
</style>