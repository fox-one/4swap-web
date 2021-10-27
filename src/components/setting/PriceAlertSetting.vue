<template>
  <div>
    <f-list-item
      :title="$t('price_alert.count_down.title')"
      :subtitle="$t('price.alert.hint')"
      class="pa-0"
    >
      <template #tail>
        <f-switch v-model="protectionValue" hide-details />
      </template>
    </f-list-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalMutations } from "@/store/types";

@Component
class PriceAlertSetting extends Vue {
  get settings() {
    return this.$store.state.app.settings;
  }

  get protectionValue() {
    return this.settings.priceAlertCountDown;
  }

  set protectionValue(val) {
    this.$store.commit(GlobalMutations.SET_SETTINGS, {
      priceAlertCountDown: Boolean(val),
    });
  }
}
export default PriceAlertSetting;
</script>
