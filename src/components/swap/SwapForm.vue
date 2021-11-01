<template>
  <div>
    <f-asset-swap-form :hide-switch="meta.hideSwitch" @switch="handleSwitch">
      <template #input>
        <base-asset-amount-input
          :data="bindInput"
          :assets="assets"
          :placeholder="$t('sell')"
          @update:asset="(v) => handleUpdateAsset('input', v)"
          @input="(v) => handleInput('input', v)"
        />
      </template>

      <template #output>
        <base-asset-amount-input
          :data="bindOutput"
          :assets="assets"
          :placeholder="$t('received')"
          @update:asset="(v) => handleUpdateAsset('output', v)"
          @input="(v) => handleInput('output', v)"
        />
      </template>
    </f-asset-swap-form>

    <swap-form-informations
      :pair="pair"
      :order="order"
      :input-asset="input.asset"
      :output-asset="output.asset"
      class="mt-6"
    />

    <div class="text-center">
      <swap-action
        :valid="valid"
        :order="order"
        :input-asset="input.asset"
        :output-asset="output.asset"
        :input-amount="input.amount"
        :output-amount="output.amount"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { debounce } from "@foxone/utils/helper";
import SwapFormInformations from "./SwapFormInformations.vue";
import SwapAction from "./SwapAction.vue";

@Component({
  components: {
    SwapFormInformations,
    SwapAction,
  },
})
class SwapForm extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() order!: API.SwapOrder;

  @PropSync("input") bindInput;

  @PropSync("output") bindOutput;

  lastEdit = "";

  get assets() {
    return this.$store.getters[GlobalGetters.AVALIABLE_SWAP_ASSETS];
  }

  get meta() {
    const hideSwitch = !this.bindInput.asset && !this.bindOutput.asset;

    return { hideSwitch };
  }

  get valid() {
    return (
      this.order &&
      this.bindInput.asset &&
      this.bindInput.amount &&
      this.bindOutput.asset &&
      this.bindOutput.amount
    );
  }

  handleInput(side: "input" | "output", amount) {
    this.lastEdit = side;

    if (side === "input") {
      this.handleUpdateInput({ amount });
    } else {
      this.handleUpdateOutput({ amount });
    }

    this.requestPreOrder(this);
  }

  handleUpdateAsset(side: "input" | "output", asset) {
    if (side === "input") {
      this.handleUpdateInput({ asset });
    } else {
      this.handleUpdateOutput({ asset });
    }

    this.requestPreOrder(this);
  }

  handleSwitch() {
    const change = () =>
      (this.lastEdit = this.lastEdit === "input" ? "output" : "input");

    if (this.lastEdit === "input") {
      this.handleChangeAsset();
      this.bindOutput.amount = this.bindInput.amount;

      change();
      this.requestPreOrder(this);
    } else {
      this.handleChangeAsset();
      this.bindInput.amount = this.bindOutput.amount;

      change();
      this.requestPreOrder(this);
    }
  }

  handleChangeAsset() {
    const temp = this.bindOutput.asset;

    this.bindOutput.asset = this.bindInput.asset;
    this.bindInput.asset = temp;
  }

  handleUpdateInput(data) {
    if (data.asset === this.bindOutput.asset) {
      this.handleChangeAsset();
      this.requestPreOrder(this);
      return;
    }

    this.bindInput = { ...this.bindInput, ...data };
  }

  handleUpdateOutput(data) {
    if (data.asset === this.bindInput.asset) {
      this.handleChangeAsset();
      this.requestPreOrder(this);
      return;
    }

    this.bindOutput = { ...this.bindOutput, ...data };
  }

  requestPreOrder = debounce(async (vm: any) => {
    const inputAsset = vm.bindInput.asset;
    const outputAsset = vm.bindOutput.asset;
    const inputAmount = vm.bindInput.amount;
    const outputAmount = vm.bindOutput.amount;
    const params = vm.lastEdit === "input" ? { inputAmount } : { outputAmount };

    try {
      if (!inputAsset || !outputAsset) {
        return;
      }

      const order = await vm.$pairRoutes.getPreOrder({
        inputAsset: inputAsset.id,
        outputAsset: outputAsset.id,
        ...params,
      });

      this.$emit("update:order", order);

      if (params.inputAmount) {
        vm.handleUpdateOutput({ amount: order.amount });
      } else {
        vm.handleUpdateInput({ amount: order.funds });
      }
    } catch (error) {
      this.$emit("update:order", null);

      if (params.inputAmount !== undefined) {
        vm.handleUpdateOutput({ amount: "" });
      } else {
        vm.handleUpdateInput({ amount: "" });
      }
    }
  }, 100);
}
export default SwapForm;
</script>
