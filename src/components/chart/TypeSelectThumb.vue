<template>
  <div>
    <span>{{ display }}</span>
    <v-icon size="16">$FIconExchange4P</v-icon>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
class TypeSelectThumb extends Vue {
  @PropSync("value") bindValue;

  @Prop() types;

  get display() {
    return this.types.find((x) => x.value === this.bindValue)?.text;
  }
}
export default TypeSelectThumb;
</script>
