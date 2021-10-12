<template>
  <div @click="handleSort" class="d-flex align-center">
    <slot />
    <template v-if="sorted">
      <v-icon v-if="ascending" size="16" class="mr-1">
        {{ $icons.mdiSortReverseVariant }}
      </v-icon>
      <v-icon v-else size="16" class="mr-1">
        {{ $icons.mdiSortVariant }}
      </v-icon>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class SortableField extends Vue {
  @Prop() ascending!: boolean;

  @Prop() value!: string;

  @Prop() sortby!: string;

  get sorted() {
    return this.value === this.sortby;
  }

  handleSort() {
    const params = {
      sortby: this.value,
      ascending: this.sorted ? !this.ascending : this.ascending,
    };
    this.$emit("sort", params);
  }
}
export default SortableField;
</script>
