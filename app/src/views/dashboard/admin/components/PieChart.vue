<template>
  <div
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts';
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import ResizeMixin from '../../../../components/Charts/mixins/resize';

@Component({
  name: 'PieChart',
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string;
  @Prop({ default: '100%' }) private width!: string;
  @Prop({ default: '300px' }) private height!: string;

  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons');
    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
      },
      series: [
        {
          name: 'Par matière',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: [
            {
              value: 320,
              name: 'Informatique',
              itemStyle: { color: '#F28907' },
            },
            {
              value: 240,
              name: 'Electronique',
              itemStyle: { color: '#F279A6' },
            },
            {
              value: 149,
              name: 'Mecatronique',
              itemStyle: { color: '#D93814' },
            },
          ],
          animationEasing: 'cubicInOut',
          animationDuration: 2600,
        },
      ],
    } as EChartOption<EChartOption.SeriesPie>);
  }
}
</script>
