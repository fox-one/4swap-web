<template>
  <div class="d-flex justify-center pa-5">
    <f-loading size="28" color="primary" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class Loading extends Vue {}
export default Loading;
</script>
