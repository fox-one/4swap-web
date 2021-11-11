<template>
  <f-bottom-sheet v-model="dialog" :title="$t('transaction.type')">
    <template #activator="{ on }">
      <div v-on="on">
        <span>{{ text }}</span>
        <v-icon size="16">$FIconChevronDown4P</v-icon>
      </div>
    </template>

    <div class="items">
      <base-select-item
        v-for="(item, index) in items"
        :key="index"
        :title="item.text"
        :value="item.value"
        :active="item.value === value"
        @select="handleSelect(item)"
      />
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";

@Component
class TransactionFilter extends Vue {
  @Model("change") value;

  dialog = false;

  get text() {
    return this.items.find((x) => x.value === this.value)?.text;
  }

  get items() {
    return [
      { text: this.$t("transaction.all"), value: "" },
      { text: this.$t("swap"), value: "swap" },
      { text: this.$t("liquidity.add"), value: "add" },
      { text: this.$t("liquidity.remove"), value: "remove" },
    ];
  }

  handleSelect(item) {
    this.dialog = false;
    this.$emit("change", item.value);
  }
}
export default TransactionFilter;
</script>
