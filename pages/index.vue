<template>

  <div class="container-fluid">
      <ChatList :chats="chats" :my-name="myName"/>

      <MessageArea :my-name="myName"/>
  </div>

</template>

<script>
export default {
  name: 'IndexPage',
    data() {
      return {
          myName: 'Vítor Marçal'
      }
    },
    async asyncData({ $axios }) {
      const chats = await $axios.$get('http://localhost:3000/api/chats/')
      return { chats }
  }
}
</script>
