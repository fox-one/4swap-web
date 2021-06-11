<template>
  <div v-if="notSupport" class="intersect-wrapper">
    <slot />
  </div>
  <div
    v-else
    v-intersect="{ handler: handleIntersect }"
    class="intersect-wrapper"
  >
    <div v-show="isIntersecting" class="intersect-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class IntersectWrapper extends Vue {
  notSupport = this.$utils.helper.notSupportIntersect();

  isIntersecting = false;

  mounted() {
    if (this.notSupport) {
      this.isIntersecting = true;
    }
  }

  handleIntersect(_enteries, _observer, isIntersecting) {
    if (!this.notSupport) {
      this.isIntersecting = isIntersecting;
    }
  }
}
export default IntersectWrapper;
</script>
