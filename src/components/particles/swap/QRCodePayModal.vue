<template>
  <v-dialog v-model="dialog" max-width="280">
    <v-card class="text-center">
      <v-card-title class="justify-center">
        {{ $t("swap.scan-to-pay") }}
      </v-card-title>
      <v-card-text>
        <f-qr-code :text="text" :size="200" class="my-5" />
        <p class="caption ma-0">
          {{ $t("swap.use-mixin") }}
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <v-btn rounded depressed color="primary" @click="handlePaid">
          {{ $t("swap.paid") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class QRCodePayModal extends Vue {
  dialog = false;

  text = "";

  traceId = "";

  show(text, traceId) {
    this.text = text;
    this.traceId = traceId;
    this.dialog = true;
  }

  handlePaid() {
    this.dialog = false;
    this.$emit("paid", this.traceId);
    this.text = "";
    this.traceId = "";
  }
}
export default QRCodePayModal;
</script>
