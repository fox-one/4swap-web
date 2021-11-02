<template>
  <v-layout>
    <div @click="$emit('switch')">
      <span class="label-3">{{ $t("pool") }}</span>
      <v-icon size="12">$IconSwitcher</v-icon>
    </div>

    <v-spacer />

    <div @click="$emit('sort')">
      <span class="label-3">{{ $t(meta.dimension.text) }}</span>
      <v-icon size="12">{{ meta.sort.icon }}</v-icon>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive } from "vue-property-decorator";
import { dimensions } from "./DimensionList.vue";
import { sorts } from "./PoolList.vue";

@Component
class PoolHeader extends Vue {
  @InjectReactive()
  dimension!: string;

  @InjectReactive()
  reverse!: boolean;

  @InjectReactive()
  sort!: string;

  get meta() {
    const dimension = dimensions.find((x) => x.value === this.dimension);
    const sort = sorts.find((x) => x.value === this.sort);

    return { dimension, sort };
  }
}
export default PoolHeader;
</script>
