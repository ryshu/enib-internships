<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { CampaignsModule } from './store/modules/campaigns';
import { CategoriesModule } from './store/modules/categories';

@Component({
  name: 'App',
})
export default class extends Vue {
  created() {
    CampaignsModule.setup();
    CategoriesModule.setup();
  }
}
</script>
