import FIconChevronDown4P from "@foxone/icons/FIconChevronDown4P";
import FIconCheck from "@foxone/icons/FIconCheck";
import FIconHomeFill from "@foxone/icons/FIconHomeFill";
import FIconSwapFill from "@foxone/icons/FIconSwapFill";
import FIconPersonAFill from "@foxone/icons/FIconPersonAFill";
import FIconLakeBrand from "@foxone/icons/FIconLakeBrand";
import FIconAdd4P from "@foxone/icons/FIconAdd4P";
import FIconUpRight from "@foxone/icons/FIconUpRight";
import FIconUpRight4P from "@foxone/icons/FIconUpRight4P";
import FIconSearch from "@foxone/icons/FIconSearch";
import FIconTrash from "@foxone/icons/FIconTrash";
import FIconInfo4P from "@foxone/icons/FIconInfo4P";
import FIconRefresh4P from "@foxone/icons/FIconRefresh4P";
import FIconSetting from "@foxone/icons/FIconSetting";
import FIconAdd4PBold from "@foxone/icons/FIconAdd4PBold";
import FIconConvertDirection4PBold from "@foxone/icons/FIconConvertDirection4PBold";
import FIconChevronRight4PBold from "@foxone/icons/FIconChevronRight4PBold";
import FIconMinusBold from "@foxone/icons/FIconMinusBold";
import FIconAddBold from "@foxone/icons/FIconAddBold";
import FIconSettingFill from "@foxone/icons/FIconSettingFill";
import FIconDocument from "@foxone/icons/FIconDocument";
import FIconExchange4P from "@foxone/icons/FIconExchange4P";
import FIconMax4P from "@foxone/icons/FIconMax4P";
import FIconMin4P from "@foxone/icons/FIconMin4P";
import FIconLink4P from "@foxone/icons/FIconLink4P";
import FIconWarningFill from "@foxone/icons/FIconWarningFill";
import FIconChevronRight4P from "@foxone/icons/FIconChevronRight4P";
import FIconArrowRight4P from "@foxone/icons/FIconArrowRight4P";
import FIconPoolAFill from "@foxone/icons/FIconPoolAFill";
import FIconComment from "@foxone/icons/FIconComment";
import FIconMinus4PBold from "@foxone/icons/FIconMinus4PBold";

const ficons = {
  FIconChevronDown4P: { component: FIconChevronDown4P },
  FIconCheck: { component: FIconCheck },
  FIconHomeFill: { component: FIconHomeFill },
  FIconSwapFill: { component: FIconSwapFill },
  FIconPersonAFill: { component: FIconPersonAFill },
  FIconLakeBrand: { component: FIconLakeBrand },
  FIconAdd4P: { component: FIconAdd4P },
  FIconUpRight: { component: FIconUpRight },
  FIconSearch: { component: FIconSearch },
  FIconTrash: { component: FIconTrash },
  FIconInfo4P: { component: FIconInfo4P },
  FIconRefresh4P: { component: FIconRefresh4P },
  FIconSetting: { component: FIconSetting },
  FIconConvertDirection4PBold: { component: FIconConvertDirection4PBold },
  FIconChevronRight4PBold: { component: FIconChevronRight4PBold },
  FIconUpRight4P: { component: FIconUpRight4P },
  FIconAdd4PBold: { component: FIconAdd4PBold },
  FIconMinusBold: { component: FIconMinusBold },
  FIconAddBold: { component: FIconAddBold },
  FIconSettingFill: { component: FIconSettingFill },
  FIconDocument: { component: FIconDocument },
  FIconExchange4P: { component: FIconExchange4P },
  FIconMax4P: { component: FIconMax4P },
  FIconMin4P: { component: FIconMin4P },
  FIconLink4P: { component: FIconLink4P },
  FIconWarningFill: { component: FIconWarningFill },
  FIconChevronRight4P: { component: FIconChevronRight4P },
  FIconPoolAFill: { component: FIconPoolAFill },
  FIconComment: { component: FIconComment },
  FIconArrowRight4P: { component: FIconArrowRight4P },
  FIconMinus4PBold: { component: FIconMinus4PBold },
};

const icons = [
  "IconFSwapLogo",
  "IconSwitcher",
  "IconSortAsce",
  "IconSortDesc",
  "IconSortNone",
  "IconSwitcher4P",
  "IconSchemeA",
  "IconSchemeB",
  "IconUpPolygon",
  "IconDownPolygon",
  "IconCheck",
  "IconTick",
  "IconPolygon",
].reduce((m, k) => ({ ...m, [k]: { component: k } }), {});

export default {
  ...ficons,
  ...icons,
};
