<template>
  <v-layout justify-center>
    <v-btn
      rounded
      large
      depressed
      color="primary"
      class="mt-5 px-14 font-weight-bold"
      :disabled="!valid"
      @click="handleRemoveLiq"
    >
      {{ $t("next") }}
    </v-btn>
    <remove-liq-success-modal ref="removeSuccessModal" @ok="handleToIndex" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { v4 as uuidv4 } from "uuid";
import RemoveLiqSuccessModal from "./RemoveLiqSuccessModal.vue";

@Component({
  components: {
    RemoveLiqSuccessModal,
  },
})
class LiqRemoveAction extends Vue {
  @Prop() baseAsset;

  @Prop() quoteAsset;

  @Prop() amount;

  @Prop() liquidityAsset;

  @Prop() pair;

  @Prop() hasLiquidity;

  get valid() {
    return this.amount > 0 && this.hasLiquidity;
  }

  handleRemoveLiq() {
    const balance = this.$store.getters["global/getBalanceByAssetId"](
      this.liquidityAsset?.id
    );
    console.log(Number(balance), Number(this.amount));
    if (Number(balance) < Number(this.amount)) {
      return;
    }
    const removeLPAmount = this.amount;
    const asset = this.liquidityAsset.id;
    const traceId = uuidv4();
    this.$utils.payment.remove(this, {
      follow_id: traceId,
      amount: removeLPAmount,
      asset_id: asset,
    });

    this.pullResult(
      this.pair?.base_asset_id,
      this.pair?.quote_asset_id,
      traceId
    );
  }

  async pullResult(base, quote, follow) {
    try {
      this.$store.commit("app/SET_PAYING", { visible: true });
      const res = await this.$http.getMyTransaction({ base, quote, follow });
      this.handleRemoveSuccess(res);
      this.$store.commit("app/SET_PAYING", { visible: false });
    } catch (error) {
      const timer = setTimeout(() => {
        this.pullResult(base, quote, follow);
      }, 3000);
      this.$store.commit("app/SET_PAYING", { timer });
    }
  }

  handleRemoveSuccess(transaction: API.Transaction) {
    setTimeout(() => {
      this.$utils.helper.loadWalletAssets(this);
      this.$store.dispatch("global/getAllAddedPairs");
    }, 1000);
    const modal = this.$refs.removeSuccessModal as any;
    if (modal) {
      modal.show(transaction);
    }
  }

  handleToIndex() {
    this.$router.push({ name: "index" });
  }
}
export default LiqRemoveAction;
</script>
