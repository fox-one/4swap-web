<template>
  <v-form v-model="valid">
    <div class="label mb-4">{{ $t("asset1") }}</div>
    <f-asset-select
      :asset="bindAsset1"
      :assets="assets"
      @input="handleChangeAsset1"
    />

    <div class="label mt-6 mb-4">{{ $t("asset2") }}</div>
    <f-asset-select
      :asset="bindAsset2"
      :assets="assets"
      @input="handleChangeAsset2"
    />

    <div class="label mt-6 mb-4">{{ $t("fee") }}</div>
    <create-fee />

    <div
      v-if="meta.isExist"
      v-html="$t('liquidity.create.alreay.exists')"
      class="hint mt-6"
      @click="handleToDetail"
    />

    <div class="text-center mt-6">
      <slot name="action" :valid="valid" />
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import { GlobalGetters } from "~/store/types";
import CreateFee from "./CreateFee.vue";

@Component({
  components: {
    CreateFee,
  },
})
class CreateForm extends Vue {
  @PropSync("asset1") bindAsset1;

  @PropSync("asset2") bindAsset2;

  @Prop() pair;

  valid = false;

  get meta() {
    return { isExist: !!this.pair };
  }

  get assets() {
    return this.$store.getters[GlobalGetters.AVALIABLE_ADD_ASSETS];
  }

  handleChangeAsset1(asset) {
    if (asset === this.bindAsset2) {
      this.handleSwitchAsset();
    } else {
      this.bindAsset1 = asset;
    }
  }

  handleChangeAsset2(asset) {
    if (asset === this.bindAsset1) {
      this.handleSwitchAsset();
    } else {
      this.bindAsset2 = asset;
    }
  }

  handleSwitchAsset() {
    const tmp = this.bindAsset1;

    this.bindAsset1 = this.bindAsset2;
    this.bindAsset2 = tmp;
  }

  handleToDetail() {
    this.$router.push({
      name: "pair-detail",
      query: {
        base: this.pair?.base_asset_id,
        quote: this.pair?.quote_asset_id,
      },
    });
  }
}
export default CreateForm;
</script>

<style lang="scss" scoped>
.label {
  font-size: 18px;
  font-weight: 600;
}

.hint {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);

  ::v-deep {
    .link {
      color: var(--v-secondary-base);
    }
  }
}
</style>
