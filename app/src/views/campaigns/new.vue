<template>
  <div class= "action-container">
    <el-form
      ref="dataForm"
      :model="campaignData"
      label-position="left"
      label-width="175px"
      status-icon
      style="width: 100%; padding: 0 20px;"
    > 
    <h1 style="padding-bottom: 20px;">{{ $t('route.campaigns.new')}}</h1>

    <el-form-item
      :label="$t('campaign.title')"
      prop="title"
    >
      <el-input v-model="campaignData.title" :placeholder="$t('campaign.placeholder.title')" />
    </el-form-item>
    <el-form-item
        :label="$t('campaign.description')"
        prop="description"
      >
      <el-input 
        type="textarea"
        v-model="campaignData.description" 
        :placeholder="$t('campaign.placeholder.description')" 
      />
    </el-form-item>
    <el-row>
      <el-col :span="10">
        <el-form-item :label="$t('campaign.date')" prop="date">
          <el-date-picker
            v-model="campaignData.date"
            type="daterange"
            start-placeholder="Date de début"
            end-placeholder="Date de fin"
          />
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item
            :label="$t('table.campaigns.maxProposition')"
            prop="maxProposition"
          >
          <el-input v-model="campaignData.maxProposition" :placeholder="$t('campaign.placeholder.maxProposition')" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-col :span="15">  
      <el-form-item
          :label="$t('table.internships.category')"
          prop="category"
          :rules="[{ required: true, message: $t('form.internships.category.required'), trigger: 'blur' }]"
        >
          <category-select
            v-model="campaignData.category"
            :placeholder="$t('suggest.placeholder.category')"
          />
      </el-form-item>
    </el-col>
    <el-col :span="10">
      <span style="padding-left: 20px;">{{ $t('campaign.publish')}}</span>
      <el-switch
        style = "padding : 10px;"
        v-model="campaignData.isPublish"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-col>
    </el-form>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';
import {
  defaultCampaignData,
  createCampaign,
} from '../../api/campaigns';

import { UserModule } from '../../store/modules/user';

import CategorySelect from '@/components/CategorySelect/index.vue';
@Component({ name: 'CampaignsNew', components: { CategorySelect } })
export default class extends Vue {
  private campaignData: any = this.getDefaultDate();
  private countryList = countryList.getNames();

  public getDefaultDate() {
    const tmp: any = cloneDeep(defaultCampaignData);

    tmp.date = ['', ''];

    return tmp;
  } 
  private agree(){
  }
}
</script>
