<template>
  <nav class="navbar">
    <b-button size="sm" class="my-2 my-sm-0" type="submit"  @click="doImport">Import</b-button>
  </nav>
</template>

<script>
export default {
  methods: {
    async doImport() {
      await this.$axios.$get('api/chats/force-import')
      this.$emit('update:page')
      this.$bvToast.toast(`Importação realizada`, {
        title: 'Import Status',
        autoHideDelay: 5000,
      })
    }
  }
}
</script>

<style scoped>
.navbar {
  background: rgb(15, 59, 62);
}
</style>