<template>
  <v-dialog v-model="dialog" max-width="450">
    <f-panel class="pa-8">
      <div class="label-1 d-flex align-center">
        <v-icon class="mr-1"> $IconCheck </v-icon>

        {{ $t("liquidity.create.toast.success.title") }}
      </div>

      <div class="mt-6">
        <p>{{ $t("liquidity.create.toast.success.p1") }}</p>
        <p>{{ $t("liquidity.create.toast.success.p2") }}</p>
      </div>

      <div class="text-center mt-6">
        <div>
          <f-button color="primary" @click="handleDone">
            {{ $t("done") }}
          </f-button>
        </div>

        <div class="mt-4">
          <f-button color="primary" text @click="handleContribute">
            {{ $t("liquidity.create.toast.btn.contribute") }}
          </f-button>
        </div>
      </div>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class CreatePoolSuccessModal extends Vue {
  dialog = true;

  show() {
    this.dialog = true;
  }

  handleDone() {
    this.$emit("done");
    this.dialog = false;
  }

  handleContribute() {
    this.dialog = false;
    const url_zh = "https://jinshuju.net/f/Fp4vFj";
    const url_en = "https://jinshuju.net/f/SlyulF";
    const lang = this.$vuetify.lang.current;

    window.location.href = lang === "zh" ? url_zh : url_en;
  }
}
export default CreatePoolSuccessModal;
</script>
