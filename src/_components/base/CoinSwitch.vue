<template>
  <f-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <div v-on="on" class="px-1 py-0 f-title-2 version-label">
        {{ title }}
        <v-icon size="16" class="icon">
          {{ dialog ? $icons.mdiChevronUp : $icons.mdiChevronDown }}
        </v-icon>
      </div>
    </template>
    <template #title>
      {{ $t("statistic.coin.select.asset") }}
    </template>
    <template #subheader>
      <f-input
        class="ma-0 px-3 pt-0"
        v-model="filter"
        hide-details
        single-line
        clearable
        :label="$t('search')"
      />
    </template>
    <v-list>
      <v-virtual-scroll height="420" :items="filterAssets" item-height="60">
        <template v-slot:default="{ item }">
          <v-list-item
            :key="item.id"
            active-class="primary--text"
            @click="handleSwitch(item)"
          >
            <f-mixin-asset-logo
              :logo="item.logo"
              :chain-logo="item.chainLogo"
              :size="32"
              class="mx-2"
            />
            <v-list-item-content>
              <v-list-item-title class="d-flex align-center">
                <span class="mr-4 font-weight-bold">
                  {{ item.symbol }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 text-wrap">
                {{ item.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class CoinSwitch extends Vue {
  @Prop({ type: String, default: "" }) defaultTitle!: string;

  @Prop({ type: Array, default: [] }) assets!: API.Asset[];

  @Prop({ type: String, default: "" }) defaultId!: string;

  dialog = false;

  filter = "";

  title = this.defaultTitle;

  currentId = this.defaultId;

  get filterAssets() {
    const filter = this.filter?.toLowerCase() ?? "";
    return this.assets.filter((asset) => {
      const name = (asset.name || "").toLowerCase();
      const symbol = (asset.symbol || "").toLowerCase();
      return name.startsWith(filter) || symbol.includes(filter);
    });
  }

  handleSwitch(asset: API.Asset) {
    if (this.currentId !== asset.id) {
      this.currentId = asset.id;
      this.title = asset.symbol;
      this.$router.replace({
        name: "statistic-coin",
        query: {
          id: asset.id,
        },
      });
    }
    this.dialog = false;
  }
}
export default CoinSwitch;
</script>

<style lang="scss" scoped>
.version-label {
  line-height: 20px !important;
  height: 20px;
}
</style>
