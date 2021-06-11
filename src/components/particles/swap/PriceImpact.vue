<template>
  <v-scroll-y-reverse-transition>
    <v-layout v-if="preOrder" justify-center align-center class="mt-5">
      <v-chip
        label
        class="f-body-2"
        :color="meta.bgColor"
        :text-color="meta.textColor"
      >
        {{ $t("swap.price.impact") }}: {{ impact }}
      </v-chip>
    </v-layout>
  </v-scroll-y-reverse-transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PriceImpact extends Vue {
  @Prop() preOrder: API.SwapOrder | null = null;

  @Prop() impactValue!: number;

  @Prop() impact!: string;

  get meta() {
    let textColor = "";
    let bgColor = "";

    const offset = Math.abs(this.impactValue * 100);
    if (offset >= 0 && offset <= 1) {
      textColor = "#A6EB70";
      bgColor = "rgba(166, 235, 112, 0.1)";
    } else if (offset > 1 && offset <= 10) {
      textColor = "#EBB270";
      bgColor = "rgba(235, 200, 112, 0.1)";
    } else if (offset > 10) {
      textColor = "#EB7086";
      bgColor = "rgba(235, 112, 134, 0.1)";
    }

    return { textColor, bgColor };
  }
}
export default PriceImpact;
</script>
