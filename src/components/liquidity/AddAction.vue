<template>
  <div class="mt-6 text-center">
    <add-liquidity-payment-modal
      ref="paymentModal"
      :asset1="asset1"
      :asset2="asset2"
      :pair="pair"
    />

    <template v-if="meta.isNotSupport">
      <div class="label-3 mb-6 text-left">
        {{ $t("liquidity.create.pair.not-support") }}
      </div>

      <route-to-create-action
        hide-while-not-support
        :asset1="asset1.asset"
        :asset2="asset2.asset"
      />
    </template>

    <template v-else>
      <base-connect>
        <f-button :disabled="meta.disabled" color="primary" @click="handleNext">
          {{ $t("next") }}
        </f-button>
      </base-connect>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RouteToCreateAction from "./RouteToCreateAction.vue";
import AddLiquidityPaymentModal from "./add-liquidity-payment-modal/AddLiquidityPaymentModal.vue";

@Component({
  components: {
    RouteToCreateAction,
    AddLiquidityPaymentModal,
  },
})
class AddAction extends Vue {
  @Prop() asset1;

  @Prop() asset2;

  @Prop() pair;

  @Prop() valid;

  get meta() {
    const selected = this.asset1.asset && this.asset2.asset;
    const isNotSupport = selected && !this.pair;
    const disabled = !selected || !this.valid;

    return {
      selected,
      disabled,
      isNotSupport,
    };
  }

  handleNext() {
    this.handleShowPaymentModal();
  }

  handleShowPaymentModal() {
    const modal: any = this.$refs.paymentModal;

    modal.show();
  }
}
export default AddAction;
</script>
