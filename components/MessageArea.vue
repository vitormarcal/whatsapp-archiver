<template>
    <div class="message-area d-sm-flex flex-column col-12 col-sm-7 col-md-8 p-0 h-100" :class="messageAreaClass" ref="chatWindow"
         @scroll="loadMoreMessages">

        <div id="navbar" class="row d-flex flex-row align-items-center p-2 m-0" :class="navbarClass" v-if="showNavBar">
            <a href="#" class="h2" @click="destroyChat"><b-icon icon="arrow-left"/></a>
            <a href="#"><profile-image :chat-id="activeChat.id"/></a>
            <div class="d-flex flex-column">
                <div class="text-white font-weight-bold" id="name">{{ this.activeChat.name }}</div>
                <div class="text-white small" id="details">last seen {{ formattedDate }}</div>
            </div>

            <div class="d-flex flex-row align-items-center ml-auto">
                <a href="#" class="h2"><b-icon icon="search"></b-icon></a>

                <b-dropdown variant="primary">
                    <template #button-content>
                        <b-icon icon="gear-fill" aria-hidden="true"></b-icon> Settings
                    </template>
                    <b-dropdown-item-button v-b-modal.modal-edit-chat>Edit Chat</b-dropdown-item-button>
                    <b-dropdown-item-button v-b-modal.modal-media-gallery>View Media</b-dropdown-item-button>
                    <b-dropdown-item-button @click="exportChat">Exportar</b-dropdown-item-button>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item-button variant="danger">
                        <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                        Delete
                    </b-dropdown-item-button>
                </b-dropdown>
            </div>
        </div>


        <div class="message-list d-flex flex-column">
            <template v-for="message in messages">
                <message-item :message="message" :my-name="myName"/>
            </template>
        </div>

        <media-gallery-modal :messages="messages" :active-chat="activeChat"/>

        <edit-chat-modal :messages="messages" :active-chat="activeChat" @update:edit-chat="handleUpdateEditChat"></edit-chat-modal>
    </div>
</template>
<script>

export default {
    props: ['activeChat', 'myName', 'mobile'],
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
        handleUpdateEditChat() {
            this.$emit('update:edit-chat')
        },
        destroyChat() {
            this.$emit('update:destroy-chat')
        },
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
        async exportChat() {
            const url = `api/chats/${this.activeChat.id}/export`
            const response = await this.$axios.$get(url, { responseType: 'blob' });

            const downloadLink = document.createElement('a');
            const urlObject = window.URL.createObjectURL(response);
            downloadLink.href = urlObject;

            downloadLink.download = 'chat_export.zip';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(urlObject);
        },
        async getMessages() {
            if (this.existsChat) {
                const limit = 50
                const offset = this.config[this.chatId].offset
                const url = `api/chats/${this.activeChat.id}/messages?offset=${offset}&limit=${limit}`
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
            return this.activeChat?.id !== -1
        },
        firstQuery() {
            if (this.existsChat) return this.config[this.chatId].offset === 0
            return true
        },
        formattedDate() {
            if (this.existsChat) return new Date(this.activeChat.lastMessage.date).toUTCString()
        },
        showNavBar() {
            return this.existsChat;
        },
        messageAreaClass() {
            return {
                'd-none': !this.mobile || !this.chatOpened,
                'd-flex': this.mobile && this.chatOpened
            }
        },
        navbarClass() {
            return {'w-100':  this.mobile && this.chatOpened}
        },
        chatOpened() {
            return this.activeChat?.id >= 0
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

.message-list {
    padding-top: 6rem;
}

#navbar {
    position: fixed;
    top: 0;
    z-index: 1000;
    background: rgb(15, 59, 62);
    right: auto;
    width: calc(67% - 1px);
}
</style>