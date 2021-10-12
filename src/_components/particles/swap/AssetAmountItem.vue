<script lang="ts">
import { Vue } from "vue-property-decorator";
import { VFlex } from "vuetify/lib";

export default Vue.extend({
  props: ["amount", "asset", "size", "showDisplaySymbol"],
  render(h) {
    const { asset, amount } = this;
    const formatAmount = this.$utils.number.format({ n: amount, p: 8 });
    if (!asset) return h();
    const symbol = this.showDisplaySymbol ? asset.display_symbol : asset.symbol;

    return h("div", { staticClass: "amount-asset-item" }, [
      h("f-mixin-asset-logo", {
        staticClass: "mr-2",
        props: {
          size: this.size || 40,
          logo: asset.logo,
          chainLogo: asset.chainLogo,
        },
      }),
      h(VFlex, { staticClass: "f-title-3" }, [symbol]),
      h(
        VFlex,
        {
          staticClass:
            "f-title-3 f-greyscale-3 text-truncate amount-asset-item-price",
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
  width: 120px;
  ::v-deep {
    .f-asset-logo__chain {
      width: 14px !important;
      height: 14px !important;

      .v-image {
        width: 10px !important;
        height: 10px !important;
      }
    }
  }
}

.amount-asset-item-price {
  font-weight: normal !important;
  width: 120px;
}
</style>
