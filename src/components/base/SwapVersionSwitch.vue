<template>
  <f-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <div class="ml-4 mr-1">{{ title }}</div>
      <div
        v-on="$config.LEGACY_WEB_HOST ? on : null"
        class="px-1 py-0 f-title-2 rounded-lg version-label primary"
        style="font-size: 15px !important"
      >
        {{ current.label }}
      </div>
    </template>
    <template #title>
      {{ $t("version.switch") }}
    </template>
    <v-list>
      <v-list-item-group mandatory :value="current.id">
        <v-list-item
          v-for="(version, id) in versions"
          :key="id"
          :value="id"
          class="py-5 px-8"
          active-class="primary--text"
          @click="handleSwitch(id, version)"
        >
          <v-list-item-avatar>
            <v-img :src="version.icon" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="d-flex align-center">
              <span class="mr-4 font-weight-bold">
                {{ version.title }}
              </span>
            </v-list-item-title>
            <v-list-item-subtitle class="mt-1 text-wrap version-desc">
              {{ version.description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IS_MTG } from "@/constants";

@Component
class SwapEnvSwitch extends Vue {
  @Prop({ type: String, default: "" }) title!: string;

  dialog = false;

  get versions() {
    let versions: any = {
      mtg: {
        id: "mtg",
        title: this.$t("channel.name.mtg"),
        label: this.$t("mtg"),
        host: this.$config.MTG_WEB_HOST,
        description: this.$t("version.mtg.description"),
        icon: require("@/assets/images/logo_4swap_mtg.png"),
      },
    };

    if (this.$config.LEGACY_WEB_HOST) {
      versions.legacy = {
        id: "legacy",
        title: this.$t("channel.name.legacy"),
        label: this.$t("legacy"),
        host: this.$config.LEGACY_WEB_HOST,
        description: this.$t("version.legacy.description"),
        icon: require("@/assets/images/logo_4swap_legacy.png"),
      };
    }

    return versions;
  }

  get current() {
    const currentId = IS_MTG ? "mtg" : "legacy";
    return this.versions[currentId];
  }

  handleSwitch(key, version) {
    if (this.current.id !== key) {
      window.location.href = version.host + "/#" + this.$route.path;
    } else {
      this.dialog = false;
    }
  }
}
export default SwapEnvSwitch;
</script>

<style lang="scss" scoped>
.version-label {
  line-height: 20px !important;
  height: 20px;
  color: #ffffff;
}

.version-desc {
  max-width: 210px !important;
  font-size: 12px !important;
}
</style>
