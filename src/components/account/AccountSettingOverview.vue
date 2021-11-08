<template>
  <div class="overview">
    <v-sheet light>
      <div class="header">
        <div class="label mb-4">{{ $t("wallet.assets") }}</div>
        <div class="balance">
          <base-fiat-division :parts="meta.parts" />
        </div>

        <v-btn icon small class="f-bottom-sheet__close" @click="$emit('close')">
          <v-icon>$close</v-icon>
        </v-btn>
      </div>
    </v-sheet>

    <v-sheet></v-sheet>

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
      <base-disconnect @disconnected="$emit('disconnected')" />

      <div class="version label-3 mt-8">
        {{ $t("channel.name") }} v{{ version }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { VERSION, PANDO_DOC } from "@/constants";

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
    location.assign(PANDO_DOC);
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

  .label {
    color: var(--v-greyscale_3-base);
    font-weight: 500;
    font-size: 14px;
  }
}

.version {
  color: var(--v-greyscale_4-base);
}
</style>
