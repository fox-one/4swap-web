<template>
  <div :class="classes">
    <information-item
      v-for="(item, index) in items"
      :key="index"
      :small="small"
      v-bind="item"
    />
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
