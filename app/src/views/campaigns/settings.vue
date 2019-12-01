<template>
  <div class="action-container">
    <el-form
      ref="dataForm"
      :model="tempData"
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
          v-model="tempData.name"
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
          v-model="tempData.description"
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
              v-model="tempData.isPublish"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('table.campaigns.date')"
            prop="endAt"
            :rules="[
              { required: true, message: $t('form.campaigns.date.required') },
              { validator: dateValidator, trigger: 'blur' },
            ]"
          >
            <el-date-picker
              v-model="tempData.endAt"
              placeholder="Date de fin"
              type="date"
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
              v-model="tempData.maxProposition"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="dialog-footer">
        <el-button type="danger" @click="archive">{{ $t('table.archive') }}</el-button>
        <el-button @click="reset">{{ $t('table.reset') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-form>

    <progress-dialog ref="ProgressDialog" @close-after-success="reset" />
  </div>
</template>
<script lang="ts">

import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { cloneDeep } from 'lodash';
import { Form } from 'element-ui';

import { defaultCampaignData, createCampaign, deleteCampaign, getCampaign, updateCampaign } from '../../api/campaigns';
import CategorySelect from '@/components/CategorySelect/index.vue';
import ProgressDialog from '@/components/ProgressDialog/index.vue';
import { CampaignsModule } from '../../store/modules/campaigns';


@Component({ 
  name: 'CampaignsSettings' ,
  components: { ProgressDialog, CategorySelect },
})

export default class extends Vue {
  private tempData: any = defaultCampaignData; 
  
  private cnt: number = 0;
  private max: number = 1;
 
  public get id() {
    return Number(this.$route.params.id);
  }

  public created() {
    this.$nextTick(() => {
      this.setupCampaign();
    });
  }

  @Watch('id')
  public async setupCampaign() {
    let tmp: any;
    if(this.id) {
      tmp = await CampaignsModule.getCampaign(this.id);
    }
    tmp = cloneDeep(tmp || defaultCampaignData);

    this.tempData = tmp;
  }

  private updateData() {
     (this.$refs['dataForm'] as Form).validate(async valid => {
       if (valid) {
         const temp = Object.assign({}, this.tempData);

         temp.endAt= moment(temp.endAt).valueOf();
         delete temp.startAt;

         await updateCampaign(temp.id!, temp);
        this.$notify({
          title: this.$t('notify.campaigns.update.title') as string,
          message: this.$t('notify.campaigns.update.msg') as string,
          type: 'success',
          duration: 2000,
        });
        this.$router.push(`/campaigns/dashboard/${this.id}`); 
      }
   });
  }
  private async archive(){
    // const res: any= await getCampaign(this.id, []); 
    // CampaignsModule.removeCampaign(res);
    await deleteCampaign(this.id!);
  
    this.$notify({
      title: this.$t('notify.campaigns.delete.title') as string,
      message: this.$t('notify.campaigns.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }
  private reset() {
    this.setupCampaign();

    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  public dateValidator(rule: any, value: any, cb: any) {
    
      if (!this.tempData.endAt) {
        cb(new Error(this.$t('form.campaigns.date.required') as string));
      } else if (
        moment(this.tempData.endAt).valueOf() < moment().valueOf()
      ) {
        cb(new Error(this.$t('form.campaigns.date.end_to_early') as string));
      } else {
        cb();
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
