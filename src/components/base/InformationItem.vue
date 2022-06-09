<template>
  <v-layout :class="classes">
    <div>
      <span class="information-item__title mr-1">
        {{ title }}
      </span>

      <base-tool-tip :hint="hint" dialog />
    </div>

    <v-spacer />

    <div class="information-item__value">
      <span>
        <Render :nodes="value" />
      </span>
      <v-icon v-if="icon" size="12" class="ml-1" @click.stop="handleTileClick">
        {{ icon }}
      </v-icon>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Render from "./Render";

@Component({
  components: { Render },
})
class InformationItem extends Vue {
  @Prop() title!: string;

  @Prop() icon!: string;

  @Prop() value!: string;

  @Prop() hint!: string;

  @Prop() titleFn;

  @Prop({ type: Boolean, default: false }) small!: boolean;

  get classes() {
    return {
      "information-item": true,
      "information-item--small": this.small,
    };
  }

  handleTileClick() {
    if (typeof this.titleFn === "function") {
      this.titleFn();
    }
  }
}
export default InformationItem;
</script>

<style lang="scss" scoped>
.information-item {
  margin: 24px 0;

  &--small {
    font-size: 12px;
  }

  &__value {
    margin-left: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: var(--v-greyscale_3-base);
  }
}
</style>
