<template>
  <div :class="classes">
    <div class="expansion-panel__title" @click="handleToggle">
      <v-flex>
        <slot name="title" />
      </v-flex>

      <v-icon size="16" class="expansion-panel__icon">
        $FIconChevronDown4P
      </v-icon>
    </div>
    <v-expand-transition>
      <div v-if="expand" class="expansion-panel__content">
        <div class="gap" />
        <slot name="content" />
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class ExpansionPanel extends Vue {
  expand = true;

  get classes() {
    return {
      rounded: true,
      "expansion-panel": true,
      "expansion-panel--active": this.expand,
    };
  }

  handleToggle() {
    this.expand = !this.expand;
  }
}
export default ExpansionPanel;
</script>

<style lang="scss" scoped>
.expansion-panel {
  background: var(--v-greyscale_6-base);
  padding: 16px;
  transition: 0.2s ease;

  &--active {
    .expansion-panel__icon {
      transform: rotate(180deg);
    }
  }

  &__title {
    display: flex;
    align-items: center;
    font-weight: 600;
  }

  &__content {
    color: var(--v-greyscale_3-base);
    font-size: 14px;
    line-height: 17px;

    .gap {
      height: 16px;
    }
  }
}
</style>
