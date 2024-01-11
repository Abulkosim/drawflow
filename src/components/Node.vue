<template>
  <div class="card-devices">
    <span>{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: 'Node',
  props: ['content'],
  mounted() { },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.card-devices {
  font-weight: 600;
  font-size: 20px;
}

div {
  text-align: center;
}
</style>
