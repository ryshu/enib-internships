<template>
  <div class="errPage-container">
    <error-a />
    <error-b />
    <h3>{{ $t('errorLog.tips') }}</h3>
    <aside>
      {{ $t('errorLog.description') }}
      <a
        target="_blank"
        class="link-type"
        href="https://armour.github.io/vue-typescript-admin-docs/guide/advanced/error.html"
        rel="noopener noreferrer"
      >{{ $t('errorLog.documentation') }}</a>
    </aside>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import ErrorA from './components/ErrorTestA.vue';
import ErrorB from './components/ErrorTestB.vue';

@Component({
  name: 'ErrorLog',
  components: {
    ErrorA,
    ErrorB,
  },
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.errPage-container {
  padding: 30px;
}
</style>
