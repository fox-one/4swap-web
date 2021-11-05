<template>
  <div>
    <div class="text-center">
      <f-mixin-asset-logo
        :size="40"
        :logo="meta.logo"
        :chain-logo="meta.chainLogo"
      />

      <div class="name mt-3">{{ meta.name }}</div>

      <a
        v-if="meta.website"
        class="link my-4 secondary--text"
        :href="meta.website"
      >
        <span class="mr-1">{{ meta.website }}</span>
        <v-icon size="16" color="secondary">$FIconLink4P</v-icon>
      </a>
    </div>

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
class BriefIntroduction extends Vue {
  @Prop() info;

  @Prop() asset;

  get meta() {
    const isZh = this.$i18n.locale === "zh";
    const intro = isZh
      ? this.info?.intro?.zh ?? ""
      : this.info?.intro?.en ?? "";
    const isIntroEmpty = !intro || (intro && intro?.length === 0);

    return {
      name: this.asset?.name ?? "",
      logo: this.asset?.logo ?? "",
      chainLogo: this.asset?.chain.logo ?? "",
      website: this.info?.website ?? "",
      intro,
      isIntroEmpty,
    };
  }
}
export default BriefIntroduction;
</script>

<style lang="scss" scoped>
.name {
  font-size: 25px;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.02em;
  font-feature-settings: "salt" on;
}

.link {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.intro {
  font-size: 12px;
  line-height: 1.5;
  color: var(--v-greyscale_3-base);
}
</style>
