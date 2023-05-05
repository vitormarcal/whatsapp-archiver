<template>

  <div class="container-fluid">
      <ChatList :chats="chats"/>

      <MessageArea />
  </div>

</template>

<script>
export default {
  name: 'IndexPage',
    async asyncData({ $axios }) {
      const chats = await $axios.$get('http://localhost:3000/api/chats/')
      return { chats }
  }
}
</script>
