<template>
  <div class="card-devices">
    <div class="body">
      <span> {{ name }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name'],
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
