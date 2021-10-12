import { FIconChevronDown4P, FIconLakeBrand, FIconCheck } from "@foxone/icons";

const ficons = [
  { FIconChevronDown4P: { component: FIconChevronDown4P } },
  { FIconLakeBrand: { component: FIconLakeBrand } },
  { FIconCheck: { component: FIconCheck } },
];

const icons = ["IconFSwapLogo"].reduce(
  (m, k) => ({ ...m, [k]: { component: k } }),
  {}
);

export default {
  ...ficons,
  ...icons,
};
