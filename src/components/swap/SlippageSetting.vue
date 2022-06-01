<template>
  <f-bottom-sheet
    v-model="dialog"
    :title="$t('slippage.setting.title')"
    wapper-in-desktop="dialog"
  >
    <template #activator="{ on }">
      <v-btn icon small v-on="on">
        <v-icon>$FIconSetting</v-icon>
      </v-btn>
    </template>

    <div class="pa-3 px-5">
      <f-segment-control
        :value="bindSlippageSeletor"
        borderless
        mandatory
        color="greyscale_7"
        active-class="primary"
        @change="handleTabChange"
      >
        <f-button
          v-for="(item, index) in items"
          :key="index"
          :ripple="false"
          :value="item.value"
          class="btn"
        >
          <span>{{ item.text }}</span>
        </f-button>
      </f-segment-control>

      <f-input
        ref="input"
        suffix="%"
        class="my-5"
        type="number"
        inputmode="decimal"
        :placeholder="$t('slippage.custom.label')"
        :value="bindSlippage"
        @input="handleSlippageInput"
      />

      <div class="text-center">
        <f-button color="primary" :disabled="!valid" @click="handleSetSlippage">
          {{ $t("save") }}
        </f-button>
      </div>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Component, Vue, Watch, Model } from "vue-property-decorator";

@Component
class SlippageSetting extends Vue {
  @Model("change") value;

  dialog = false;

  slippage: any = 0.999;

  get items() {
    return [
      {
        text: "0.1%",
        value: 0.999,
      },
      {
        text: "0.5%",
        value: 0.995,
      },
      {
        text: "1%",
        value: 0.99,
      },
      {
        text: this.$t("custom"),
        value: -1,
      },
    ];
  }

  get valid() {
    return Number(this.slippage) > 0 && Number(this.slippage) < 1;
  }

  get bindSlippageSeletor() {
    return [0.999, 0.995, 0.99].includes(this.slippage) ? this.slippage : -1;
  }

  get bindSlippage() {
    const value = new BigNumber(1).minus(this.slippage).times(100).toNumber();

    return isNaN(value) ? "" : value;
  }

  mounted() {
    this.slippage = this.value;
  }

  @Watch("dialog")
  handleDialogChange(value) {
    if (value) {
      this.slippage = this.value;
    }
  }

  handleTabChange(value) {
    if (value !== -1) {
      this.slippage = value;
    } else {
      this.slippage = "";

      const input: any = this.$refs.input;
      input.focus();
    }
  }

  handleSlippageInput(value) {
    const n = new BigNumber(value).div(100);

    this.slippage = new BigNumber(1).minus(n).toNumber();
  }

  handleSetSlippage() {
    this.$emit("change", this.slippage);

    console.log("handleSetSlippage", this.slippage);

    this.dialog = false;
  }
}
export default SlippageSetting;
</script>

<style lang="scss" scoped>
.slippage-toggle {
  width: 100%;
}

.f-segment-control {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.btn {
  padding: 0 !important;
}
</style>
