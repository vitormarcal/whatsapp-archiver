<template>
    <div class="chat-item d-flex flex-row p-2 w-100 border-bottom  ">
        <img src="/default-profile-image.png" alt="Profile Photo" class="img-fluid rounded-circle mr-2"
             style="height:50px;">
        <div class="w-50">
            <div class="name">{{ item.name }}</div>
            <div class="small">
                <i class="far fa-check-circle mr-1"></i>
                {{ item.lastMessage.content }}
            </div>
        </div>
        <div class="flex-grow-1 text-right">
            <div class="small">{{ item.lastMessage.createdAt }}</div>
            <div class="badge badge-success badge-pill small">{{ item.messagesCount }}</div>
        </div>

    </div>
</template>
<script>
export default {
    props: ['item', 'myName'],
    created() {
        console.log(this.item)
    }
}
</script>