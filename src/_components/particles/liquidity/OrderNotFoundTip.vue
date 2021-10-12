<template>
  <div class="text-center">
    <h4 class="my-5">{{ $t("liquidity.add.order.not-found") }}</h4>
    <f-button outlined rounded color="primary" @click="handleAddLiq">
      {{ $t("liquidity.to-add") }}
    </f-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class OrderNotFoundTip extends Vue {
  handleAddLiq() {
    this.$router.push({ name: "liquidity-add" });
  }
}
export default OrderNotFoundTip;
</script>
