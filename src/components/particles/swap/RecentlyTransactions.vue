<template>
  <div>
    <div class="f-greyscale-1 mb-4 f-title-1">
      {{ $t("history") }}
    </div>
    <f-panel>
      <v-expand-transition>
        <div v-if="meta.show" class="py-4">
          <div
            style="overflow: hidden"
            v-for="(item, index) in transactions"
            :key="index"
          >
            <liq-history-item :transaction="item" />
          </div>
        </div>
      </v-expand-transition>
      <div v-if="meta.empty" class="f-greyscale-3 caption my-5 text-center">
        {{ $t("transactions.empty") }}
      </div>
    </f-panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { ITransaction, IAsset, IPair } from "~/services/types/vo";
import LiqHistoryItem from "@/components/particles/liquidity/LiqHistoryItem.vue";

@Component({
  components: {
    LiqHistoryItem,
  },
})
class RecentlyTransactions extends Vue {
  @Prop() inputAsset!: IAsset | null;

  @Prop() outputAsset!: IAsset | null;

  @Prop() pair!: IPair | null;

  loading = false;

  timer: any = null;

  transactions: ITransaction[] = [];

  get base() {
    return this.inputAsset?.id;
  }

  get quote() {
    return this.outputAsset?.id;
  }

  get validPair() {
    return this.base && this.quote;
  }

  get meta() {
    let baseAsset = this.inputAsset;
    let quoteAsset = this.outputAsset;
    const base = this.inputAsset?.id;
    const quote = this.outputAsset?.id;
    const valid = this.base && this.quote;
    const show = this.transactions?.length > 0 ?? false;
    const reverse = this.transactions?.[0]?.quote_asset_id === base;
    const empty = this.transactions?.length === 0 || !this.pair;
    if (reverse) {
      [baseAsset, quoteAsset] = [quoteAsset, baseAsset];
    }
    return {
      base,
      quote,
      baseAsset,
      quoteAsset,
      valid,
      reverse,
      show,
      empty,
    };
  }

  mounted() {
    this.timer = setInterval(() => {
      this.requestTransactions({
        base: this.meta.base,
        quote: this.meta.quote,
      });
    }, 10000);
  }

  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  }

  @Watch("pair", { immediate: true, deep: true })
  handleAssetChange() {
    this.requestTransactions({ base: this.meta.base, quote: this.meta.quote });
  }

  async requestTransactions({ base, quote }) {
    if (!this.meta.valid) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getTransactions({
        base,
        quote,
        limit: 20,
        type: "swap",
      });
      if ((this.meta.base === base, this.meta.quote === quote)) {
        this.transactions = res.transactions || [];
      }
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default RecentlyTransactions;
</script>
