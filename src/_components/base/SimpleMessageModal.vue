<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>
        {{ text.title }}
      </v-card-title>
      <v-card-text v-html="text.description"></v-card-text>
      <v-card-actions>
        <v-spacer />
        <f-button v-if="text.cancel" text @click="handleCancel">
          {{ text.cancel }}
        </f-button>
        <f-button v-if="text.ok" text :color="text.okColor" @click="handleOK">
          {{ text.ok }}
        </f-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
class SimpleMessageModal extends Vue {
  dialog = false;

  handler: any = null;

  text: any = {
    title: "",
    description: "",
    okColor: "",
    ok: "",
    cancel: "",
  };

  get defaultText() {
    return {
      title: "",
      description: "",
      okColor: "primary",
      ok: this.$t("ok"),
      cancel: this.$t("cancel"),
    };
  }

  @Watch("dialog")
  handleDialogChange(value) {
    if (!value) {
      this.reset();
    }
  }

  @Watch("$route")
  handleRouteChange() {
    this.dialog = false;
  }

  mounted() {
    this.$root.$on("SHOW_SIMPLE_MESSAGE_MODAL", (text, handler) => {
      this.text = { ...this.defaultText, ...text };
      this.handler = handler;
      this.dialog = true;
    });
  }

  reset() {
    this.handler = null;
    this.text = this.defaultText;
  }

  handleCancel() {
    if (
      this.handler &&
      this.handler.onCancel &&
      typeof this.handler.onCancel === "function"
    ) {
      this.handler.onCancel();
    }
    this.dialog = false;
  }

  handleOK() {
    if (
      this.handler &&
      this.handler.onOK &&
      typeof this.handler.onOK === "function"
    ) {
      this.dialog = false;
      this.handler.onOK();
    }
    this.dialog = false;
  }
}
export default SimpleMessageModal;
</script>
