<template>
  <f-button color="primary" class="liuquidtiy-action" @click="handleAdd">
    <v-icon size="16">$FIconAdd4PBold</v-icon>
    <span class="ml-2">{{ $t("liquidity.add") }}</span>
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

<style lang="scss" scoped>
.liuquidtiy-action {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
}

.theme--dark .liuquidtiy-action {
  box-shadow: 0px 8px 32px rgba(255, 255, 255, 0.12);
}
</style>
