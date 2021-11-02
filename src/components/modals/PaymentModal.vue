<template>
  <v-dialog v-model="dialog" max-width="280">
    <v-card class="text-center">
      <v-card-title class="justify-center">
        {{ $t("swap.scan-to-pay") }}
      </v-card-title>
      <v-card-text>
        <f-qr-code v-if="text" :text="text" :size="200" class="my-5" />
        <p class="caption ma-0">
          {{ $t("swap.use-mixin") }}
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <f-button rounded depressed color="primary" @click="handlePaid">
          {{ $t("swap.paid") }}
        </f-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { GLOBAL_EVENTS } from "@/constants";

@Component
class PaymentModal extends Vue {
  dialog = false;

  text = "";

  cbs: any = {};

  mounted() {
    this.$root.$on(GLOBAL_EVENTS.OPEN_PAYMENT_MODAL, (text, cbs) => {
      this.show(text, cbs);
    });
  }

  show(text: string, cbs: any) {
    this.text = text;
    this.cbs = cbs;
    this.dialog = true;
  }

  @Watch("dialog")
  handleDialogChange(value: boolean) {
    if (!value) {
      this.text = "";
      this.cbs = {};
    }
  }

  handlePaid() {
    this.dialog = false;

    if (typeof this.cbs?.onPaid === "function") {
      this.cbs.onPaid();
    }
  }
}
export default PaymentModal;
</script>
