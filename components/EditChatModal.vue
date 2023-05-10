<template>

    <b-modal

            id="modal-prevent-closing"
            ref="modal"
            title="Edite o chat"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
    >
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group
                    label="Chat Name"
                    label-for="chat-name-input"
                    invalid-feedback="Chat Name is required"

            >
                <b-form-input
                        id="name-input"
                        v-model="newChatName"
                        required
                ></b-form-input>
            </b-form-group>

            Replace the author:
            <b-form-select v-model="authorSelect" :options="allUniqueNames"></b-form-select>
            <b-form-group
                    label="by name"
                    label-for="author-replace-name-input"
                    invalid-feedback="Author Name to Replace"
            >
                <b-form-input
                        id="author-replace-name-input"
                        v-model="newAuthorName"
                        required
                ></b-form-input>
            </b-form-group>

        </form>
    </b-modal>

</template>

<script>

export default {
    props: ['activeChat', 'messages'],
    data() {
        return {
            newAuthorName: null,
            authorSelect: null,
            newChatName: null
        }
    },
    methods: {
        resetModal() {
            this.newAuthorName = null
            this.authorSelect = null
            this.newChatName = null
        },
        handleOk(bvModalEvent) {
            // Prevent modal from closing
            bvModalEvent.preventDefault()
            // Trigger submit handler
            this.handleSubmit()
        },
        async updateChatName() {
            if (this.newChatName && this.activeChat.name !== this.newChatName) {
                const url = `http://localhost:3000/api/chats/${this.activeChat.id}/name`
                return this.$axios.$patch(url, {newChatName: this.newChatName})
            }
        },
        async updateAuthor() {
            if (this.authorSelect && this.newAuthorName && this.newAuthorName !== this.authorSelect) {
                const url = `http://localhost:3000/api/messages/author`
                return this.$axios.$patch(url, {
                    oldName: this.authorSelect,
                    newName: this.newAuthorName,
                    chatId: this.activeChat.id
                })
            }
        },
        handleSubmit() {
            console.log("handle submit")
            console.log(this.newChatName)
            console.log(this.authorSelect)
            console.log(this.newAuthorName)


            Promise.all(
                [
                    this.updateChatName(),
                    this.updateAuthor()
                ]
            ).then(() => {
                this.$emit('update:edit-chat')
                this.$nextTick(() => {
                    this.$bvModal.hide('modal-prevent-closing')
                })
            })


        }
    }
    ,
    computed: {
        allUniqueNames() {
            return [...new Set(this.messages.map(it => it.author))].filter(it => it !== null)
        }
    }
}

</script>

<style scoped>

</style>