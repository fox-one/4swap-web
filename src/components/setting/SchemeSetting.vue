<template>
  <f-bottom-sheet v-model="dialog" :title="$t('chart_scheme.title')">
    <template #activator="{ on }">
      <f-list-item
        v-on="on"
        :title="$t('chart_scheme.title')"
        :subtitle="meta.text"
        class="pa-0"
      />
    </template>

    <div>
      <base-select-item
        v-for="(item, index) in items"
        :key="index"
        :title="item.text"
        :value="item.value"
        :active="item.value === scheme"
        @select="handleSelect"
      />
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";
import { SUP_CHART_SCHEMES } from "@/constants";
import { GlobalMutations } from "@/store/types";
import { VIcon } from "vuetify/lib";

@Component
class SchemeSetting extends Vue {
  @Sync("app/settings@chartScheme") scheme;

  dialog = false;

  get meta() {
    return {
      text: this.genSchemeText(this.scheme),
    };
  }

  get items() {
    return SUP_CHART_SCHEMES.map((x) => ({
      text: this.genSchemeText(x),
      value: x,
    }));
  }

  genSchemeText(value) {
    const h = this.$createElement;
    const icons = {
      SCHEME_A: "$IconSchemeA",
      SCHEME_B: "$IconSchemeB",
    };

    return h("span", { staticClass: "scheme-text" }, [
      this.$t(`chart_scheme.${value.toLowerCase()}`) as string,
      h(VIcon, [icons[value]]),
    ]);
  }

  handleSelect(value) {
    this.dialog = false;
    this.$store.commit(GlobalMutations.SET_SETTINGS, { chartScheme: value });
  }
}
export default SchemeSetting;
</script>
<style lang="scss" scoped>
::v-deep {
  .scheme-text {
    display: flex;
    align-items: center;

    .v-icon {
      margin-left: 8px;
    }
  }
}
</style>
