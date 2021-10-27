<template>
  <div v-html="html" class="fiat-division"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class FiatDivision extends Vue {
  @Prop() parts!: {
    type: string;
    value: string;
  }[];

  get html() {
    if (typeof this.parts !== "object") {
      return this.parts;
    }

    return this.parts?.reduce((str, part) => {
      if (part.type === "currency") {
        return `${str}<span class="symbol">${part.value}</span>`;
      }

      return `${str}${part.value}`;
    }, "");
  }
}
export default FiatDivision;
</script>

<style lang="scss" scoped>
.fiat-division {
  display: inline-block;
  font-size: 25px;
  line-height: 30px;
  font-weight: bold;

  ::v-deep {
    .symbol {
      font-size: 16px;
      line-height: 19px;
    }
  }
}
</style>
