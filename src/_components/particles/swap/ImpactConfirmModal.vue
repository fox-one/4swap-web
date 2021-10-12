<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title
        class="f-error font-weight-bold d-flex flex-column justify-center align-center"
      >
        <div class="mb-2">
          <v-icon size="64" color="error">{{ $icons.mdiAlert }}</v-icon>
        </div>
        <h3>{{ $t("swap.notice") }}</h3>
      </v-card-title>
      <v-card-text class="text-center pb-2">
        <div class="prediction mb-1 f-bg-greyscale-6 py-2 border-radius">
          <div>
            <span class="f-greyscale-1"
              >{{ predication.inputAmount }} {{ predication.inputSymbol }}</span
            ><br />
            <span class="f-caption">≈{{ predication.inputFiat }}</span>
          </div>
          <div class="f-caption">
            <v-icon size="20">{{ $icons.mdiArrowDown }}</v-icon>
          </div>
          <div>
            <span class="f-greyscale-1"
              >{{ predication.outputAmount }}
              {{ predication.outputSymbol }}</span
            ><br />
            <span class="f-caption">≈{{ predication.outputFiat }}</span>
          </div>
        </div>
        {{ $t("swap.notice.content.p1") }}
        <span class="f-error"> {{ impact }} </span>
        {{ $t("swap.notice.content.p2") }} <br />
        <span class="f-error font-weight-bold">
          {{ $t("swap.notice.content.p3") }}</span
        >
      </v-card-text>
      <v-card-actions class="d-flex justify-center align-center pb-6">
        <div class="d-flex flex-column justify-center align-center">
          <f-button type="primary" block @click="dialog = false">
            {{ $t("swap.notice.cancel") }}
          </f-button>
          <f-button
            type="subtitle"
            class="mt-2"
            block
            :disabled="!validated"
            @click="handleConfirm"
          >
            {{ $t("swap.notice.confirm") }}
            {{ counter ? `(${counter})` : "" }}
          </f-button>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import BigNumber from "bignumber.js";

@Component
class SwapConfirmModal extends Vue {
  @Prop() impact!: string;
  @Prop() impactValue!: number;
  @Prop() preOrder: API.SwapOrder | null = null;
  @Prop() inputAsset!: API.Asset | null;
  @Prop() outputAsset!: API.Asset | null;

  dialog = false;

  counter = 0;

  timer: any = null;

  get validated() {
    return this.counter === 0;
  }

  get settings() {
    return this.$store.state.app.settings;
  }

  get predication() {
    const amount = Number(this.preOrder?.amount ?? 0);
    const slippage = Number(this.$store.state.app.settings.slippage) || 0.99;
    const minReceived = new BigNumber(amount).times(slippage);
    const inputFiat = this.formatFiat(
      new BigNumber(this.inputAsset?.price ?? 0).times(
        this.preOrder?.funds ?? 0
      )
    );
    const outputFiat = this.formatFiat(
      new BigNumber(this.outputAsset?.price ?? 0).times(
        minReceived.toString() ?? 0
      )
    );
    return {
      inputSymbol: this.inputAsset?.symbol,
      inputAmount: this.preOrder?.funds,
      inputFiat,
      outputSymbol: this.outputAsset?.symbol,
      outputAmount: minReceived.toFixed(8),
      outputFiat,
    };
  }

  show() {
    this.dialog = true;
    if (this.settings.priceAlertCountDown) {
      this.counter = Math.round(this.impactValue * 100);
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

  handleConfirm() {
    this.dialog = false;
    this.$emit("confirm");
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default SwapConfirmModal;
</script>
<style lang="scss" scoped>
.prediction {
  line-height: 1.2;
}
</style>
