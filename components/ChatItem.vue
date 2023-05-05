<template>
    <div class="chat-item d-flex flex-row p-2 w-100 border-bottom  ">
        <img src="/default-profile-image.png" alt="Profile Photo" class="img-fluid rounded-circle mr-2"
             style="height:50px;">
        <div class="w-50">
            <div class="name">Fulano</div>
            <div class="small">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
        </div>
        <div class="flex-grow-1 text-right">
            <div class="small">27/03/2018</div>
            <div class="badge badge-success badge-pill small">10</div>
        </div>

    </div>
</template>
<script>
export default {
    props: ['item'],
    created() {
        console.log(this.item)
    }
}
</script>