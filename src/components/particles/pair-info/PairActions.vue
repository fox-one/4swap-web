<template>
  <f-action-bar fixed :actions="btns" @click="handleClickAction"></f-action-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { FButton } from "@foxone/uikit/src/components/";

const events = {
  swap: Symbol("swap"),
  remove: Symbol("remove"),
  add: Symbol("add"),
};

@Component
class PairActions extends Vue {
  @Prop() baseAsset!: API.Asset;

  @Prop() quoteAsset!: API.Asset;

  get btns() {
    const colorUp = this.$utils.color.colorUp(this);
    return [
      {
        text: this.$t("liquidity"),
        event: events.remove,
        icon: "$vuetify.icons.iconRemove",
        size: "16",
        color: "#F44C4C",
      },
      {
        text: this.$createElement(
          FButton,
          {
            staticClass: "action-bar-custom_swap",
            props: {
              color: "primary",
              rounded: true,
              depressed: true,
            },
          },
          this.$t("swap") as string
        ) as any,
        event: events.swap,
      },
      {
        text: this.$t("liquidity"),
        event: events.add,
        icon: "$vuetify.icons.iconPlus",
        size: "16",
        color: colorUp,
      },
    ];
  }

  handleClickAction(action) {
    switch (action.event) {
      case events.swap:
        this.handleSwap();
        break;
      case events.remove:
        this.handleRemove();
        break;
      case events.add:
        this.handleAdd();
        break;
    }
  }

  handleSwap() {
    this.$router.push({
      name: "swap",
      query: { input: this.baseAsset.id, output: this.quoteAsset.id },
    });
  }

  handleRemove() {
    this.$router.push({
      name: "liquidity-remove",
      query: { base: this.baseAsset.id, quote: this.quoteAsset.id },
    });
  }

  handleAdd() {
    this.$router.push({
      name: "liquidity-add",
      query: { base: this.baseAsset.id, quote: this.quoteAsset.id },
    });
  }
}
export default PairActions;
</script>
<style lang="scss" scoped>
::v-deep {
  .action-bar-custom_swap {
    margin-top: -12px;
  }
}
</style>
