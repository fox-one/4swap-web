<template>
  <f-tooltip v-if="isDesktop || !dialog" v-model="show" top>
    <template #activator="{ on }">
      <v-icon
        v-if="hint"
        size="14"
        color="greyscale_1"
        class="icon"
        v-bind="$attrs"
        @click="on.click"
      >
        $FIconInfo4P
      </v-icon>
    </template>

    <div class="hint" v-if="html" v-html="hint" />
    <div class="hint" v-else v-text="hint" />
  </f-tooltip>

  <f-bottom-sheet v-else v-model="show" top>
    <template #activator="{ on }">
      <v-icon
        v-if="hint"
        size="14"
        color="greyscale_1"
        class="icon"
        v-bind="$attrs"
        @click="on.click"
      >
        $FIconInfo4P
      </v-icon>
    </template>

    <f-bottom-sheet-title>
      {{ $t("details") }}
    </f-bottom-sheet-title>
    <div class="hint">
      <div class="pa-6 pt-0" v-if="html" v-html="hint" />
      <div class="pa-6 pt-0" v-else v-text="hint" />

      <div class="text-center my-8">
        <f-button color="primary" @click="handleClose">
          {{ $t("close") }}
        </f-button>
      </div>
    </div>
  </f-bottom-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class Tip extends Vue {
  @Prop() hint!: string;

  @Prop({ type: Boolean, default: false }) dialog!: boolean;

  @Prop({ type: Boolean, default: false }) html!: boolean;

  show = false;

  get isDesktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  handleClose() {
    this.show = false;
  }
}
export default Tip;
</script>

<style lang="scss" scoped>
.icon {
  background-color: var(--v-greyscale_5-base);
  border-radius: 14px;
}

.hint {
  line-height: 1.5;
}
</style>
