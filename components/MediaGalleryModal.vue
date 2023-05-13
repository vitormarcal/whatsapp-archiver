<template>

    <b-modal
            size="xl"
            scrollable
            centered
            id="modal-media-gallery"
            ref="modal"
            v-on:show="getUrlMedias"
            title="Media Gallery"
    >

        <b-container fluid class="p-4 bg-dark">
            <template v-for="group in mediaGroups">
                <b-row>
                    <template v-for="(message, index) in group">
                        <b-col>
                            <attachment :message="message"></attachment>
                        </b-col>
                    </template>

                </b-row>
            </template>


        </b-container>

    </b-modal>


</template>

<script>

export default {
    props: ['activeChat'],
    data() {
        return {
            mediaGroups: []
        }
    },
    methods: {
        async getUrlMedias() {
                const url = `api/chats/${this.activeChat.id}/messages/attachments`
                const response = await this.$axios.$get(url)

            this.mediaGroups = response.reduce((acc, cur, i) => {
                if (i % 3 === 0) acc.push([]);
                acc[acc.length - 1].push(cur);
                return acc;
            }, []);

        },
    }
}

</script>

<style scoped>

</style>