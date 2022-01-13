<template>
  <v-form v-model="valid" class="add-liquidity-form">
    <base-asset-amount-input
      :data="bindAsset1"
      :assets="assets"
      :placeholder="$t('liquidity.amount')"
      :rules="rules.asset1"
      fullfilled
      @update:asset="(v) => handleUpdateAsset('base', v)"
      @input="(v) => handleInput('base', v)"
    />

    <base-asset-amount-input
      :data="bindAsset2"
      :assets="assets"
      :placeholder="$t('liquidity.amount')"
      :rules="rules.asset2"
      fullfilled
      class="mt-4"
      @update:asset="(v) => handleUpdateAsset('quote', v)"
      @input="(v) => handleInput('quote', v)"
    />

    <slot name="information" />

    <slot name="action" :valid="valid" />
  </v-form>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import BigNumber from "bignumber.js";

@Component
class LiquidityAddForm extends Vue {
  @PropSync("asset1") bindAsset1;

  @PropSync("asset2") bindAsset2;

  @Prop() pair;

  lastEdit = "";

  valid = false;

  get meta() {
    let scale = 0;
    let hasLiquidity = false;
    let hasPrice = false;
    let reverse = false;

    if (this.pair) {
      const { baseAsset, quoteAsset, base_amount, quote_amount } =
        this.$utils.pair.getPairMeta(this, this.pair)!;

      reverse = !(
        baseAsset.id === this.bindAsset1.asset.id &&
        quoteAsset.id === this.bindAsset2.asset.id
      );
      hasLiquidity = +base_amount > 0 && +quote_amount > 0;
      hasPrice = +baseAsset.price > 0 && +quoteAsset.price > 0;

      if (hasLiquidity) {
        scale = +quote_amount / +base_amount;
      } else if (hasPrice) {
        scale = +baseAsset.price / +quoteAsset.price;
      }
    }

    return {
      scale,
      reverse,
    };
  }

  get assets() {
    return this.$store.getters[GlobalGetters.AVALIABLE_ADD_ASSETS];
  }

  get rules() {
    return {
      asset1: [
        () => !!this.bindAsset1.asset || this.$t("asset.required"),
        (v) => !!v || this.$t("amount.required"),
        (v) => +v > 0 || this.$t("amount.invalid"),
      ],
      asset2: [
        () => !!this.bindAsset2.asset || this.$t("asset.required"),
        (v) => !!v || this.$t("amount.required"),
        (v) => +v > 0 || this.$t("amount.invalid"),
      ],
    };
  }

  handleUpdateAsset(side: "base" | "quote", asset) {
    side === "base"
      ? this.handleUpdateBase({ asset })
      : this.handleUpdateQuote({ asset });

    this.handleUpdateRelative();
  }

  handleInput(side: "base" | "quote", amount) {
    this.lastEdit = side;

    side === "base"
      ? this.handleUpdateBase({ amount })
      : this.handleUpdateQuote({ amount });

    this.handleUpdateRelative();
  }

  handleChangeAsset() {
    const temp = this.bindAsset2.asset;

    this.bindAsset2.asset = this.bindAsset1.asset;
    this.bindAsset1.asset = temp;
  }

  handleUpdateBase(data) {
    if (data.asset?.id === this.bindAsset2.asset?.id) {
      this.handleChangeAsset();
      this.handleUpdateRelative();
      return;
    }

    this.bindAsset1 = { ...this.bindAsset1, ...data };
  }

  handleUpdateQuote(data) {
    if (data.asset?.id === this.bindAsset1.asset?.id) {
      this.handleChangeAsset();
      this.handleUpdateRelative();
      return;
    }

    this.bindAsset2 = { ...this.bindAsset2, ...data };
  }

  handleUpdateRelative() {
    this.$nextTick(() => {
      if (!this.pair || !this.meta.scale) return;

      const asset1Amount = this.bindAsset1.amount;
      const asset2Amount = this.bindAsset2.amount;
      const scale = this.meta.scale;
      const reverse = this.meta.reverse;
      const format = (v) =>
        new BigNumber(v).decimalPlaces(8, BigNumber.ROUND_DOWN).toString();

      if (this.lastEdit === "base") {
        if (asset1Amount === "") {
          this.handleUpdateQuote({ amount: "" });
        } else {
          const amount = reverse ? asset1Amount / scale : asset1Amount * scale;

          this.handleUpdateQuote({ amount: format(amount) });
        }
      } else {
        if (asset2Amount === "") {
          this.handleUpdateBase({ amount: "" });
        } else {
          const amount = reverse ? asset2Amount * scale : asset2Amount / scale;

          this.handleUpdateBase({ amount: format(amount) });
        }
      }
    });
  }
}
export default LiquidityAddForm;
</script>
