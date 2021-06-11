<template>
  <v-container class="pa-0">
    <f-loading v-if="loading" :loading="loading" fullscreen />
    <template v-else>
      <f-panel class="pb-0 no-border-radius">
        <div class="f-title-3 text-center f-greyscale-3 px-4">
          {{ hint }}
        </div>
        <liq-payment-action
          v-for="(payment, index) in meta.payments"
          v-on:onPaid="handlePay"
          :key="index"
          :payment="payment"
          :order.sync="order"
        />
      </f-panel>
      <div class="px-4 pt-4">
        <liq-payment-tip :has-lp-asset="meta.hasLPAsset" />
      </div>
      <base-swap-introduction />
      <add-liq-success-modal ref="addSuccessModal" @ok="handleToIndex" />
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import OrderNotFoundTip from "@/components/particles/liquidity/OrderNotFoundTip.vue";
import LiqPaymentAction from "@/components/particles/liquidity/LiqPaymentAction.vue";
import LiqPaymentTip from "@/components/particles/liquidity/LiqPaymentTip.vue";
import LiqCompleteAction from "@/components/particles/liquidity/LiqCompleteAction.vue";
import AddLiqSuccessModal from "@/components/particles/liquidity/AddLiqSuccessModal.vue";
import { Getter } from "vuex-class";

@Component({
  components: {
    OrderNotFoundTip,
    LiqPaymentAction,
    LiqPaymentTip,
    LiqCompleteAction,
    AddLiqSuccessModal,
  },
})
class CheckLiquidityPage extends Mixins(mixins.page) {
  @Getter("global/getPair") getPair;

  order: API.DepositOrder | null = null;

  loading = false;

  paidDict: { [id: string]: boolean } = {};

  get title() {
    const symbol = `${this.baseAsset?.symbol}-${this.quoteAsset?.symbol}`;
    return this.$t("liquidity.add.symbol.title", { symbol }) as string;
  }

  get baseAsset(): API.Asset | null {
    return this.$store.state.liquidity.baseAsset;
  }

  get quoteAsset(): API.Asset | null {
    return this.$store.state.liquidity.quoteAsset;
  }

  get hint() {
    return this.$t("liquidity.add.hint", {
      symbol_1: this.baseAsset?.symbol,
      symbol_2: this.quoteAsset?.symbol,
    });
  }

  get pair(): API.Pair | undefined {
    const base = this.baseAsset?.id;
    const quote = this.quoteAsset?.id;
    return this.getPair({ base, quote });
  }

  get meta() {
    const deposits = this.$store.state.liquidity.deposits;
    const payments =
      deposits.concat().sort((a, b) => {
        return a.asset_id > b.asset_id ? -1 : 1;
      }) ?? [];
    const hasLPAsset = this.pair?.liquidity_asset_id;
    return { payments, hasLPAsset };
  }

  async handlePay(trace_id: string) {
    this.paidDict[trace_id] = true;
    if (Object.keys(this.paidDict).length >= 2) {
      const modal = this.$refs.addSuccessModal as any;
      if (modal) {
        try {
          const id = this.meta?.payments[0].follow_id;
          const order = await this.$http.getDepositOrder(id);
          modal.show(order);
        } catch (error) {
          this.$utils.helper.errorHandler(this, error);
        }
      }
    }
  }

  handleToIndex() {
    this.$router.push({ name: "index" });
  }
}
export default CheckLiquidityPage;
</script>
