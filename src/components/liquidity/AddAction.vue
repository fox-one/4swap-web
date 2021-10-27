<template>
  <div class="mt-6 text-center">
    <template v-if="meta.isNotSupport">
      <div class="label-3 mb-6 text-left">
        {{ $t("liquidity.create.pair.not-support") }}
      </div>

      <route-to-create-action :pair="pair" />
    </template>

    <f-button v-else :disabled="meta.disabled" color="primary">
      {{ $t("next") }}
    </f-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RouteToCreateAction from "./RouteToCreateAction.vue";

@Component({
  components: {
    RouteToCreateAction,
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
}
export default AddAction;
</script>
