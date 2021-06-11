<template>
  <div>
    <f-toast
      v-bind="toast"
      top
      :timeout="3000"
      style="top: 30px"
      @change="handleToastChange"
    />
    <f-paying-modal
      :show="paying.visible"
      :text="$t('payment.checking')"
      @cancel="handlePayingCancel"
    />
    <base-simple-message-modal />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

@Component
class DefaultLayoutModals extends Vue {
  @State((state) => state.app.toast) toast;

  @State((state) => state.app.paying) paying;

  @Mutation("app/SET_TOAST") setToast;

  @Mutation("app/SET_PAYING") setPaying;

  handleToastChange(val) {
    this.setToast({ show: val });
  }

  handlePayingCancel() {
    this.setPaying({ visible: false });
  }
}
export default DefaultLayoutModals;
</script>
