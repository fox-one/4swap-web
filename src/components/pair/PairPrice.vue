<template>
  <div class="text-center">
    <div class="logos">
      <f-mixin-asset-logo
        :size="24"
        :chain-size="6"
        :logo="getLogo(meta.baseAsset)"
        :chain-logo="getChainLogo(meta.baseAsset)"
      />
      <v-avatar
        size="24"
        color="greyscale_6"
        class="mx-2"
        @click="handleSwitch"
      >
        <v-icon size="16">$FIconArrowRight4P</v-icon>
      </v-avatar>

      <f-mixin-asset-logo
        :size="24"
        :chain-size="6"
        :logo="getLogo(meta.quoteAsset)"
        :chain-logo="getChainLogo(meta.quoteAsset)"
      />
    </div>

    <div class="price number mt-3">
      <span class="mr-2">{{ meta.priceText }}</span>
    </div>

    <div class="mt-3">
      <span class="price-change" :style="{ background: meta.priceChangeColor }">
        {{ meta.priceChangeText }}
      </span>
      <span class="price-label">
        <f-hint :hint="$t('reference.price.hint')">
          <template #activator="{ on }">
            <div v-on="on" class="as">
              {{ $t("reference.price") }}
              <v-icon size="12" color="greyscale_1" class="f-hint-activator">
                $info
              </v-icon>
            </div>
          </template>
        </f-hint>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairPrice extends Vue {
  @Prop() pair!: API.Pair;

  @Prop() data;

  reverse = false;

  get meta() {
    const toPercent = this.$utils.number.toPercent;
    const getPairMeta = this.$utils.pair.getPairMeta;
    const getColor = this.$utils.color.getColor;
    const getPriceChangeInDuration = this.$utils.pair.getPriceChangeInDuration;
    const { baseAsset, quoteAsset, priceText, isReverse } = getPairMeta(
      this,
      this.pair,
      this.reverse
    )!;
    const priceChange = getPriceChangeInDuration(this.data.kline, 1, isReverse);
    const priceChangeText = toPercent({ n: priceChange, dp: 2, symbol: true });
    const priceChangeColor = getColor(this, priceChange);

    return {
      baseAsset,
      quoteAsset,
      priceText,
      priceChangeText,
      priceChangeColor,
    };
  }

  getLogo(asset) {
    return asset?.logo;
  }

  getChainLogo(asset) {
    return asset?.chainLogo || (asset?.chain?.logo ?? "");
  }

  handleSwitch() {
    this.reverse = !this.reverse;
  }
}
export default PairPrice;
</script>

<style lang="scss" scoped>
.logos {
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-label {
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  color: var(--v-greyscale_3-base);
  background: var(--v-greyscale_6-base);
  padding: 6px;
  border-radius: 8px;
  display: inline-block;
}

.price-change {
  color: #ffffff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  padding: 6px;
  line-height: 12px;
  margin-right: 8px;
  display: inline-block;
}

.price {
  font-weight: bold;
  font-size: 20px;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
