<template>
  <f-button color="primary" v-bind="$attrs">
    {{ $t("next") }}
  </f-button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class AddAction extends Vue {}
export default AddAction;
</script>
