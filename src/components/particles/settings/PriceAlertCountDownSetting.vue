<template>
  <f-list-item :title="$t('price_alert.count_down.title')">
    <template #tail>
      <f-switch v-model="protectionValue" />
    </template>
  </f-list-item>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class PriceAlertCountDownSetting extends Vue {
  get settings() {
    return this.$store.state.app.settings;
  }

  get protectionValue() {
    return this.settings.priceAlertCountDown;
  }

  set protectionValue(val) {
    this.$store.commit("app/SET_SETTINGS", {
      priceAlertCountDown: Boolean(val),
    });
  }
}
export default PriceAlertCountDownSetting;
</script>
