<template>
  <v-layout :class="classes">
    <div>
      <span class="label-3 mr-1" @click="handleTitleClick">{{ title }}</span>

      <v-icon v-if="icon" size="12" class="mr-1" @click="handleTitleClick">
        {{ icon }}
      </v-icon>

      <base-tool-tip :hint="hint" dialog />
    </div>

    <v-spacer />

    <div>
      <span class="ml-2">
        <Render :nodes="value" />
      </span>
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

  handleTitleClick() {
    if (typeof this.titleFn === "function") {
      this.titleFn();
    }
  }
}
export default InformationItem;
</script>

<style lang="scss" scoped>
.information-item {
  font-weight: 500;
  margin: 12px 0;
  line-height: 1.5;
  font-size: 13px;

  &--small {
    font-size: 12px;
  }
}
</style>
