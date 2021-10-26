<template>
  <div>
    <pool-item v-for="(pair, index) in meta.pairs" :key="index" :pair="pair" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GlobalGetters } from "@/store/types";
import PoolItem from "./PoolItem.vue";

@Component({
  components: {
    PoolItem,
  },
})
class PoolList extends Vue {
  get meta() {
    const pairs = this.$store.getters[GlobalGetters.ACCOUNT_PAIRS];

    return {
      pairs,
    };
  }
}
export default PoolList;
</script>
