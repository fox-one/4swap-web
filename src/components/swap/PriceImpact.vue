<template>
  <div :class="classes">
    <div class="blocks">
      <div class="block filled" />
      <div v-if="meta.type === 'low'" class="block empty" />
      <div
        v-if="meta.type === 'low' || meta.type === 'mid'"
        class="block empty"
      />
    </div>

    <span class="text">{{ meta.text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PriceImpact extends Vue {
  @Prop() value!: string;

  get meta() {
    const value = Number(this.value);
    const text = this.$utils.number.toPercent({ n: value });
    const type = value <= 0.01 ? "low" : value <= 0.1 ? "mid" : "high";

    return { text, type };
  }

  get classes() {
    return {
      "price-impact": true,
      [`price-impact--${this.meta.type}`]: true,
    };
  }
}
export default PriceImpact;
</script>

<style lang="scss" scoped>
.price-impact {
  display: inline-block;

  &--low {
    .filled {
      background-color: var(--v-success-base);
      width: 5px;
    }
  }

  &--mid {
    .filled {
      background-color: var(--v-warning-base);
      width: 12px;
    }
  }

  &--high {
    .filled {
      background-color: var(--v-error-base);
      width: 19px;
    }
  }
}

.blocks {
  display: inline-block;
  margin-right: 4px;
  font-size: 0;
}

.block {
  display: inline-block;
  border-radius: 1px;
  height: 10px;
  margin-right: 2px;

  &.empty {
    width: 5px;
    background-color: var(--v-greyscale_5-base);
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
