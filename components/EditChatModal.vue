<template>

    <b-modal
            id="modal-edit-chat"
            ref="modal"
            title="Edite o chat"
            @show="findAuthors"
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

            <b-form-group
                    label="New Profile Image"
                    label-for="profile-img-input"
                    invalid-feedback="New Profile Image"

            >
                <b-form-file
                        id="profile-img-input"
                        v-model="newProfileImage"
                        placeholder="Escolha uma imagem ou arraste e solte aqui"
                        drop-placeholder="Solte aqui"
                        accept="image/*"
                        required
                ></b-form-file>
            </b-form-group>

            Replace the author:
            <b-form-select v-model="authorSelect" :options="authors"></b-form-select>
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
            newProfileImage: null,
            newChatName: null,
            authors: []
        }
    },
    methods: {
        resetModal() {
            this.newAuthorName = null
            this.newProfileImage = null
            this.authorSelect = null
            this.newChatName = null
        },
        handleOk(bvModalEvent) {
            // Prevent modal from closing
            bvModalEvent.preventDefault()
            // Trigger submit handler
            this.handleSubmit().then(() => {
                this.$nextTick(() => {
                    this.$bvModal.hide('modal-prevent-closing')
                })
            })
        },
         async findAuthors() {
            this.resetModal()
            const url = `api/messages/author/chat/${this.activeChat.id}`
            this.$axios.$get(url, {newChatName: this.newChatName}).then(response => {
                this.authors = response.map(it => it.author)
            })
        },
        async updateChatName() {
            if (this.newChatName && this.activeChat.name !== this.newChatName) {
                const url = `api/chats/${this.activeChat.id}/name`
                return this.$axios.$patch(url, {newChatName: this.newChatName})
            }
        },
        async updateProfileImage() {

            if (this.newProfileImage) {
                const formData = new FormData();
                formData.append('image', this.newProfileImage);

                return this.$axios.put(`api/chats/${this.activeChat.id}/profile-image.jpg`, formData)
            }
        },
        async updateAuthor() {
            if (this.authorSelect && this.newAuthorName && this.newAuthorName !== this.authorSelect) {
                const url = `api/messages/author`
                return this.$axios.$patch(url, {
                    oldName: this.authorSelect,
                    newName: this.newAuthorName,
                    chatId: this.activeChat.id
                })
            }
        },
        async handleSubmit() {
            Promise.all(
                [
                    this.updateChatName(),
                    this.updateProfileImage(),
                    this.updateAuthor()
                ]
            ).then(() => {
                this.$nextTick(() => {
                    this.$bvModal.hide('modal-prevent-closing')
                })
                this.$emit('update:edit-chat')
            })


        }
    },
    computed: {

    }
}

</script>

<style scoped>

</style>