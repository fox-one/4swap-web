<template>
  <div>
    <f-list-item
      :title="$t('settings.title')"
      hide-tail
      min-height="59"
      @click="handleToSettings"
    >
      <template #head>
        <v-icon>$FIconSetting</v-icon>
      </template>
    </f-list-item>

    <f-list-item
      :title="$t('me.learn.more')"
      hide-tail
      min-height="59"
      @click="handleLearnMore"
    >
      <template #head>
        <v-icon>$FIconDocument</v-icon>
      </template>
    </f-list-item>

    <f-list-item
      :title="$t('contact.us')"
      hide-tail
      min-height="59"
      @click="handleContact"
    >
      <template #head>
        <v-icon>$FIconComment</v-icon>
      </template>
    </f-list-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PANDO_DOC } from "@/constants";

@Component
class AccountEntryActions extends Vue {
  handleToSettings() {
    this.$router.push({ name: "setting" });
  }

  handleLearnMore() {
    location.assign(PANDO_DOC);
  }

  handleContact() {
    this.$router.push({ name: "contacts" });
  }
}
export default AccountEntryActions;
</script>
