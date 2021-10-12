<template>
  <f-app-bottom-nav
    v-if="Boolean(value)"
    :value="value"
    :items="items"
    app
    flat
    height="calc(66px + env(safe-area-inset-bottom))"
    color="primary"
    @change="handleChange"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component({})
class BottomNav extends Vue {
  @Sync("app/bottomNav@value") bottomNav!: string;

  get value() {
    return this.bottomNav || undefined;
  }

  get items() {
    return [
      {
        text: this.$t("pools"),
        icon: "$vuetify.icon.iconNavPool",
        path: "pool",
        value: "pool",
      },
      {
        text: this.$t("swap"),
        icon: "$vuetify.icon.iconNavSwap",
        path: "swap",
        value: "swap",
      },
      {
        text: this.$t("me"),
        icon: "$vuetify.icon.iconNavMe",
        path: "me",
        value: "me",
      },
    ];
  }

  handleChange(value) {
    const nav = this.items.find((x) => x.value === value);

    if (nav) {
      this.$router.push({ name: nav.path });
    }
  }
}
export default BottomNav;
</script>
