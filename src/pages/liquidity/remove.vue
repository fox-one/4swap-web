<template>
  <v-container class="pa-0">
    <f-loading v-if="loading" :loading="loading" fullscreen />
    <template v-else>
      <f-panel class="no-border-radius">
        <div class="f-title-3 text-center f-greyscale-3 mb-3">
          {{ $t("liquidity.remove.how-much") }}
        </div>
        <base-asset-amount-input-simple
          v-model="removeAmount"
          :asset="meta.liquidityAsset"
          :precision="8"
          @input="handleInputBlur"
        />
        <base-balance-field
          :balance="meta.liquidityAssetBalance"
          :symbol="meta.liquidityAsset.symbol"
          class="f-caption f-greyscale-3 mx-3 my-2"
          @click:balance="handleBalanceClick"
        />
        <v-slider
          v-model="percent"
          :tick-labels="ticksLabels"
          ticks="always"
          thumb-size="100"
          tick-size="5"
          track-color="#EEEEEE"
          background-color="transparent"
          step="1"
          class="percent-slider ma-4"
          min="0"
          max="100"
        />
        <liq-remove-action
          :pair="pair"
          :amount="removeAmount"
          :base-asset="meta.baseAsset"
          :quote-asset="meta.quoteAsset"
          :liquidity-asset="meta.liquidityAsset"
          :has-liquidity="meta.hasLiquidity"
        />
      </f-panel>
      <f-panel class="mt-4 pa-0 py-4 no-border-radius">
        <div class="f-title-1 pl-4">
          {{ $t("predication") }}
        </div>
        <f-info-grid :window-size="2">
          <f-info-grid-item
            v-for="(item, ix) in pannelData"
            :key="ix"
            :index="ix"
            :title="item.title"
            :value="item.value"
            :value-unit="item.valueUnit"
            :value-custom-color="item.valueCustomColor"
            :hint="item.hint"
          />
        </f-info-grid>
      </f-panel>
      <base-swap-introduction />
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import mixins from "@/mixins";
import { IPair } from "~/services/types/vo";
import { Getter } from "vuex-class";
import SharedTabs from "@/components/particles/liquidity/shared-pair/SharedTabs.vue";
import LiqRemoveAction from "@/components/particles/liquidity/LiqRemoveAction.vue";

@Component({
  components: {
    SharedTabs,
    LiqRemoveAction,
  },
})
class RemoveLiquidityPage extends Mixins(mixins.page) {
  @Getter("global/getAssetById") getAssetById;

  @Getter("global/getPair") getPair;

  removeAmount = 0;

  percent = 0;

  loading = false;

  isHandleBlur = false;

  get pannelData() {
    const data = this.meta;
    const toFixed = this.$utils.number.toFixed;
    return [
      {
        title: `${this.$t("liquidity.remove.action")} ${data.baseAsset.symbol}`,
        value: `${
          !data.removeBaseAmount
            ? data.removeBaseAmount
            : toFixed(data.removeBaseAmount, 8)
        } ${data.baseAsset.symbol}`,
      },
      {
        title: `${this.$t("liquidity.remove.action")} ${
          data.quoteAsset.symbol
        }`,
        value: `${
          !data.removeQuoteAmount
            ? data.removeQuoteAmount
            : toFixed(data.removeQuoteAmount, 8)
        } ${data.quoteAsset.symbol}`,
      },
      {
        title: this.$t("equivaluent"),
        value: data.totalValueText,
      },
      {
        title: this.$t("liquidity.percent.abbr"),
        value: data.percent,
      },
    ];
  }

  get pair(): IPair | undefined {
    const base = this.$route.query.base;
    const quote = this.$route.query.quote;
    return this.getPair({ base, quote });
  }

