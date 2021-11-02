export function getColor(vm: Vue, value) {
  const scheme = vm.$store.state.app.settings.chartScheme;

  const red = vm.$vuetify.theme.currentTheme.error;
  const green = vm.$vuetify.theme.currentTheme.success;
  const grey = vm.$vuetify.theme.currentTheme.greyscale_3;

  let [up, down] = [green, red];

  if (scheme === "SCHEME_B") {
    [up, down] = [down, up];
  }

  return +value > 0 ? up : +value < 0 ? down : grey;
}
