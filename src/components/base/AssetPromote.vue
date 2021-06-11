<template>
  <a
    v-if="meta.promotion"
    :style="{ color: meta.color }"
    class="body-2"
    @click.stop="handleClick"
  >
    <v-icon :color="meta.color" size="16"> $vuetify.icons.iconInfo </v-icon>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAsset } from "~/services/types/vo";

@Component
class AssetPromote extends Vue {
  @Prop() asset!: IAsset;

  get meta() {
    const promotion = this.asset?.promotion;
    const url = promotion?.url;
    const label = promotion?.label;
    const color = promotion?.color || "accent";
    return {
      promotion,
      url,
      label,
      color,
    };
  }

  handleClick() {
    if (this.meta.url) {
      window.location.href = this.meta.url;
    }
  }
}
export default AssetPromote;
</script>
