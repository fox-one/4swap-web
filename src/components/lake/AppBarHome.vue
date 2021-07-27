<template>
  <f-app-bar :show="appbar.show" app custom-content>
    <v-layout justify-center align-center class="appbar--home">
      <div class="account">
        <account />
      </div>
      <products-link />
    </v-layout>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ProductsLink from "./ProductsLink.vue";
import Account from "./Account.vue";

@Component({
  components: { Account, ProductsLink },
})
class LakeAppBarHome extends Vue {
  get appbar() {
    const appbar = this.$store.state.app.appbar;

    return {
      show: appbar.show,
    };
  }
}
export default LakeAppBarHome;
</script>

<style lang="scss" scoped>
.appbar--home {
  position: relative;

  .account {
    position: absolute;
    left: 0;
  }
}
</style>
