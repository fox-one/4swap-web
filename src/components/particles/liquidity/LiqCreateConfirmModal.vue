<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="275">
      <v-card rounded="xl">
        <v-card-title class="pt-10 f-title-1 text-center">
          <v-layout column align-center>
            <span>{{ $t("liquidity.create.toast.confirm.title") }}</span>
          </v-layout>
        </v-card-title>
        <v-card-text class="pa-0 f-body-1 paragraph text--primary">
          {{ `${$t("liquidity.create.toast.confirm.pair")}:` }}
          <v-layout align-center justify-center class="my-4">
            <div class="d-flex align-center">
              <f-mixin-asset-logo :size="18" :logo="baseAsset.logo" />
              <span class="ml-1 pair-icon-symbol">{{ baseAsset.symbol }}</span>
            </div>
            <v-icon size="12" class="mx-2">
              {{ $icons.mdiPlus }}
            </v-icon>
            <div class="d-flex align-center">
              <f-mixin-asset-logo :size="18" :logo="quoteAsset.logo" />
              <span class="ml-1 pair-icon-symbol">{{ quoteAsset.symbol }}</span>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-text class="py-4 pa-0 f-body-1 paragraph text--primary">
          {{ `${$t("liquidity.create.toast.confirm.cost")}:` }}
          <span class="ml-2 f-title-2">{{ costText }}</span>
        </v-card-text>
        <v-card-actions>
          <v-layout column>
            <f-button color="primary" class="f-title-2" @click="handleConfirm">
              {{ $t("confirm") }}
            </f-button>
            <f-button
              color="secondary"
              class="mt-4 f-body-1"
              text
              @click="dialog = false"
            >
              {{ $t("cancel") }}
            </f-button>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Vue } from "vue-property-decorator";

@Component
class LiqCreateConfirmModal extends Vue {
  dialog = false;
  baseAsset = {};
  quoteAsset = {};
  costText = "";

  show(baseAsset: API.Asset, quoteAsset: API.Asset, cost: string) {
    this.dialog = true;
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.costText = cost;
  }

  handleConfirm() {
    this.dialog = false;
    this.$emit("confirm");
  }
}
export default LiqCreateConfirmModal;
</script>

<style lang="scss" scoped>
.icon-check {
  border-radius: 50%;
  background-color: var(--v-primary-base);
}

.paragraph {
  max-width: 194px;
  margin: 0 auto;
}
</style>
