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
      <h1 style="padding-bottom: 20px;">{{ $t('route.campaigns.modify') }}</h1>

      <h2>Description</h2>

      <el-form-item
        :label="$t('table.campaigns.name')"
        prop="name"
        :rules="[
          {
            required: true,
            message: $t('form.campaigns.name.required'),
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model='coucou'
          :placeholder="$t('campaigns.placeholder.name')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.campaigns.description')"
        prop="description"
        :rules="[
          {
            required: true,
            message: $t('form.campaigns.description.required'),
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          type="textarea"
          v-model="campaignData.description"
          :placeholder="$t('campaigns.placeholder.description')"
        />
      </el-form-item>
      
      <h2>Paramètres</h2>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('table.campaigns.isVisible')"
            prop="maxProposition"
          >
            <el-switch
              style="padding : 10px;"
              v-model="campaignData.isPublish"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
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
          <el-form-item
            :label="$t('table.campaigns.maxProposition')"
            prop="maxProposition"
          >
            <el-input-number
              :min="0"
              :max="50"
              v-model="campaignData.maxProposition"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="dialog-delete">
            <el-button type="danger" @click="delCampaign">{{ $t('table.delete') }}</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="dialog-footer">
        <el-button @click="reset">{{ $t('table.reset') }}</el-button>
        <el-button type="primary" @click="agree">{{
          $t('table.confirm')
        }}</el-button>
        
      </div>
    </el-form>

    <progress-dialog ref="ProgressDialog" @close-after-success="reset" />
  </div>
</template>
 
<script lang="ts">

import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { cloneDeep } from 'lodash';
import { Form } from 'element-ui';

import { defaultCampaignData, createCampaign, deleteCampaign, getCampaign } from '../../api/campaigns';
import CategorySelect from '@/components/CategorySelect/index.vue';
import ProgressDialog from '@/components/ProgressDialog/index.vue';
import { CampaignsModule } from '../../store/modules/campaigns';


@Component({ 
  name: 'CampaignsSettings' ,
  components: { ProgressDialog, CategorySelect },
})

export default class extends Vue {
  private campaignData: any = this.getDefaultData();

  private cnt: number = 0;
  private max: number = 1;

  public getId() {
    return Number(this.$route.params.id);
  }

  public getDefaultData() {
    const tmp: any = cloneDeep(defaultCampaignData);

    tmp.endAt = '';
    tmp.date = ['', ''];

    tmp.category_id = null;

    return tmp;
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
      if (tmp.isPublish) {
        this.cnt = 0;
        this.max = 1;
      } else {
        (this.$refs.ProgressDialog as any).end(
          this.$t('campaigns.progress.success')
        );
        CampaignsModule.addCampaign(res);
      }
    }
  }
  private async delCampaign(){
    const res: any= await getCampaign(this.getId(), []); 
    CampaignsModule.removeCampaign(res);
    await deleteCampaign(this.getId()!);
   
    this.$notify({
      title: this.$t('notify.campaigns.delete.title') as string,
      message: this.$t('notify.campaigns.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
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
.dialog-delete {
  width : 100%; 
  display: flex; 
  justify-content: right;
  button {
    margin : 0 20px;
  }
}
</style>
