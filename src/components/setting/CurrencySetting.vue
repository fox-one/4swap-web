<template>
  <f-bottom-sheet v-model="dialog" :title="$t('currency.title')">
    <template #activator="{ on }">
      <f-list-item
        v-on="on"
        :title="$t('currency.title')"
        :subtitle="currency"
        class="pa-0"
      />
    </template>

    <div>
      <base-select-item
        v-for="(item, index) in items"
        :key="index"
        :title="item.text"
        :value="item.value"
        :active="item.value === currency"
        @select="handleSelect"
      />
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import { CURRENCY } from "@/utils/currency";
import { GlobalMutations } from "@/store/types";

@Component
class CurrencySetting extends Vue {
  @Sync("app/settings@currency") currency;

  dialog = false;

  get items() {
    return Object.values(CURRENCY).map((x) => ({
      text: x.name,
      value: x.name,
    }));
  }

  handleSelect(value) {
    this.dialog = false;
    this.$store.commit(GlobalMutations.SET_SETTINGS, { currency: value });
  }
}
export default CurrencySetting;
</script>
