<template>
  <div>
    <f-paying-modal
      :show="paying.visible"
      :text="$t('payment.checking')"
      @cancel="handlePayingCancel"
    />

    <payment-modal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PaymentModal from "./PaymentModal.vue";
import { Sync } from "vuex-pathify";
import { GlobalMutations } from "~/store/types";

@Component({
  components: {
    PaymentModal,
  },
})
class Modals extends Vue {
  @Sync("app/paying") paying!: State.PayingState;

  handlePayingCancel() {
    this.$store.commit(GlobalMutations.SET_PAYING, { visible: false });
  }
}
export default Modals;
</script>
