import {
  FIconChevronDown4P,
  FIconCheck,
  FIconHomeFill,
  FIconSwapFill,
  FIconPersonFill,
  FIconLakeBrand,
  FIconAdd4P,
  FIconUpRight,
  FIconUpRight4P,
  FIconSearch,
  FIconTrash,
  FIconInfo4P,
  FIconRefresh4P,
  FIconSetting,
  FIconAdd4PBold,
  FIconConvertDirection4PBold,
  FIconChevronRight4PBold,
} from "@foxone/icons";

const ficons = {
  FIconChevronDown4P: { component: FIconChevronDown4P },
  FIconCheck: { component: FIconCheck },
  FIconHomeFill: { component: FIconHomeFill },
  FIconSwapFill: { component: FIconSwapFill },
  FIconPersonFill: { component: FIconPersonFill },
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
};

const icons = [
  "IconFSwapLogo",
  "IconSwitcher",
  "IconSortAsce",
  "IconSortDesc",
  "IconSortNone",
  "IconSwitcher4P",
].reduce((m, k) => ({ ...m, [k]: { component: k } }), {});

export default {
  ...ficons,
  ...icons,
};
