<template>
  <a :href="src" target="_blank" class="doc">
    <DocumentIcon />
    <span>Documentation</span>
  </a>
</template>
<script>
import DocumentIcon from '../icons/DocumentIcon.vue';
export default {
  name: "Documentation",
  components: { DocumentIcon },
  data() {
    return {
      src: "https://pinto-soap-1e4.notion.site/Botplaton-bd9240cd67624ee2adf785e78e038f6b"
    }
  }
};
</script>
<style scoped>
.doc {
  display: flex;
  align-items: center;
  gap: 5px;
  position: absolute;
  top: 300px;
  right: 7px;
  border-radius: 8px;
  background: rgba(0, 176, 108, 0.7);
  user-select: none;
  z-index: 1;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 180px;
}

.doc svg {
  width: 24px;
  height: 24px;
}

a {
  color: #fff;
  font-size: 16px;
  text-decoration: none;
}

.doc:hover {
  background: rgba(0, 176, 108, 0.8);
}
</style>