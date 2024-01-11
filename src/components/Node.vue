<template>
  <div class="card-devices">
    <span>{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: 'Node',
  props: ['content'],
  mounted() {
    console.log('NodeComponent mounted with text:', this.content);
  },
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
