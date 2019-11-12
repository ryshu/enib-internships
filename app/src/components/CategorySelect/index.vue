<template>
  <el-select v-model="selected" @change="$emit('input', selected)" :placeholder="intPlaceholder">
    <el-option v-for="item in list" :key="item.id" :label="item.label" :value="item.id" />
  </el-select>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import Pagination from '../../components/Pagination/index.vue';

import { CategoriesModule } from '../../store/modules/categories';

@Component({
  name: 'CategorySelect',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  @Prop({ required: false }) private value?: number | null;
  @Prop({ required: false, default: '' }) private placeholder?: string;

  public selected: number | null = null;

  private get list() {
    return CategoriesModule.categories;
  }

  private get total() {
    return CategoriesModule.categories.length;
  }

  private intPlaceholder: string = '';

  public created() {
    this.intPlaceholder =
      this.$props.placeholder || (this.$t('input.select.default') as string);
  }

  @Watch('value')
  private handleValue(val: number) {
    this.selected = val >= 0 ? val : null;
    this.intPlaceholder =
      this.$props.placeholder || (this.$t('input.select.default') as string);
  }

  @Watch('placeholder')
  private handlePlaceholder(str?: string) {
    this.intPlaceholder = str || (this.$t('input.select.default') as string);
  }
}
</script>
