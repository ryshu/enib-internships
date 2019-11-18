<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import echarts, { EChartOption } from 'echarts';
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import './world.js';

import ResizeMixin from '../../../../components/Charts/mixins/resize';

import latlong from './lat';
import countryList from 'country-list';

import { getCampaignInternships } from '../../../../api/campaigns';

@Component({
  name: 'WorldMap',
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string;
  @Prop({ default: '100%' }) private width!: string;
  @Prop({ default: '600px' }) private height!: string;

  private list: Record<string, number> = {};

  private get id() {
    return Number(this.$route.params.id);
  }

  mounted() {
    getCampaignInternships(this.id, { limit: 0 }).then(res => {
      if (res && res.data && Array.isArray(res.data)) {
        this.list = {};
        for (const d of res.data) {
          const code = countryList.getCode(d.country) || 'FR';
          this.list[code] = this.list[code] ? this.list[code] + 1 : 1;
        }
      } else {
        this.list = {};
      }

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

  private _max(key: string, max: number) {
    return this.list[key] && this.list[key] > max
      ? (max = this.list[key])
      : max;
  }

  private initChart() {
    // Setup max
    let max = -Infinity;
    Object.keys(latlong).forEach(k => (max = this._max(k, max)));

    this.chart = echarts.init(this.$el as HTMLDivElement);
    this.chart.setOption({
      backgroundColor: '#FFFFFF',
      title: {
        text: 'Répartition des stages',
        left: 'center',
        top: 'top',
        padding: 20,
        textStyle: {
          color: '#3E3E3E',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          return params.name + ' : ' + params.value[2];
        },
      },
      visualMap: {
        show: false,
        min: 0,
        max: max,
        inRange: {
          color: ['#F2A007', '#F279A6'],
          symbolSize: [1, 50],
        },
      },
      geo: {
        map: 'world',
        silent: true,
        label: {
          emphasis: { show: false, areaColor: '#eee' },
        },
        itemStyle: {
          normal: {
            borderWidth: 0.2,
            borderColor: '#404a59',
          },
        },
        roam: true,
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: this._getMapData(),
        },
      ],
    } as any);
  }

  private _getMapData() {
    return Object.keys(this.list)
      .map(k => (latlong[k] ? this._getCountrydata(k) : undefined))
      .filter(e => !!e);
  }

  private _getCountrydata(key: string) {
    return {
      name: countryList.getName(key),
      value: [
        latlong[key].longitude,
        latlong[key].latitude,
        this.list[key] || 0,
      ],
      label: {
        formatter: () => '',
        emphasis: { position: 'right', show: true },
      },
      itemStyle: { normal: { color: '#a7a737' } },
    };
  }
}
</script>
