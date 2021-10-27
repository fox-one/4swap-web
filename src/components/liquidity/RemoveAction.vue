<template>
  <f-button :disabled="meta.disabled" color="primary">
    {{ $t("next") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class RemoveAction extends Vue {
  @Prop() valid;

  get meta() {
    const disabled = !this.valid;

    return { disabled };
  }
}
export default RemoveAction;
</script>
