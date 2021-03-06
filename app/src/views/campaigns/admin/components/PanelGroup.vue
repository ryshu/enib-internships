<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon name="peoples" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Etudiants</div>
          <count-to
            :start-val="0"
            :end-val="stats.students"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon name="education" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Stages disponnibles</div>
          <count-to
            :start-val="0"
            :end-val="stats.internships.availables"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon name="skill" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Stages attribués</div>
          <count-to
            :start-val="0"
            :end-val="stats.internships.attributed"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon name="international" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Professeurs</div>
          <count-to
            :start-val="0"
            :end-val="stats.mentors"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CountTo from 'vue-count-to';

import {
  getCampaignStatistics,
  getDefaultCampaignStats,
} from '../../../../api/statistics';
import { CampaignStatistics } from '../../../../declarations';

@Component({
  name: 'PanelGroup',
  components: {
    CountTo,
  },
})
export default class extends Vue {
  stats: CampaignStatistics = getDefaultCampaignStats();

  created() {
    this.getStat();
  }

  private get id() {
    return Number(this.$route.params.id);
  }

  @Watch('id')
  public handleRouteChange() {
    if (this.id) {
      this.getStat();
    }
  }

  public getStat() {
    this.stats = getDefaultCampaignStats();
    getCampaignStatistics(this.id).then(res => {
      if (res) {
        this.stats = res as any;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #f279a6;
      }

      .icon-message {
        background: #acdde7;
      }

      .icon-money {
        background: #d93814;
      }

      .icon-shopping {
        background: #f2a007;
      }
    }

    .icon-people {
      color: #f279a6;
    }

    .icon-message {
      color: #acdde7;
    }

    .icon-money {
      color: #d93814;
    }

    .icon-shopping {
      color: #f2a007;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
