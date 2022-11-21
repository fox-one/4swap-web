<template>
  <div>
    <terms-modal />

    <pando-announce-modal app="4swap" :dev="dev" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TermsModal from "./TermsModal.vue";
import { Sync } from "vuex-pathify";
import { GlobalMutations } from "~/store/types";

@Component({
  components: { TermsModal },
})
class Modals extends Vue {
  @Sync("app/paying") paying!: State.PayingState;

  get dev() {
    return this.$config.BRANCH === "develop";
  }

  handlePayingCancel() {
    this.$store.commit(GlobalMutations.SET_PAYING, { visible: false });
  }
}
export default Modals;
</script>
