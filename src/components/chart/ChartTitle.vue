<template>
  <div :class="classes">
    <div v-if="label" class="label">
      {{ label }}
    </div>
    <div>
      <render :nodes="title" />
    </div>
    <div v-if="hint" class="mt-3 hint">
      {{ hint }}
    </div>
    <div v-if="!thumb" class="mt-3 subtitle">
      <render :nodes="subtitle" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Render from "../base/Render";

@Component({
  components: {
    Render,
  },
})
class ChartTitle extends Vue {
  @Prop() title;

  @Prop() subtitle;

  @Prop() hint;

  @Prop() label;

  @Prop({ type: Boolean, default: false }) thumb;

  get classes() {
    return {
      "chart-title": true,
      "chart-title--thumb": this.thumb,
    };
  }
}
export default ChartTitle;
</script>

<style lang="scss" scoped>
.chart-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
  font-weight: bold;
  letter-spacing: -0.02em;
  font-feature-settings: "salt" on;

  ::v-deep {
    .symbol {
      font-size: 16px;
      line-height: 19px;
      letter-spacing: 0.011em;
    }
  }

  &--thumb {
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;

    ::v-deep {
      .symbol {
        font-size: 14px;
        letter-spacing: 0.011em;
      }
    }
  }
}

.label {
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  margin-bottom: 12px;
}

.subtitle,
.hint {
  font-weight: 500;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_1-base);
  opacity: 0.4;
}
</style>
