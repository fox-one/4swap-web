<template>
  <f-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <f-list-item
        v-on="on"
        :title="$t('currency.title')"
        :value="currentCurrency"
      >
      </f-list-item>
    </template>
    <template #title>
      {{ $t("currency.title") }}
    </template>
    <v-list>
      <v-list-item
        v-for="(currency, index) in currencies"
        :key="index"
        @click="handleSetCurrency(currency)"
      >
        <v-list-item-title>{{ currency.unit }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CURRENCY, SUP_CURRENCY } from "~/constants";

@Component
class CurrencySetting extends Vue {
  dialog = false;

  get currencies() {
    return SUP_CURRENCY.map((c) => CURRENCY[c]);
  }

  get currentCurrency() {
    return CURRENCY[this.settings.currency.toUpperCase()].unit;
  }

  get settings() {
    return this.$store.state.app.settings;
  }

  handleSetCurrency({ id }) {
    this.$store.commit("app/SET_SETTINGS", { currency: id });
    this.dialog = false;
  }
}
export default CurrencySetting;
</script>
