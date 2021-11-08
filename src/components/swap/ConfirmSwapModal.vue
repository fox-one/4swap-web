<template>
  <v-dialog v-model="dialog" max-width="450">
    <f-panel
      v-if="order && inputAsset && outputAsset"
      class="swap-confirm-modal pa-8 pb-2"
    >
      <div class="dialog-title">
        <v-icon v-if="meta.showImpactWarning" :color="meta.color" class="mr-1">
          $FIconWarningFill
        </v-icon>
        {{ meta.title }}
      </div>

      <div
        v-if="meta.showImpactWarning"
        v-html="$t('warn.price.impact', { value: meta.impactText })"
        class="impact-text"
        :class="[meta.classes]"
      />

      <div class="mt-6">
        <base-modal-asset-item
          is-input
          :asset="inputAsset"
          :amount="inputAmount"
        />
        <base-modal-asset-item :asset="outputAsset" :amount="outputAmount" />
      </div>

      <div class="text-center mt-5">
        <div>
          <f-button :disabled="!valid" color="primary" @click="handleContinue">
            {{ $t("continue") }}
            {{ counter ? `(${counter})` : "" }}
          </f-button>
        </div>

        <div class="mt-2">
          <f-button text @click="handleCancel">
            {{ $t("cancel") }}
          </f-button>
        </div>
      </div>
    </f-panel>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class ConfirmSwapModal extends Vue {
  @Prop() order;

  @Prop() inputAsset!: API.Asset;

  @Prop() outputAsset!: API.Asset;

  @Prop() inputAmount!: string;

  @Prop() outputAmount!: string;

  dialog = false;

  counter = 0;

  timer: any = null;

  get valid() {
    return this.counter === 0;
  }

  get meta() {
    const getPreOrderMeta = this.$utils.pair.getPreOrderMeta;
    const toPercent = this.$utils.number.toPercent;

    const { price_impact = 0 } = getPreOrderMeta(this, {
      input: this.inputAsset,
      output: this.outputAsset,
      order: this.order,
    });
    const meta = {
      low: { title: this.$t("confirmation"), classes: "" },
      mid: {
        title: this.$t("warning"),
        classes: "impact-text--warning",
        color: "warning",
      },
      high: {
        title: this.$t("warning"),
        classes: "impact-text--error",
        color: "error",
      },
    };

    const impact = +price_impact;
    const impactText = toPercent({ n: impact });

    const level = impact <= 0.01 ? "low" : impact <= 0.1 ? "mid" : "high";
    const showImpactWarning = level !== "low";

    return { impact, impactText, level, showImpactWarning, ...meta[level] };
  }

  show() {
    this.dialog = true;

    if (this.$store.state.app.settings.priceAlertCountDown) {
      this.counter = Math.round(this.meta.impact * 100);
      this.startCountDown();
    }
  }

  startCountDown() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.decreaseCounter();
  }

  decreaseCounter() {
    if (this.counter === 0) {
      return;
    }

    this.timer = setTimeout(() => {
      this.counter -= 1;
      this.decreaseCounter();
    }, 1000);
  }

  handleContinue() {
    this.dialog = false;
    this.$emit("confirm");
  }

  handleCancel() {
    this.dialog = false;
  }
}
export default ConfirmSwapModal;
</script>

<style lang="scss" scoped>
.dialog-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.impact-text {
  margin-top: 24px;
  padding: 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  border-radius: 8px;

  &--warning {
    color: var(--v-warning-base);
    background-color: var(--v-warning_bg-base);

    ::v-deep {
      p {
        color: var(--v-warning_emphsize-base);
      }
    }
  }

  &--error {
    color: var(--v-error-base);
    background-color: var(--v-error_bg-base);

    ::v-deep {
      p {
        color: var(--v-error_emphsize-base);
      }
    }
  }

  ::v-deep {
    p {
      margin: 12px 0;
      font-weight: 700;
    }
  }
}
</style>
