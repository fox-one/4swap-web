<template>
  <div>
    <div class="my-3">
      <currency-setting />
    </div>
    <div class="my-3">
      <scheme-setting class="my-3" />
    </div>

    <price-alert-setting class="my-3" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import CurrencySetting from "@/components/setting/CurrencySetting.vue";
import SchemeSetting from "@/components/setting/SchemeSetting.vue";
import PriceAlertSetting from "@/components/setting/PriceAlertSetting.vue";

@Component({
  components: {
    CurrencySetting,
    SchemeSetting,
    PriceAlertSetting,
  },
})
class SettingPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("settings.title") as string;
  }
}
export default SettingPage;
</script>