  get title() {
    return this.$t("liquidity.remove") as string;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get meta() {
    const getBalance = this.$store.getters["global/getBalanceByAssetId"];
    const k = Number(this.pair?.liquidity);
    const baseAsset = this.getAssetById(this.pair?.base_asset_id);
    const quoteAsset = this.getAssetById(this.pair?.quote_asset_id);
    const totalBaseAmount = Number(this.pair?.base_amount ?? 0);
    const totalQuoteAmount = Number(this.pair?.quote_amount ?? 0);
    const liquidityAsset = this.getAssetById(this.pair?.liquidity_asset_id);
    const liquidityAssetBalance = getBalance(this.pair?.liquidity_asset_id);
    const balance = this.$store.getters["global/getBalanceByAssetId"](
      this.pair?.liquidity_asset_id
    );
    const s = Number(balance ?? 0);
    const percent = k > 0 ? Math.min(s / k, 1) : 0;
    const sharedBaseAmount = totalBaseAmount * percent;
    const sharedQuoteAmount = totalQuoteAmount * percent;
    const removeBaseAmount = (sharedBaseAmount * this.percent) / 100;
    const removeQuoteAmount = (sharedQuoteAmount * this.percent) / 100;
    const hasLiquidity =
      Number(sharedBaseAmount) > 0 && Number(sharedQuoteAmount) > 0;
    const totalValue =
      sharedBaseAmount * Number(baseAsset?.price ?? 0) +
      sharedQuoteAmount * Number(quoteAsset?.price ?? 0);
    const totalValueText = this.$utils.number.formatFiat(this, totalValue);

    return {
      hasLiquidity,
      baseAsset,
      quoteAsset,
      liquidityAsset,
      liquidityAssetBalance,
      sharedBaseAmount,
      sharedQuoteAmount,
      removeBaseAmount,
      removeQuoteAmount,
      totalAmount: s,
      percent: this.$utils.number.toPercent(
        percent * (this.percent / 100),
        false,
        6
      ),
      totalValueText,
    };
  }

  get ticksLabels() {
    return Array.apply(null, { length: 100 } as any).map((v, k) => {
      if ((k + 1) % 25 === 0) {
        return `${k + 1}%`;
      }

      return "";
    });
  }

  mounted() {
    this.checkLiquidity();
  }

  handleToAdd() {
    this.$router.push({
      name: "liquidity-add",
      query: { base: this.$route.query.base, quote: this.$route.query.quote },
    });
  }

  async checkLiquidity() {
    if (!this.meta.hasLiquidity) {
      this.$utils.helper.message(
        this,
        {
          title: this.$t("liquidity.remove.no-share") as string,
          description: this.$t(
            "liquidity.remove.no-share.description"
          ) as string,
          ok: this.$t("liquidity.add") as string,
        },
        {
          onOK: () => {
            this.handleToAdd();
          },
        }
      );
    }
  }

  handleBalanceClick() {
    this.removeAmount = this.meta.liquidityAssetBalance;
    this.handleInputBlur();
  }

  handleInputBlur() {
    if (+this.removeAmount > +this.meta.totalAmount) {
      this.removeAmount = this.meta.totalAmount;
    }

    const percent = (+this.removeAmount / +this.meta.totalAmount) * 100;

    if (this.percent !== percent) {
      this.isHandleBlur = true;
      this.percent = percent;
    }
  }

  @Watch("percent")
  handleSliderChange() {
    if (this.isHandleBlur) {
      setTimeout(() => (this.isHandleBlur = false));
      return;
    }
    const toFixed = this.$utils.number.toFixed;
    const amount = +toFixed((this.meta.totalAmount * this.percent) / 100, 8);
    if (this.removeAmount !== amount) this.removeAmount = amount;
  }
}
export default RemoveLiquidityPage;
</script>
<style lang="scss" scoped>
.percent-slider {
  ::v-deep {
    .v-slider__tick {
      opacity: 0;
    }
    .v-slider__tick:nth-of-type(25n) {
      opacity: 1;
      width: 8px !important;
      height: 8px !important;
      border-radius: 50%;
      background-color: #e0e0e0;
      top: calc(50% - 4px) !important;
    }
    .v-slider__tick.v-slider__tick--filled {
      background-color: var(--v-primary-base) !important;
    }
  }
}
</style>
