<template>
  <v-container class="pa-0">
    <f-panel class="pa-0 no-border-radius">
      <div class="px-4">
        <v-layout justify-start align-center>
          <f-mixin-asset-logo
            :logo="meta.logo"
            :chain-logo="meta.chainLogo"
            :size="48"
            class="mr-4"
          />
          <div>
            <h2 class="f-headline">
              {{ meta.name }}
            </h2>
            <a
              v-if="meta.explorer"
              :href="meta.explorer"
              class="explorer f-caption"
            >
              <span class="text-truncate explorer-text">
                {{ meta.explorer }}
              </span>
              <v-icon size="20" class="ml-1" color="f-greyscale-3">
                {{ $icons.mdiMagnify }}
              </v-icon>
            </a>
          </div>
        </v-layout>
        <div v-if="meta.hasInfo">
          <p
            v-for="(intro, ind) of meta.intro"
            :key="ind"
            class="f-caption f-greyscale-3 mt-4 pr-1"
            style="line-height: 14px"
          >
            {{ intro }}
          </p>
        </div>

        <div v-else class="f-title-1 f-greyscale-3 text-center mt-7">
          {{
            $t("statistic.coin.no.info.with.symbol", { symbol: meta.symbol })
          }}
          <f-button
            outlined
            color="f-greyscale-2"
            class="mt-4 mb-5"
            style="border-color: #e0e0e0"
            @click="goContribute"
          >
            {{ $t("contribute") }}
          </f-button>
        </div>
      </div>

      <f-info-grid :window-size="2">
        <f-info-grid-item
          v-for="(item, ix) in pannelData"
          :key="ix"
          :index="ix"
          :title="item.title"
          :value="item.value"
          :value-unit="item.valueUnit"
          :value-custom-color="item.valueCustomColor"
          :hint="item.hint"
        />
      </f-info-grid>
    </f-panel>

    <div class="f-title-1 pl-4 pt-5 pb-4">
      {{ $t("pools") }}
    </div>

    <div class="pairs">
      <pool-pair-item
        v-for="(item, index) in pairsData"
        :key="index"
        :index="index"
        :pair="item"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { IAsset } from "~/services/types/vo";
import mixins from "@/mixins";
import PoolPairItem from "@/components/particles/pool/PoolPairItemNew.vue";
import staticData from "@/assets/intro/coin-intro";

@Component({
  components: {
    PoolPairItem,
  },
})
class CoinStatistic extends Mixins(mixins.page) {
  @Getter("global/getAssetById") getAssetById;

  @Getter("global/getPairsById") getPairsById;

  @Getter("global/getAssetsJustInPairs") assets!: IAsset[];

  loading = false;

  get pannelData() {
    const h = this.$createElement;
    return [
      {
        title: this.$t("statistic.coin.total.supply"),
        value: this.meta.total,
      },
      {
        title: this.$t("statistic.coin.market.cap"),
        value: this.meta.marketCap,
      },
      {
        title: this.$t("website"),
        value: h(
          "a",
          {
            staticClass: "text-truncate",
            staticStyle: {
              display: "inline-block",
              maxWidth: "40vw",
              color: "#0596ff",
            },
            domProps: {
              href: this.meta.website,
            },
          },
          [this.meta.website]
        ),
      },
      {
        title: this.$t("statistic.coin.issue.time"),
        value: this.meta.issueTime,
      },
      {
        title: this.$t("statistic.coin.liquidity"),
        value: this.meta.liquidity,
      },
      {
        title: this.$t("price.24hours"),
        value: this.meta.price,
      },
      {
        title: this.$t("volume.24hours"),
        value: this.meta.volume,
      },
      {
        title: this.$t("trades.24hours"),
        value: this.meta.trades,
      },
    ];
  }

  get pairsData() {
    return this.meta.pairs;
  }

  get title() {
    return this.$createElement("base-coin-switch", {
      props: {
        defaultTitle: this.meta.symbol,
        assets: this.assets,
        defaultId: this.$route.query.id,
      },
    }) as any;
  }

  get htmlTitle() {
    return this.meta.symbol;
  }

  get appbar() {
    return {
      align: "center",
    };
  }

  get meta() {
    const lang = this.$vuetify.lang.current;
    const greaterThanTrillon = this.$utils.number.greaterThanTrillon;
    const simplize = this.$utils.number.simplize;
    const format = this.$utils.number.format;
    const formatNumber = (opts: Parameters<typeof format>[0]) =>
      !opts.n
        ? "-"
        : greaterThanTrillon(opts.n)
        ? simplize(opts.n, void 0, lang)
        : format(opts);
    const simplizeFiat = this.$utils.number.simplizeFiat;

    const id = this.$route.query.id;
    const asset: API.Asset = this.getAssetById(id);
    const pairs: API.Pair[] = this.getPairsById(id) as any[];
    let symbol = asset.symbol as keyof typeof staticData;
    if ((symbol as any) === "USDT") {
      asset?.chain?.symbol === "ETH"
        ? (symbol = "USDT-ERC20")
        : (symbol = "USDT-TRC20");
    }
    const data = staticData[symbol] || {};
    const total = data.total;
    const circulation = data.circulation;
    const website = data.website ?? "-";
    const issueTime = data.issue ?? "-";
    const price = this.formatFiat(asset.price);
    const intro = data.intro?.[lang.includes("zh") ? "zh" : "en"];
    const hasInfo = intro?.length > 0;

    const [liquidity, volume, trades] = pairs.reduce(
      (prev, curr) => {
        const amount =
          curr.base_asset_id === asset.id
            ? +curr.base_amount
            : +curr.quote_amount;
        const volume = +(curr.volume_24h ?? 0);
        const count = +(curr.transaction_count_24h ?? 0);
        return [prev[0] + amount, prev[1] + volume, prev[2] + count];
      },
      [0, 0, 0]
    );

    return {
      pairs,
      website,
      issueTime,
      intro,
      price,
      hasInfo,
      name: asset.name,
      symbol: asset.symbol,
      logo: asset.logo,
      chainLogo: asset.chain.logo,
      total: formatNumber({ n: total, p: 0 }),
      marketCap: circulation
        ? simplizeFiat(this, +asset.price * +circulation)
        : "-",
      liquidity: simplizeFiat(this, liquidity * +asset.price),
      volume: simplizeFiat(this, volume),
      trades: formatNumber({ n: trades }),
      explorer: data.explorer,
    };
  }

  goContribute() {
    const url_zh = "https://jinshuju.net/f/Fp4vFj";
    const url_en = "https://forms.gle/9p3p3FVifUpZ74y8A";
    const lang = this.$vuetify.lang.current;

    window.location.href = lang === "zh" ? url_zh : url_en;
  }

  formatFiat(amountUsd, fraction = -1) {
    return this.$utils.number.formatFiat.call(this, this, amountUsd, fraction);
  }
}
export default CoinStatistic;
</script>
<style lang="scss" scoped>
.explorer {
  color: #0596ff !important;
  &-text {
    display: inline-block;
    vertical-align: middle;
    max-width: 60vw;
  }
}
</style>
