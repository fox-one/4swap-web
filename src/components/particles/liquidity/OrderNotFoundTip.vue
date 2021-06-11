<template>
  <div class="text-center">
    <h4 class="my-5">{{ $t("liquidity.add.order.not-found") }}</h4>
    <v-btn outlined rounded color="primary" @click="handleAddLiq">
      {{ $t("liquidity.to-add") }}
    </v-btn>
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
