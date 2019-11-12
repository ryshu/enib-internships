<template>
  <el-dialog :visible.sync="dialog" width="40%" :before-close="close">
    <div class="progress-dialog-container">
      <h2>{{ internTitle }}</h2>
      <el-progress type="circle" :percentage="internAdvancement" :color="colors" />
      <h3 v-if="internStep">{{ internStep }}</h3>

      <div class="progress-dialog-actions">
        <slot v-if="full()" name="actions-on-close">
          <el-button type="primary" @click="close">{{ $t('action.close') }}</el-button>
        </slot>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'ProgressDialog',
})
export default class ProgressDialog extends Vue {
  private internTitle: string = '';
  private internStep: string = '';
  private internAdvancement: number = 0;

  private colors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#5cb87a', percentage: 100 },
  ];

  private dialog = false;

  private full() {
    return this.internAdvancement === 100;
  }

  public close() {
    this.dialog = false;
    this.$emit('close-after-success');
  }

  public setup(title: string, step?: string) {
    this.internTitle = title;
    this.internAdvancement = 0;
    this.internStep = step || '';

    this.dialog = true;
  }

  public step(adv: number, step?: string) {
    if (adv > 100) {
      this.end(step);
      return;
    }
    this.internAdvancement = adv < 0 ? 0 : adv;
    this.internStep = step || '';
  }

  public end(success?: string) {
    this.internAdvancement = 100;
    this.internStep = success || '';
  }
}
</script>

<style lang="scss">
.progress-dialog-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  h2 {
    margin-bottom: 30px;
  }

  .progress-dialog-actions {
    margin-top: 40px;
  }
}
</style>
