<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="275">
      <v-card rounded="xl">
        <v-card-title class="pt-10 f-title-1 text-center">
          <v-layout column align-center>
            <v-icon size="40" class="icon-check mb-4" color="white">
              {{ $icons.mdiCheck }}
            </v-icon>
            <span>{{ $t("liquidity.create.toast.success.title") }}</span>
          </v-layout>
        </v-card-title>
        <v-card-text class="pa-0 f-caption paragraph text--primary">
          {{ $t("liquidity.create.toast.success.p1") }}
        </v-card-text>
        <v-card-text class="my-4 pa-0 f-caption paragraph text--primary">
          {{ $t("liquidity.create.toast.success.p2") }}
        </v-card-text>
        <v-card-actions>
          <v-layout column>
            <f-button color="primary" class="f-title-2" @click="handleDone">
              {{ $t("done") }}
            </f-button>
            <f-button
              color="primary"
              class="mt-4 f-body-1"
              outlined
              @click="goContribute"
            >
              {{ $t("liquidity.create.toast.btn.contribute") }}
            </f-button>
          </v-layout>
        </v-card-actions>
        <v-card-subtitle class="pb-10 f-caption f-greyscale-3 text-center">
          {{ $t("liquidity.create.toast.contribute") }}
        </v-card-subtitle>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Vue } from "vue-property-decorator";

@Component
class LiqCreateSuccessModal extends Vue {
  dialog = false;

  show() {
    this.dialog = true;
  }

  handleDone() {
    this.$emit("done");
    this.dialog = false;
  }

  goContribute() {
    this.dialog = false;
    const url_zh = "https://jinshuju.net/f/Fp4vFj";
    const url_en = "https://jinshuju.net/f/SlyulF";
    const lang = this.$vuetify.lang.current;

    window.location.href = lang === "zh" ? url_zh : url_en;
  }
}
export default LiqCreateSuccessModal;
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
