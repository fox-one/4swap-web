import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import dayjs from "dayjs";
import { GlobalMutations } from "~/store/types";

@Component({
  head() {
    const vm = this as any;
    const name = vm.$t("channel.name");
    const title = vm.htmlTitle || vm.title;

    return {
      title: name + " - " + title,
    };
  },
  beforeRouteEnter(_to, _from, next) {
    next((vm: any) => {
      vm.setLang();
      vm.setPageConfig();
    });
  },
})
export default class PageView extends Vue {
  get title(): any {
    return "";
  }

  get appbar() {
    return {};
  }

  get bottomNav() {
    return "";
  }

  setLang() {
    const locale = this.$utils.helper.getLocale();

    this.$i18n.locale = locale;
    this.$vuetify.lang.current = locale;

    dayjs.locale(locale);
  }

  @Watch("appbar", { deep: true })
  setPageConfig() {
    this.$store.commit(GlobalMutations.SET_BOTTOM_NAV, {
      value: this.bottomNav,
    });

    this.$store.commit(GlobalMutations.SET_APPBAR, {
      title: this.title,
      ...this.appbar,
    });
  }
}
