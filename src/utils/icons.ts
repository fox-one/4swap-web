import {
  FIconChevronDown4P,
  FIconCheck,
  FIconHomeFill,
  FIconSwapFill,
  FIconPersonFill,
  FIconLakeBrand,
  FIconAdd4P,
  FIconUpRight,
  FIconSearch,
  FIconTrash,
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
};

const icons = [
  "IconFSwapLogo",
  "IconSwitcher",
  "IconSortAsce",
  "IconSortDesc",
  "IconSortNone",
].reduce((m, k) => ({ ...m, [k]: { component: k } }), {});

export default {
  ...ficons,
  ...icons,
};
