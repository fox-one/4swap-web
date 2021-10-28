<template>
  <f-bottom-sheet v-model="dialog" :title="$t('chart')">
    <template #activator="{ on }">
      <div class="type-field" v-on="on">
        <span class="mr-2 f-body-2">{{ display }}</span>
        <v-icon size="16"> $FIconChevronDown4P </v-icon>
      </div>
    </template>

    <base-select-item
      v-for="(item, index) in items"
      :key="index"
      :title="item.text"
      :value="item.value"
      :active="item.value === bindValue"
      @select="handleSelect"
    />
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component
class TypeSelect extends Vue {
  @PropSync("value") bindValue;

  @Prop() pair;

  dialog = false;

  get display() {
    return this.items.find((x) => x.value === this.bindValue)?.text;
  }

  get items() {
    const baseItems = [
      { text: this.$t("chart.chart-type.volume"), value: "volume" },
      { text: this.$t("chart.chart-type.liquidity"), value: "liquidity" },
    ];

    if (this.pair) {
      const pairMeta = this.$utils.pair.getPairMeta(this, this.pair)!;
      const { baseAsset, quoteAsset } = pairMeta;
      const symbol = `${baseAsset.symbol} / ${quoteAsset.symbol}`;
      const reverseSymbol = `${quoteAsset.symbol} / ${baseAsset.symbol}`;
      const priceItems = [
        { text: this.$t("price") + ` (${symbol})`, value: "0" },
        { text: this.$t("price") + ` (${reverseSymbol})`, value: "1" },
      ];

      return [...baseItems, ...priceItems];
    }

    return baseItems;
  }

  handleSelect(value) {
    this.dialog = false;
    this.bindValue = value;
  }
}
export default TypeSelect;
</script>

<style lang="scss" scoped>
.type-field {
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  padding: 8px 12px;
  background: #def3f4;
  border-radius: 8px;
}
</style>
