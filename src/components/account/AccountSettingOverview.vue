<template>
  <div class="overview">
    <div class="header">
      <div class="label-3 mb-4">{{ $t("wallet.assets") }}</div>
      <div class="balance">
        <base-fiat-division :parts="meta.parts" />
      </div>
    </div>

    <div class="mb-8">
      <f-list-item
        :title="$t('settings.title')"
        hide-tail
        @change="handleToSettings"
      >
        <template #head>
          <v-icon>$FIconSettingFill</v-icon>
        </template>
      </f-list-item>

      <f-list-item
        :title="$t('me.learn.more')"
        hide-tail
        @click="handleLearnMore"
      >
        <template #head>
          <v-icon>$FIconDocumentFill</v-icon>
        </template>
      </f-list-item>
    </div>

    <div class="text-center mb-8">
      <base-disconnect />

      <div class="label-3 mt-8">{{ $t("channel.name.mtg") }} {{ version }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { VERSION } from "@/constants";

@Component
class AccountSettingOverview extends Vue {
  version = VERSION;

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getters = this.$store.getters;
    const balance = getters[GlobalGetters.GET_WALLET_BALANCE];

    return {
      parts: toFiat(this, { n: balance }, true),
    };
  }

  handleToSettings() {
    this.$router.push({ name: "setting" });
  }

  handleLearnMore() {
    location.assign("https://docs.pando.im/docs/lake/intro");
  }
}
export default AccountSettingOverview;
</script>

<style lang="scss" scoped>
.overview {
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  overflow: hidden;
}

.header {
  padding: 54px 16px;
  background: url("../../assets/images/bg_coins.png") 100% 100% no-repeat,
    #f6f8fc;
}
</style>
