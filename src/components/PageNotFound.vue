<template>
  <div class="container">
    <div class="content" ref="notFound">
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="#5e5e5e" viewBox="0 0 256 256">
        <path
          d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z">
        </path>
      </svg>
      <h1 class="title">Page Not Found</h1>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.animateNotFound();
  },
  methods: {
    animateNotFound() {
      const notFound = this.$refs.notFound;
      notFound.animate([
        { transform: 'translateY(-20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 700,
        easing: 'linear',
        fill: 'forwards'
      });
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  background: #f2f6fa;
  color: #5e5e5e
}

.content {
  position: relative;
  top: -30px;
  user-select: none;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.title {
  font-size: 3rem;
  line-height: 4rem;

  @media screen and (max-width: 540px) {
    font-size: 2.5rem;
    line-height: 3.2rem;
  }

  @media screen and (max-width: 320px) {
    font-size: 1.8rem;
    line-height: 2.2rem;

  }
}

svg {
  @media screen and (max-width: 540px) {
    width: 120px;
    height: 120px;
  }

  @media screen and (max-width: 320px) {
    width: 100px;
    height: 100px;
  }
}
</style>
