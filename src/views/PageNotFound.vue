<template>
  <div class="container">
    <div class="content" ref="notFound">
      <NotFoundIcon />
      <h1 class="title">Page Not Found</h1>
    </div>
  </div>
</template>

<script>
import NotFoundIcon from '../components/icons/NotFoundIcon.vue';

export default {
  mounted() {
    this.animateNotFound();
  },
  methods: {
    animateNotFound() {
      const notFound = this.$refs.notFound;
      notFound.animate([
        { transform: 'translateY(-10px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 700,
        easing: 'linear',
        fill: 'forwards'
      });
    }
  },
  components: { NotFoundIcon }
}
</script>
<style scoped>
@import '../assets/error.page.css';
</style>
