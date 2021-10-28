<template>
  <div v-if="meta">
    <div class="mt-3 chart-title">
      {{ meta.title }}
    </div>
    <div class="mt-3 label-3 subtitle">
      {{ meta.subtitle }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PriceTitleSection extends Vue {
  @Prop() current;

  @Prop() pair;

  get meta() {
    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;

    if (!time) {
      return null;
    }

    return {
      title: this.$utils.number.format({ n: data }),
      subtitle: this.$utils.time.format(time, "MMM DD HH:mm A Z"),
    };
  }
}
export default PriceTitleSection;
</script>

<style lang="scss" scoped>
.chart-title {
  font-size: 25px;
  line-height: 30px;
  font-weight: bold;
  letter-spacing: -0.02em;
  font-feature-settings: "salt" on;
}

.subtitle {
  font-weight: 500;
}
</style>
