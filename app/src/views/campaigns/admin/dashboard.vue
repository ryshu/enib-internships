<template>
  <div class="dashboard-admin-container">
    <panel-group />
    <world-map />
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js'; // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator';

import PanelGroup from './components/PanelGroup.vue';
import WorldMap from './components/WorldMap.vue';

@Component({
  name: 'CampaignsAdminDashboard',
  components: {
    PanelGroup,
    WorldMap,
  },
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.dashboard-admin-container {
  padding: 50px;
  min-height: 100%;
  background-color: #f5f5f5;
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
