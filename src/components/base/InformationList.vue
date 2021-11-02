<template>
  <div :class="classes">
    <template v-for="(item, index) in items">
      <f-divider v-if="item === 'divider'" :key="index" class="my-6" />
      <information-item v-else :key="index" :small="small" v-bind="item" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import InformationItem from "./InformationItem.vue";

@Component({
  components: {
    InformationItem,
  },
})
class InformationList extends Vue {
  @Prop() items;

  @Prop({ type: Boolean, default: false }) small;

  @Prop({ type: Boolean, default: false }) reactive!: boolean;

  get classes() {
    return {
      "information-list": true,
      "information-list--reactive": this.reactive,
    };
  }
}
export default InformationList;
</script>

<style lang="scss" scoped>
.information-list--reactive {
  display: grid;
  column-gap: 24px;
  grid-template-columns: 1fr 1fr;
}
</style>
