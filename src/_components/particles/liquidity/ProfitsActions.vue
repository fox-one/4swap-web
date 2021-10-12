<template>
  <f-action-bar fixed :actions="btns" @click="handleClickAction"></f-action-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

const events = {
  history: Symbol("history"),
  remove: Symbol("remove"),
  add: Symbol("add"),
};

@Component
class ProfitsActions extends Vue {
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
        text: this.$t("liquidity"),
        event: events.add,
        icon: "$vuetify.icons.iconPlus",
        size: "16",
        color: colorUp,
      },
      {
        text: this.$t("history"),
        event: events.history,
        icon: this.$icons.mdiHistory,
        size: "22",
        color: "grey darken-2",
      },
    ];
  }

  handleClickAction(action) {
    switch (action.event) {
      case events.history:
        this.handleHistory();
        break;
      case events.remove:
        this.handleRemove();
        break;
      case events.add:
        this.handleAdd();
        break;
    }
  }

  handleHistory() {
    this.$router.push({
      name: "liquidity-history",
      query: {
        base: this.baseAsset.id,
        quote: this.quoteAsset.id,
        duration: "720h",
      },
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
export default ProfitsActions;
</script>
