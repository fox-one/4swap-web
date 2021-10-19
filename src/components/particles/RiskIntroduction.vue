<template>
  <base-expansion-panel>
    <template #title>
      <v-layout align-center>
        <span class="mr-2">
          <v-img width="24" height="24" :src="icon" />
        </span>

        <span>{{ $t("swap.introduction.risk.title") }}</span>
      </v-layout>
    </template>

    <template #content>
      {{ $t("swap.introduction.risk.content") }}
    </template>
  </base-expansion-panel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class RiskIntroduction extends Vue {
  icon = require("@/assets/images/icon_notify.png");
}
export default RiskIntroduction;
</script>
