<template>
  <div>
    <div v-if="!pair" class="mt-4 pl-4 pr-6 f-caption">
      {{ meta.hint }}
    </div>

    <v-layout justify-center>
      <f-button
        v-if="isLogged"
        rounded
        large
        depressed
        :disabled="meta.submitBtnDisabled"
        :loading="loading"
        color="primary"
        class="mt-5 px-14 f-title-2"
        @click="handleAddLiquidity"
      >
        {{ meta.submitBtnText }}
      </f-button>

      <f-button
        v-else
        rounded
        large
        depressed
        color="primary"
        class="mt-5 px-14 f-title-2"
        @click="handleLogin"
      >
        {{ $t("connect.wallet") }}
      </f-button>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { DepositParams } from "~/utils/payment";
import { v4 as uuid } from "uuid";

@Component
class LiqAddAction extends Vue {
  @Prop() pair!: API.Pair | null;

  @Prop() baseAsset!: API.Asset | null;

  @Prop() quoteAsset!: API.Asset | null;

  @Prop() baseAmount!: string;

  @Prop() quoteAmount!: string;

  @Prop() disabled!: boolean;

  @Getter("auth/isLogged") isLogged;

  loading = false;

  get meta() {
    const isLake = this.$config.CHANNEL === "lake";
    const valid =
      !this.pair ||
      (this.baseAsset &&
        this.baseAmount &&
        this.quoteAsset &&
        this.quoteAmount);

    let submitBtnText: any = "";
    let submitBtnDisabled = !valid || this.disabled;
    let hint = this.$t("liquidity.add.create.hint");
    if (!this.pair) {
      if (isLake) {
        submitBtnText = this.$t("liquidity.create.not-support");
        submitBtnDisabled = true;
        hint = this.$t("liquidity.create.pair.not-support");
      } else {
        submitBtnText = this.$t("liquidity.create.new-pool");
      }
    } else if (valid) {
      submitBtnText = this.$t("next");
    } else {
      submitBtnText = this.$t("enter.amount");
    }

    return {
      valid,
      hint,
      submitBtnText,
      submitBtnDisabled,
    };
  }

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }

  async handleAddLiquidity() {
    if (!this.baseAsset || !this.quoteAsset) return;
    if (!this.pair) {
      this.$router.push({
        name: "liquidity-create",
        query: {
          base: this.baseAsset.id,
          quote: this.quoteAsset.id,
          jumpUrl: window.location.href,
        },
      });
      return;
    }
    const depositId = uuid();
    const basePayment: DepositParams = {
      follow_id: depositId,
      asset_id: this.baseAsset.id,
      trace_id: uuid(),
      opposite_asset_id: this.quoteAsset.id,
      amount: this.baseAmount,
    };
    const quotePayment: DepositParams = {
      follow_id: depositId,
      asset_id: this.quoteAsset.id,
      trace_id: uuid(),
      opposite_asset_id: this.baseAsset.id,
      amount: this.quoteAmount,
    };
    this.$store.commit("liquidity/SET_DEPOSITS", [basePayment, quotePayment]);
    this.$router.push({
      name: "liquidity-check",
      query: { base: this.baseAsset.id, quote: this.quoteAsset.id },
    });
  }
}
export default LiqAddAction;
</script>
