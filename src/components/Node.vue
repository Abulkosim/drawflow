<template>
  <div class="card-devices">
    <div class="body">
      <span> {{ text }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['text', 'value'],
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
