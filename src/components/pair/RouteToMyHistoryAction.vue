<template>
  <div class="action" @click="handleClick">
    <span class="mr-1">{{ $t("my.history") }}</span>
    <v-icon size="16">$FIconChevronRight4P</v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class RouteToMyHistoryAction extends Vue {
  @Prop() pair;

  handleClick() {
    this.$router.push({
      name: "history",
      query: { base: this.pair.base_asset_id, quote: this.pair.quote_asset_id },
    });
  }
}
export default RouteToMyHistoryAction;
</script>

<style lang="scss" scoped>
.action {
  border-radius: 8px;
  background-color: var(--v-greyscale_6-base);
  font-size: 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
