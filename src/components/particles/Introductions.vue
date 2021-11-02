<template>
  <div>
    <risk-introduction />

    <explain-introduction class="mt-4" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RiskIntroduction from "./RiskIntroduction.vue";
import ExplainIntroduction from "./ExplainIntroduction.vue";

@Component({
  components: {
    RiskIntroduction,
    ExplainIntroduction,
  },
})
class Introductions extends Vue {}
export default Introductions;
</script>
