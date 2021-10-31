<template>
  <div>
    <v-layout align-center>
      <v-flex class="label-1">{{ $t("overview") }}</v-flex>
      <v-btn icon small height="24" @click="handleToOverview">
        <v-icon>$FIconUpRight</v-icon>
      </v-btn>
    </v-layout>

    <pool-overview class="mt-3" />

    <pool-list class="mt-8">
      <template #header>
        <v-layout align-center>
          <v-flex class="label-1">
            {{ $t("all.pools") }}
          </v-flex>

          <v-btn icon small height="24" @click="handleSearch">
            <v-icon>$FIconSearch</v-icon>
          </v-btn>
        </v-layout>
      </template>
    </pool-list>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import PoolOverview from "@/components/pool/Overview.vue";
import PoolList from "@/components/pool/PoolList.vue";

@Component({
  components: {
    PoolOverview,
    PoolList,
  },
})
class PoolPage extends Mixins(mixins.page) {
  get htmlTitle() {
    return this.$t("pools-mtg") as string;
  }

  get appbar() {
    return {
      show: true,
      back: false,
      style: "home",
    };
  }

  get bottomNav() {
    return "pool";
  }

  handleToOverview() {
    this.$router.push({ name: "market-overview" });
  }

  handleSearch() {
    this.$router.push({ name: "search" });
  }
}
export default PoolPage;
</script>
