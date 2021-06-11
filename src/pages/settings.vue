<template>
  <v-container class="settings-page">
    <f-loading :loading="loading" :fullscreen="true" />
    <template v-if="!loading">
      <f-panel elevation="low" class="mt-0 px-0">
        <div class="f-caption f-greyscale-3 px-4">
          {{ $t("settings.title") }}
        </div>
        <currency-setting />
        <chart-scheme-setting />
        <price-alert-count-down-setting />
        <template v-if="debug">
          <div class="f-caption f-greyscale-3 px-4">DEBUG</div>
          <div class="px-4 py-2">
            <f-button v-clipboard:copy="token" type="subtitle" block>
              {{ "Copy the token" }}
            </f-button>
          </div>
        </template>
      </f-panel>
      <div
        class="text--secondary text-center caption mt-4"
        @click="handleVersionClick"
      >
        Version {{ VERSION }}
      </div>
      <f-button block type="subtitle" class="mt-10" @click="handleLogout">
        {{ $t("logout") }}
      </f-button>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { State } from "vuex-class";
import { VERSION } from "../constants";
import PageView from "@/mixins/page";
import CurrencySetting from "@/components/particles/settings/CurrencySetting.vue";
import ChartSchemeSetting from "@/components/particles/settings/ChartSchemeSetting.vue";
import PriceAlertCountDownSetting from "@/components/particles/settings/PriceAlertCountDownSetting.vue";

@Component({
  components: {
    CurrencySetting,
    ChartSchemeSetting,
    PriceAlertCountDownSetting,
  },
})
class SettingsPage extends Mixins(PageView) {
  @State((state) => state.user.me.profile) profile;

  @State((state) => state.group.settings) settings;

  debug = false;

  loading = false;

  user: any = null;

  showEditDialog = false;

  token = "";

  count = 0;

  VERSION = VERSION;

  async mounted() {
    this.debug = this.$route.query.debug === "1" || false;
    this.token = await this.$utils.helper.getToken(this.$store);
  }

  get title() {
    return this.$t("settings.title") as string;
  }

  handleLogout() {
    this.$store.dispatch("auth/logout");
    window.location.href = "/#me";
    window.location.reload();
  }

  handleVersionClick() {
    this.count += 1;
    if (this.count > 10) {
      this.debug = true;
    }
  }
}
export default SettingsPage;
</script>

<style lang="scss" scoped></style>
