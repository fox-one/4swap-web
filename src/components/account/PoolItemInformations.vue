<template>
  <div class="informations">
    <div v-for="(item, index) in items" class="information-item" :key="index">
      <div class="label-3">{{ item.title }}</div>
      <div class="value mt-2">
        <Render :nodes="item.value" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Render from "../base/Render";

@Component({
  components: {
    Render,
  },
})
class PoolItemInformations extends Vue {
  @Prop() items;
}
export default PoolItemInformations;
</script>

<style lang="scss" scoped>
.informations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 24px;
}

.value {
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: -0.006em;
}
</style>
