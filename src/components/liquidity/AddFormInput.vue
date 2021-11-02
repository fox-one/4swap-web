<template>
  <f-asset-amount-input
    v-model="bindData.amount"
    :asset.sync="bindData.asset"
    :assets="meta.selects"
    :placeholder="$t('liquidity.amount')"
    :rules="rules"
    hide-details
    fullfilled
  >
    <template #tools="{ messages }">
      <f-asset-input-tools
        :wallet-connected="meta.logged"
        :balance="meta.balanceText"
        :fiat-amount="meta.amountFiatText"
        :messages="messages"
        @fill="handleFill"
      />
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Prop } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";

function getAssetsWithoutOpponent(assets, opponent) {
  return assets.filter((x) => {
    return opponent?.id !== x.id;
  });
}

@Component
class AddFormInput extends Vue {
  @PropSync("data") bindData;

  @Prop() opponent;

  get assets() {
    const assets = this.$store.getters[GlobalGetters.AVALIABLE_ADD_ASSETS];

    return getAssetsWithoutOpponent(assets, this.opponent);
  }

  get meta() {
    const format = this.$utils.number.format;
    const toFiat = this.$utils.currency.toFiat;
    const getters = this.$store.getters;
    const asset = this.bindData.asset;
    const amount = this.bindData?.amount ?? 0;
    const price = asset?.price ?? 0;

    const logged = getters[GlobalGetters.LOGGED];

    const assets = getters[GlobalGetters.AVALIABLE_ADD_ASSETS];
    const selects = getAssetsWithoutOpponent(assets, this.opponent);

    const balance = getters[GlobalGetters.GET_BALANCE_BY_ID](
      this.bindData.asset?.id ?? ""
    );
    const balanceText = format({ n: balance });

    const amountFiat = amount * price;
    const amountFiatText = toFiat(this, { n: amountFiat });

    return {
      logged,
      selects,
      balance,
      balanceText,
      amountFiatText,
    };
  }

  get rules() {
    return [];
  }

  handleFill() {
    this.bindData.amount = this.meta.balance;
  }
}
export default AddFormInput;
</script>
