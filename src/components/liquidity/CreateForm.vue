<template>
  <v-form v-model="valid">
    <div class="label mb-4">{{ $t("asset1") }}</div>
    <f-asset-select v-model="bindAsset1" :assets="assets" :rounded="false" />

    <div class="label mt-6 mb-4">{{ $t("asset2") }}</div>
    <f-asset-select v-model="bindAsset2" :assets="assets" />

    <div class="label mt-6 mb-4">{{ $t("tip.label.fee") }}</div>
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

::v-deep {
  .f-asset-select-field {
    border-radius: 8px !important;
    height: 56px !important;
  }
}
</style>
