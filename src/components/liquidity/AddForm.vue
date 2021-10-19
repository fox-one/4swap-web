<template>
  <v-form v-model="valid" class="add-liquidity-form">
    <add-form-input :data.sync="bindAsset1" :opponent="bindAsset2.asset" />

    <add-form-input
      :data.sync="bindAsset2"
      :opponent="bindAsset1.asset"
      class="mt-4"
    />

    <add-form-informations
      :pair="pair"
      :asset1="asset1"
      :asset2="asset2"
      class="mt-6"
    />

    <div class="mt-6 text-center">
      <template v-if="meta.isNotSupport">
        <div class="label-3">
          {{ $t("liquidity.create.pair.not-support") }}
        </div>

        <route-to-create-action />
      </template>

      <add-action v-else :disabled="meta.disabled" />
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import AddFormInput from "./AddFormInput.vue";
import AddFormInformations from "./AddFormInformations.vue";
import AddAction from "./AddAction.vue";
import RouteToCreateAction from "./RouteToCreateAction.vue";

@Component({
  components: {
    RouteToCreateAction,
    AddAction,
    AddFormInput,
    AddFormInformations,
  },
})
class LiquidityAddForm extends Vue {
  @PropSync("asset1") bindAsset1;

  @PropSync("asset2") bindAsset2;

  @Prop() pair;

  valid = false;

  get meta() {
    const selected = this.bindAsset1.asset && this.bindAsset2.asset;
    const isNotSupport = selected && !this.pair;
    const disabled = !selected || !this.valid;

    return {
      selected,
      disabled,
      isNotSupport,
    };
  }
}
export default LiquidityAddForm;
</script>
