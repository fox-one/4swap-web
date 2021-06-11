<template>
  <f-asset-amount-input v-bind="$attrs" v-on="$listeners">
    <template #assets="{ assets, asset, on }">
      <asset-list
        :assets="assets"
        :asset="asset"
        @select="(item) => on.select(item)"
      />
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import {
  VVirtualScroll,
  VListItem,
  VListItemContent,
  VListItemTitle,
  VListItemSubtitle,
  VListItemAction,
} from "vuetify/lib";

@Component({
  inheritAttrs: false,
})
class AssetList extends Vue {
  @Prop({ type: Array, default: () => [] }) assets;

  @Prop() asset;

  filter: string | null = "";

  get filterAssets() {
    const filter = this.filter?.toLowerCase() ?? "";
    return this.assets.filter((asset) => {
      const name = (asset.name || "").toLowerCase();
      const symbol = (asset.symbol || "").toLowerCase();
      return name.startsWith(filter) || symbol.includes(filter);
    });
  }

  handleSelect(asset) {
    if (this.asset && this.asset.id === asset.id) {
      this.$emit("select", null);
    } else {
      this.$emit("select", asset);
    }
  }

  genAssetItem(asset) {
    const h = this.$createElement;

    const { logo, chainLogo, name, select_symbol, symbol, id } = asset;
    const isActive = this.asset && this.asset.id === id;

    return h(
      VListItem,
      {
        on: { click: () => this.handleSelect(asset) },
        props: {
          ripple: false,
          "input-value": isActive,
          "active-class": "primary--text",
        },
      },
      [
        h("div", { staticClass: "mr-2 d-flex" }, [
          h("f-mixin-asset-logo", { props: { logo, chainLogo, size: 40 } }),
        ]),
        h(VListItemContent, [
          h(VListItemTitle, [`${select_symbol || symbol}`]),
          h(VListItemSubtitle, [name]),
        ]),
        h(VListItemAction, [
          h("base-asset-promote", { props: { asset: asset } }),
        ]),
      ]
    );
  }

  genList() {
    const h = this.$createElement;
    return h(VVirtualScroll, {
      props: { height: 420, "item-height": 60, items: this.filterAssets },
      scopedSlots: {
        default: ({ item }) => {
          return this.genAssetItem(item);
        },
      },
    });
  }

  render(h: CreateElement): VNode {
    const filter = h("f-input", {
      staticClass: "ma-0 pa-3 pt-0",
      props: {
        value: this.filter,
        hideDetails: true,
        singleLine: true,
        clearable: true,
        clearIcon: this.$icons.mdiClose,
        label: this.$t("search"),
      },
      slot: "subheader",
      on: { input: (val) => (this.filter = val) },
    });

    return h("div", { staticClass: "px-3" }, [filter, this.genList()]);
  }
}

@Component({ inheritAttrs: false, components: { AssetList } })
class AssetAmountInput extends Vue {}
export default AssetAmountInput;
</script>
