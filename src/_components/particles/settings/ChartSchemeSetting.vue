<template>
  <f-bottom-sheet v-model="dialog">
    <template #activator="{ on }">
      <f-list-item v-on="on" :title="$t('chart_scheme.title')">
        <template #tail>
          <v-img
            max-width="24"
            max-height="24"
            :src="currentSchemeIcon"
            class="mr-1"
          />
        </template>
      </f-list-item>
    </template>
    <template #title>
      {{ $t("chart_scheme.title") }}
    </template>
    <v-list>
      <v-list-item
        v-for="scheme in schemes"
        :key="scheme.id"
        @click="handleSetChartScheme(scheme)"
      >
        <v-list-item-icon class="mr-4">
          <v-img
            max-width="24"
            max-height="24"
            :src="getSchemeIcon(scheme.id)"
            class="mr-1"
          />
        </v-list-item-icon>
        <v-list-item-title>{{
          $t(`chart_scheme.${scheme.id.toLowerCase()}`)
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CHART_SCHEMES, SUP_CHART_SCHEMES } from "~/constants";

@Component
class ChartSchemeSetting extends Vue {
  dialog = false;

  schemeAIcon = require("~/assets/images/chart_scheme_a.png");

  schemeBIcon = require("~/assets/images/chart_scheme_b.png");

  get schemes() {
    return SUP_CHART_SCHEMES.map((c) => CHART_SCHEMES[c]);
  }

  get currentSchemeIcon() {
    return this.getSchemeIcon(this.settings.chartScheme.toUpperCase());
  }

  get settings() {
    return this.$store.state.app.settings;
  }

  getSchemeIcon(id) {
    if (id === "SCHEME_B") {
      return this.schemeBIcon;
    }
    return this.schemeAIcon;
  }

  handleSetChartScheme({ id }) {
    this.$store.commit("app/SET_SETTINGS", { chartScheme: id });
    this.dialog = false;
  }
}
export default ChartSchemeSetting;
</script>
