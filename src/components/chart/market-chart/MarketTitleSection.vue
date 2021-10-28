<template>
  <div v-if="meta">
    <div class="mt-3">
      <base-fiat-division :parts="meta.title" />
    </div>
    <div class="mt-3 label-3 subtitle">{{ meta.subtitle }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class TitleSection extends Vue {
  @Prop() current;

  @Prop() pair;

  get meta() {
    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;

    if (!time) {
      return null;
    }

    return {
      title: this.$utils.currency.toFiat(this, { n: data }, true),
      subtitle: this.$utils.time.format(time, "MMM DD, YYYY"),
    };
  }
}
export default TitleSection;
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: 500;
}
</style>
