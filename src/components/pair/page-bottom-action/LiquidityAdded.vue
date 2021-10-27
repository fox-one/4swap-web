<template>
  <div :class="classes">
    <span class="action action__remove" @click="handleRemove">
      <v-icon>$FIconMinusBold</v-icon>
    </span>

    <v-fade-transition>
      <div v-if="tabIndex === 1" class="account">
        <div class="amount">{{ meta.totalValueText }}</div>
        <div class="label-3 mt-1">{{ $t("my.liquidity") }}</div>
      </div>
    </v-fade-transition>

    <span class="action action__add" @click="handleAdd">
      <v-icon color="greyscale_7">$FIconAddBold</v-icon>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import { AccountPair } from "@/utils/pair/helper";
import { Sync } from "vuex-pathify";

@Component
class LiquidityPageAction extends Vue {
  @Sync("page/pairDetail@tabIndex") tabIndex!: number;

  @Prop() pair;

  animated = false;

  get classes() {
    return {
      "liquidity-actions": true,
      "liquidity-actions--dense": this.tabIndex === 0,
      "liquidity-actions--animated": this.animated,
    };
  }

  get meta() {
    const toFiat = this.$utils.currency.toFiat;
    const getAccountPair = this.$store.getters[GlobalGetters.GET_ACCOUNT_PAIR];
    const { shared } = getAccountPair(this.pair) as AccountPair;

    const totalValue = shared?.totalValue ?? 0;
    const totalValueText = toFiat(this, { n: totalValue });

    return { totalValueText };
  }

  handleRemove() {
    this.$emit("remove");
  }

  handleAdd() {
    this.$emit("add");
  }
}
export default LiquidityPageAction;
</script>

<style lang="scss" scoped>
.liquidity-actions {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  height: 64px;
  border-radius: 64px;
  background-color: var(--v-greyscale_1-base);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: width 0.2s ease;

  &--dense {
    width: 144px;
    justify-content: space-between;

    .account {
      display: none;
    }
  }

  .account {
    flex: 1;
    text-align: center;

    .amount {
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      font-feature-settings: "salt" on;
      color: var(--v-greyscale_7-base);
    }
  }

  .action {
    min-width: 56px;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &__remove {
      background-color: var(--v-greyscale_7-base);
    }

    &__add {
      background-color: var(--v-secondary-base);
    }
  }
}
</style>
