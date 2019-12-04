<template>
  <div class="action-container">
    <el-form
      ref="dataForm"
      :model="campaignData"
      label-position="left"
      label-width="200px"
      status-icon
      style="width: 100%; padding: 0 20px;"
    >
      <h1 style="padding-bottom: 20px;">{{ $t('route.campaigns.new') }}</h1>

      <h2>Description</h2>

      <el-form-item
        :label="$t('table.campaigns.name')"
        prop="name"
        :rules="[{ required: true, message: $t('form.campaigns.name.required'), trigger: 'blur' }]"
      >
        <el-input v-model="campaignData.name" :placeholder="$t('campaigns.placeholder.name')" />
      </el-form-item>
      <el-form-item
        :label="$t('table.campaigns.description')"
        prop="description"
        :rules="[{ required: true, message: $t('form.campaigns.description.required'), trigger: 'blur' }]"
      >
        <el-input
          type="textarea"
          v-model="campaignData.description"
          :placeholder="$t('campaigns.placeholder.description')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.campaigns.category')"
        prop="category.id"
        :rules="[{ required: true, message: $t('form.campaigns.category.required'), trigger: 'blur' }]"
      >
        <category-select
          v-model="campaignData.category.id"
          :placeholder="$t('campaigns.placeholder.category')"
        />
      </el-form-item>

      <h2>Paramètres</h2>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('table.campaigns.isPublish')" prop="maxProposition">
            <el-switch
              style="padding : 10px;"
              v-model="campaignData.isPublish"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <span style="padding-left: 20px;">{{ $t('campaigns.checkbox.isPublish') }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('table.campaigns.date')"
            prop="date"
            :rules="[
              { required: true, message: $t('form.campaigns.date.required') },
              { validator: dateValidator, trigger: 'blur' },
            ]"
          >
            <el-date-picker
              :class="campaignData.isPublish ? '' : 'hidden'"
              v-model="campaignData.endAt"
              placeholder="Date de fin"
              type="date"
              @change="handlePublishSwitch('date')"
            />
            <el-date-picker
              :class="campaignData.isPublish ? 'hidden' : ''"
              v-model="campaignData.date"
              type="daterange"
              start-placeholder="Date de début"
              end-placeholder="Date de fin"
              @change="handlePublishSwitch('daterange')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('table.campaigns.maxProposition')" prop="maxProposition">
            <el-input-number :min="0" :max="50" v-model="campaignData.maxProposition" />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="dialog-footer">
        <el-button @click="reset">{{ $t('table.reset') }}</el-button>
        <el-button type="primary" @click="agree">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-form>

    <progress-dialog ref="ProgressDialog" @close-after-success="reset" />
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import { defaultCampaignData, createCampaign } from '../../api/campaigns';

import { UserModule } from '../../store/modules/user';

import CategorySelect from '@/components/CategorySelect/index.vue';
import ProgressDialog from '@/components/ProgressDialog/index.vue';
import { CampaignsModule } from '../../store/modules/campaigns';

enum MessageType {
  INITIALIZED = 1,
  PROCESSING = 2,
  STOP = 3,
}

@Component({
  name: 'CampaignsNew',
  components: { ProgressDialog, CategorySelect },
})
export default class extends Vue {
  private campaignData: any = this.getDefaultData();
  private countryList = countryList.getNames();

  private cnt: number = 0;
  private max: number = 1;

  public getDefaultData() {
    const tmp: any = cloneDeep(defaultCampaignData);

    tmp.endAt = '';
    tmp.date = ['', ''];

    tmp.category = { id: null };

    return tmp;
  }

  private reset() {
    this.campaignData = this.getDefaultData();
    this.cnt = 0;
    this.max = 1;

    // @deprecated
    CampaignsModule.setup();

    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private handlePublishSwitch(from: string) {
    if (from === 'date') {
      this.campaignData.date = [
        this.campaignData.date[0],
        this.campaignData.endAt,
      ];
    } else {
      this.campaignData.endAt = this.campaignData.date[1];
    }
  }

  @Socket('campaign_create_start')
  private socketStart(payload: any) {
    this.cnt = 0;
    this.max = payload.todo;
  }

  @Socket('campaign_create_step')
  private socketStep(payload: any) {
    this.cnt++;
    (this.$refs.ProgressDialog as any).step(
      Math.round(((this.cnt / this.max) * 80 + 20) * 100) / 100,
      `${this.$t('campaigns.progress.processing')}: ${payload.msg} - ${
        this.cnt
      }/${this.max}`
    );
  }

  @Socket('campaign_create_end')
  private socketStop() {
    (this.$refs.ProgressDialog as any).end(
      this.$t('campaigns.progress.success')
    );
  }

  @Socket('campaign_create_error')
  private socketError() {
    (this.$refs.ProgressDialog as any).end(this.$t('campaigns.progress.error'));
  }

  private async agree() {
    const valid = await (this.$refs['dataForm'] as Form).validate();
    if (valid) {
      const tmp = cloneDeep(this.campaignData);
      (this.$refs.ProgressDialog as any).setup(
        this.$t('campaigns.progress.title'),
        this.$t('campaigns.progress.step_1')
      );

      if (tmp.isPublish) {
        tmp.startAt = 0;
        tmp.endAt = moment(tmp.endAt).valueOf();
      } else {
        tmp.startAt = moment(tmp.date[0]).valueOf();
        tmp.endAt = moment(tmp.date[1]).valueOf();
      }
      delete tmp.data;

      const res: any = await createCampaign(tmp);

      if (tmp.status && tmp.status === 202) {
        // API is processing new campaign creation, wait for it under websocket
        this.cnt = 0;
        this.max = 1;
      } else {
        // API doesn't have to publish campaign, all is fine
        (this.$refs.ProgressDialog as any).end(
          this.$t('campaigns.progress.success')
        );
        CampaignsModule.addCampaign(res);
      }
    }
  }

  public dateValidator(rule: any, value: any, cb: any) {
    if (this.campaignData.isPublish) {
      if (!this.campaignData.endAt) {
        cb(new Error(this.$t('form.campaigns.date.required') as string));
      } else if (
        moment(this.campaignData.endAt).valueOf() < moment().valueOf()
      ) {
        cb(new Error(this.$t('form.campaigns.date.end_to_early') as string));
      } else {
        cb();
      }
    } else {
      if (!this.campaignData.date[0] || !this.campaignData.date[1]) {
        cb(new Error(this.$t('form.campaigns.date.required') as string));
      } else if (
        moment(this.campaignData.date[0]).valueOf() < moment().valueOf()
      ) {
        cb(new Error(this.$t('form.campaigns.date.start_to_early') as string));
      } else {
        cb();
      }
    }
  }
}
</script>

<style lang="scss">
.dialog-footer {
  width: 100%;
  padding: 75px;
  display: flex;
  justify-content: center;
  button {
    margin: 0 20px;
  }
}
</style>
