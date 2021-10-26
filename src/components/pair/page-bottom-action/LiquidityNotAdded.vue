<template>
  <f-button @click="handleAdd">
    <v-icon size="16">$FIconAdd4P</v-icon>
    <span>{{ $t("liquidity.add") }}</span>
  </f-button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class PageActionNotAdded extends Vue {
  handleAdd() {
    this.$emit("add");
  }
}
export default PageActionNotAdded;
</script>
