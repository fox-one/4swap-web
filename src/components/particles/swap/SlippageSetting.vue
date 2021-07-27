<template>
  <f-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <v-btn v-on="on" icon>
        <v-icon color="primary">
          {{ $icons.mdiCog }}
        </v-icon>
      </v-btn>
    </template>
    <template #title> {{ $t("slippage.setting.title") }} </template>
    <div class="pa-3 px-5">
      <div class="pa-2">
        {{ $t("slippage.label") }}
      </div>
      <f-button-tabs
        :value="bindSlippageSeletor"
        mandatory
        borderless
        class="slippage-toggle"
        @change="handleSlippageChange"
      >
        <template #tabs>
          <f-button
            v-for="(option, index) in btns"
            small
            color="f-greyscale-1"
            :key="index"
            :value="option.value"
          >
            {{ option.text }}
          </f-button>
        </template>
      </f-button-tabs>
      <f-input
        ref="customInput"
        suffix="%"
        class="my-5"
        type="number"
        :label="$t('slippage.custom.label')"
        :value="bindSlippage"
        @input="handleSlippageInput"
      />
      <v-layout justify-center>
        <f-button
          rounded
          depressed
          color="primary"
          :disabled="!valid"
          @click="handleSetSlippage"
        >
          {{ $t("save") }}
        </f-button>
      </v-layout>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
class SlippageSetting extends Vue {
  dialog = false;

  slippage: any = 0.99;

  get btns() {
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

  get bindSlippage() {
    if (this.slippage === "") return "";
    const value = new BigNumber(1).minus(this.slippage).times(100).toNumber();
    if (isNaN(value)) {
      return "";
    }
    return value;
  }

  get bindSlippageSeletor() {
    return [0.999, 0.995, 0.99].includes(this.slippage) ? this.slippage : -1;
  }

  @Watch("dialog")
  handleDialogChange(value) {
    if (value) {
      this.slippage = this.$store.state.app.settings.slippage;
    }
  }

  handleSlippageInput(value) {
    const n = new BigNumber(value).div(100);
    this.slippage = new BigNumber(1).minus(n).toNumber();
  }

  handleSlippageChange(value) {
    if (value !== -1) {
      this.slippage = value;
    } else {
      this.slippage = "";
      const input = (this.$refs.customInput as any).$children[0];
      input.focus();
    }
  }

  handleSetSlippage() {
    this.$store.commit("app/SET_SETTINGS", { slippage: this.slippage });
    this.dialog = false;
  }
}
export default SlippageSetting;
</script>

<style lang="scss" scoped>
.slippage-toggle {
  width: 100%;
}
</style>
