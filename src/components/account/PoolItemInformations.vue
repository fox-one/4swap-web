<template>
  <div class="informations">
    <base-information-list :items="items" reactive />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Render from "../base/Render";

@Component({
  components: {
    Render,
  },
})
class PoolItemInformations extends Vue {
  @Prop() pair;

  profitIndex = 0;

  get items() {
    const h = this.$createElement;
    const format = this.$utils.number.format;
    const toPercent = this.$utils.number.toPercent;
    const attachSign = this.$utils.number.attachSign;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const getColor = this.$utils.color.getColor;
    const pairMeta = getPairMeta(this, this.pair);

    const { shared, profit } = this.pair;
    const { baseAsset, quoteAsset } = pairMeta || {};

    const sharedBaseAmount = shared?.sharedBaseAmount ?? 0;
    const sharedQuoteAmount = shared?.sharedQuoteAmount ?? 0;
    const sharedBaseAmountText = format({ n: sharedBaseAmount, dp: 8 });
    const sharedQuoteAmountText = format({ n: sharedQuoteAmount, dp: 8 });

    const baseProfit = profit?.baseProfit ?? 0;
    const quoteProfit = profit?.quoteProfit ?? 0;
    const baseProfitText = attachSign({
      n: baseProfit,
      text: format({ n: Math.abs(baseProfit), dp: 8 }),
    });
    const quoteProfitText = attachSign({
      n: quoteProfit,
      text: format({ n: Math.abs(quoteProfit), dp: 8 }),
    });

    const profitValue = this.profitIndex === 0 ? baseProfit : quoteProfit;
    const profitText =
      this.profitIndex === 0
        ? `${baseProfitText} ${baseAsset?.symbol}`
        : `${quoteProfitText} ${quoteAsset?.symbol}`;

    const profitRate = profit?.baseProfitRate ?? 0;
    const profitRateText = `${toPercent({ n: profitRate })}`;

    return [
      {
        title: baseAsset?.symbol,
        value: sharedBaseAmountText,
      },
      {
        title: quoteAsset?.symbol,
        value: sharedQuoteAmountText,
      },
      {
        title: this.$t("profits"),
        icon: "$IconSwitcher",
        titleFn: () => {
          this.profitIndex = (this.profitIndex + 1) % 2;
        },
        value: h("span", { style: { color: getColor(this, profitValue) } }, [
          profitText,
        ]),
      },
      {
        title: this.$t("profits.rate"),
        value: h("span", { style: { color: getColor(this, profitRate) } }, [
          profitRateText,
        ]),
      },
    ];
  }
}
export default PoolItemInformations;
</script>

<style lang="scss" scoped>
.informations {
  ::v-deep {
    .information-item {
      flex-direction: column;

      .label-3 {
        font-weight: 500;
      }

      .spacer {
        display: none;
      }

      .information-item__value {
        margin-left: 0;
        margin-top: 8px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
      }
    }
  }
}
</style>
