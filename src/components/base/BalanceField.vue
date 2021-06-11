<template>
  <div>
    <span v-if="isLogged">
      {{ $t("wallet.balance.abbr") }}
      <a class="ml-1" @click="$emit('click:balance', balance)">{{
        meta.balance
      }}</a>
      {{ symbol }}
    </span>
    <a v-else @click="handleLogin">
      {{ $t("connect.wallet") }}
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";

@Component({
  inheritAttrs: false,
})
class BalanceField extends Vue {
  @Prop() balance!: string;

  @Prop() symbol!: string;

  @Getter("auth/isLogged") isLogged;

  get meta() {
    return {
      balance: this.$utils.number.format({
        n: this.balance || "0",
        p: 8,
      }),
    };
  }

  handleLogin() {
    this.$utils.helper.requestLogin(this);
  }
}
export default BalanceField;
</script>
