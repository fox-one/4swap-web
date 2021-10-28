<template>
  <div v-if="meta">
    <div v-html="meta.title" class="mt-3 chart-title"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class ChartTitleThumb extends Vue {
  @Prop() pair;

  @Prop() current;

  @Prop() type;

  get meta() {
    const getPairMeta = this.$utils.pair.getPairMeta;
    const format = this.$utils.number.format;
    const toFiat = this.$utils.currency.toFiat;

    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;

    if (!time) {
      return null;
    }

    const { baseAsset, quoteAsset } = getPairMeta(this, this.pair)!;
    const baseAssetSymbol = baseAsset.symbol;
    const quoteAssetSymbol = quoteAsset.symbol;
    const sign = +data >= 0 ? "+" : "-";

    let title;

    if (this.type === 2) {
      title = `${sign} ${toFiat(this, { n: Math.abs(data) })}`;
    } else {
      const symbol = this.type === 0 ? baseAssetSymbol : quoteAssetSymbol;

      title = `${sign} ${format({
        n: Math.abs(data),
      })} <span class='symbol'>${symbol}</span>`;
    }

    return {
      title,
    };
  }
}
export default ChartTitleThumb;
</script>

<style lang="scss" scoped>
.chart-title {
  font-size: 25px;
  line-height: 30px;
  font-weight: bold;
  letter-spacing: -0.02em;
  font-feature-settings: "salt" on;
}
</style>
