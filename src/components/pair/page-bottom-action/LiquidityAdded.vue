<template>
  <div :class="classes">
    <span class="action action__remove" @click="handleRemove">
      <v-icon color="black">$FIconMinusBold</v-icon>
    </span>

    <div class="account">
      <div class="amount">{{ meta.totalValueText }}</div>
      <div class="label-3 mt-1">{{ $t("liquidity.my") }}</div>
    </div>

    <span class="action action__add" @click="handleAdd">
      <v-icon color="white">$FIconAddBold</v-icon>
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

  get classes() {
    return {
      "liquidity-actions": true,
      "liquidity-actions--dense": this.tabIndex === 0,
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
  justify-content: space-between;
  transition: width 0.5s ease;

  &--dense {
    width: 144px;
    justify-content: space-between;

    .account {
      max-width: 0 !important;
    }
  }

  .account {
    max-width: 400px;
    flex: 1;
    text-align: center;

    .amount {
      font-weight: 600;
      font-size: 16px;
      overflow: hidden;
      text-align: center;
      font-feature-settings: "salt" on;
      color: var(--v-greyscale_7-base);
    }
  }

  .action {
    position: absolute;
    min-width: 56px;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 11;

    &__remove {
      background-color: var(--v-greyscale_7-base);
    }

    &__add {
      right: 4px;
      top: 4px;
      background-color: var(--v-secondary-base);
    }
  }
}

.theme--dark {
  .liquidity-actions .action.action__remove {
    background-color: var(--v-greyscale_2-base);
  }
}
</style>
