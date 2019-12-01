<template>
  <el-tooltip
    v-if="internPlaceholder"
    class="item"
    effect="dark"
    :content="internPlaceholder"
    placement="top-start"
  >
    <el-button
      class="crud-btn"
      :type="internType"
      size="small"
      :icon="internIcon"
      circle
      @click="$emit('clicked')"
    />
  </el-tooltip>
  <el-button
    v-else
    :type="internType"
    size="small"
    :icon="internIcon"
    circle
    @click="$emit('clicked')"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'CrudBtn',
})
export default class extends Vue {
  @Prop({ required: false }) private placeholder?: string;
  @Prop({ default: 'success' }) private type!: string;
  @Prop({ default: 'el-icon-search' }) private icon!: string;

  private internType: string = '';
  private internIcon: string = '';
  private internPlaceholder?: string;

  created() {
    this.internType = this.type;
    this.internIcon = this.icon;
    this.internPlaceholder = this.placeholder;
  }

  @Watch('type')
  private handleType(val: string) {
    this.internType = val;
  }

  @Watch('icon')
  private handleIcon(val: string) {
    this.internIcon = val;
  }

  @Watch('placeholder')
  private handlePlaceholder(val: string) {
    this.internPlaceholder = val;
  }
}
</script>
