import Vue from "vue";
import { Component } from "vue-property-decorator";
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
    this.$vuetify.lang.current = locale === "zh" ? "zhHans" : locale;

    dayjs.locale(locale);
  }

  setPageConfig() {
    this.$store.commit(GlobalMutations.SET_BOTTOM_NAV, {
      value: this.bottomNav,
    });

    this.$store.commit(GlobalMutations.SET_APPBAR, {
      title: this.title,
      ...this.appbar,
    });

    const defaultThemeColor = this.$vuetify.theme.dark ? "#000000" : "#ffffff";
    const color = (this.appbar as any).color || defaultThemeColor;

    setTimeout(() => {
      this.$utils.mixin.setMixinTheme(color);
    }, 200);
  }
}
