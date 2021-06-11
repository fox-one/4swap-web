<script lang="ts">
import { Vue } from "vue-property-decorator";
import { VLayout } from "vuetify/lib";

export default Vue.extend({
  props: ["amount", "asset", "size", "showDisplaySymbol"],
  render(h) {
    const { asset, amount } = this;
    const simplize = this.$utils.number.simplize;
    const lang = this.$vuetify.lang.current;
    const formatAmount = simplize(amount, 8, lang);
    if (!asset) return h();
    const symbol = this.showDisplaySymbol ? asset.display_symbol : asset.symbol;

    return h("div", { staticClass: "amount-asset-item" }, [
      h(VLayout, { staticClass: "align-center" }, [
        h("f-mixin-asset-logo", {
          staticClass: "mr-2",
          props: {
            size: this.size || 28,
            logo: asset.logo,
            chainLogo: asset.chainLogo,
          },
        }),
        h("span", { staticClass: "f-title-3" }, [symbol]),
      ]),
      h(
        "div",
        {
          staticClass:
            "f-body-2 f-greyscale-3 text-truncate amount-asset-item-num",
        },
        [formatAmount]
      ),
      h("div", [this.$slots.suffix]),
    ]);
  },
});
</script>

<style lang="scss" scoped>
.amount-asset-item {
  ::v-deep {
    .f-asset-logo__chain {
      width: 14px !important;
      height: 14px !important;

      .v-image {
        width: 10px !important;
        height: 10px !important;
      }
    }

    .amount-asset-item-num {
      margin-top: 14px;
      width: 120px;
      font-weight: normal !important;
    }
  }
}
</style>
