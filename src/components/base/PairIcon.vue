<template>
  <div
    v-if="baseAsset && quoteAsset"
    class="pair-icon"
    :class="{ 'pair-icon--small': small }"
  >
    <v-sheet class="pair-icon__base rounded-circle">
      <f-mixin-asset-logo
        :size="size"
        :logo="baseAsset.logo"
        :chain-logo="baseAsset.chainLogo"
      />
    </v-sheet>
    <v-sheet class="pair-icon__quote rounded-circle">
      <f-mixin-asset-logo
        :size="size"
        :logo="quoteAsset.logo"
        :chain-logo="quoteAsset.chainLogo"
      />
    </v-sheet>
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
    margin-left: -4px;
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
}
</style>
