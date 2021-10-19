<template>
  <div class="information-list">
    <information-item
      v-for="(item, index) in items"
      :key="index"
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
}
export default InformationList;
</script>
