<script lang="ts">
import { Vue } from "vue-property-decorator";
import { VLayout, VFlex } from "vuetify/lib";

export default Vue.extend({
  props: ["amount", "asset", "size", "showDisplaySymbol"],
  render(h) {
    const { asset, amount } = this;
    const formatAmount = this.$utils.number.format({ n: amount, p: 8 });
    if (!asset) return h();
    const symbol = this.showDisplaySymbol ? asset.display_symbol : asset.symbol;

    return h(VLayout, { staticClass: "amount-asset-item pa-2 align-center" }, [
      h("f-mixin-asset-logo", {
        staticClass: "mr-2",
        props: {
          size: this.size || 28,
          logo: asset.logo,
          chainLogo: asset.chainLogo,
        },
      }),
      h(VFlex, { staticClass: "f-body-2" }, [formatAmount + " " + symbol]),
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
  }
}
</style>
