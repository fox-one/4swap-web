<template>
  <f-button :disabled="meta.disabled" color="primary">
    {{ $t("pay") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class CreateAction extends Vue {
  @Prop() valid;

  get meta() {
    return {
      disabled: !this.valid,
    };
  }
}
export default CreateAction;
</script>
