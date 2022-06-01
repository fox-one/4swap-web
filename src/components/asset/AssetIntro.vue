<template>
  <div>
    <div class="intro">
      <template v-if="meta.isIntroEmpty">
        <empty-intro-placeholder />
      </template>
      <template v-else>
        <p v-for="(intro, index) of meta.intro" :key="index">
          {{ intro }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EmptyIntroPlaceholder from "./EmptyIntroPlaceholder.vue";

@Component({
  components: {
    EmptyIntroPlaceholder,
  },
})
class AssetIntro extends Vue {
  @Prop() info;

  @Prop() asset;

  get meta() {
    const isZh = this.$i18n.locale === "zh";
    const intro = isZh
      ? this.info?.intro?.zh ?? ""
      : this.info?.intro?.en ?? "";
    const isIntroEmpty = !intro || (intro && intro?.length === 0);

    return {
      website: this.info?.website ?? "",
      intro,
      isIntroEmpty,
    };
  }
}
export default AssetIntro;
</script>

<style lang="scss" scoped>
.intro {
  font-size: 12px;
  line-height: 1.5;
  color: var(--v-greyscale_3-base);
}

.link {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-decoration: none;
}
</style>
