<template>
  <div>
    <f-slider-tabs
      v-model="tab"
      :grow="true"
      :hide-slider="true"
      :max-slider-width="32"
      background-color="transparent"
      class="my-2"
    >
      <template #tabs>
        <v-tab
          v-for="(t, index) in tabs"
          :key="index"
          :data-value="index"
          :ripple="false"
        >
          <span>{{ t }}</span>
        </v-tab>
      </template>
    </f-slider-tabs>
    <my-position-tab
      v-if="tab === 0"
      :pair="pair"
      :base-asset="baseAsset"
      :quote-asset="quoteAsset"
      :liquidity-asset="liquidityAsset"
    />
    <pool-tab
      v-if="tab === 1"
      :pair="pair"
      :base-asset="baseAsset"
      :quote-asset="quoteAsset"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import MyPositionTab from "./MyPositionTab.vue";
import PoolTab from "./PoolTab.vue";

@Component({
  components: {
    MyPositionTab,
    PoolTab,
  },
})
class SharedTabs extends Vue {
  @Prop() pair;

  @Prop() baseAsset;

  @Prop() quoteAsset;

  @Prop() liquidityAsset;

  tab = 0;

  tabs = [this.$t("liquidity.my-position"), this.$t("pool")];
}
export default SharedTabs;
</script>
