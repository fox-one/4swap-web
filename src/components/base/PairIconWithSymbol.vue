<template>
  <div
    v-if="baseAsset && quoteAsset"
    class="pair-icon"
    :class="{ 'pair-icon--small': small }"
  >
    <div class="pair-icon__base">
      <f-mixin-asset-logo
        :size="size"
        :logo="baseAsset.logo"
        :chain-logo="baseAsset.chainLogo"
      />
      <span class="ml-1 pair-icon-symbol">{{ baseAsset.symbol }}</span>
    </div>
    <div class="pair-icon-x d-flex align-center"><icon-x /></div>
    <div class="pair-icon__quote">
      <f-mixin-asset-logo
        :size="size"
        :logo="quoteAsset.logo"
        :chain-logo="quoteAsset.chainLogo"
      />
      <span class="ml-1 pair-icon-symbol">{{ quoteAsset.symbol }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAsset } from "~/services/types/vo";

@Component
class PairIcon extends Vue {
  @Prop() baseAsset!: IAsset;

  @Prop() quoteAsset!: IAsset;

  @Prop({ default: false, type: Boolean }) small!: boolean;

  get size() {
    return this.small ? 24 : 32;
  }
}
export default PairIcon;
</script>

<style lang="scss" scoped>
.pair-icon {
  display: flex;

  &__base,
  &__quote {
    display: flex;
    padding: 2px;
  }

  &__quote {
    z-index: 1;
  }

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

  &--small {
    .pair-icon__base,
    .pair-icon__quote {
      padding: 1px;
    }

    ::v-deep {
      .f-asset-logo__chain {
        width: 10px !important;
        height: 10px !important;
        left: -2px;
        bottom: -2px;

        .v-image {
          width: 8px !important;
          height: 8px !important;
        }
      }
    }
  }

  &-symbol {
    line-height: 24px;
    font-weight: 500;
  }

  &-x {
    margin: 0 6px;
  }
}
</style>
