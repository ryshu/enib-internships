<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="internData"
      label-position="left"
      label-width="175px"
      status-icon
      style="width: 100%; padding: 0 20px;"
    >
      <h1 style="padding-bottom: 20px;">{{ $t('suggest.title')}}</h1>

      <h2 style="padding-bottom: 20px;">{{ $t('suggest.subTitle.description')}}</h2>

      <el-form-item
        :label="$t('table.internships.subject')"
        prop="subject"
        :rules="[{ required: true, message: $t('form.internships.subject.required'), trigger: 'blur' }]"
      >
        <el-input v-model="internData.subject" :placeholder="$t('suggest.placeholder.subject')" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.description')"
        prop="description"
        :rules="[{ required: true, message: $t('form.internships.description.required'), trigger: 'blur' }]"
      >
        <el-input
          type="textarea"
          v-model="internData.description"
          :placeholder="$t('suggest.placeholder.description')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('table.internships.category')"
        prop="category"
        :rules="[{ required: true, message: $t('form.internships.category.required'), trigger: 'blur' }]"
      >
        <category-select
          v-model="internData.category"
          :placeholder="$t('suggest.placeholder.category')"
        />
      </el-form-item>

      <el-row v-if="role !== 'admin'" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('table.internships.date')" prop="date">
            <el-date-picker
              v-model="internData.date"
              type="daterange"
              start-placeholder="Date de début"
              end-placeholder="Date de fin"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :label="$t('table.internships.isInternshipAbroad')"
            prop="isInternshipAbroad"
          >
            <el-switch
              v-model="internData.isInternshipAbroad"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <span style="padding-left: 10px;">{{ $t('suggest.checkbox.abroad')}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <h2 style="padding-bottom: 20px;">{{ $t('suggest.subTitle.location')}}</h2>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('table.internships.country')"
            prop="country"
            :rules="[{ required: true, message: $t('form.internships.country.required'), trigger: 'blur' }]"
          >
            <el-select v-model="internData.country" filterable>
              <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('table.internships.city')"
            prop="city"
            :rules="[{ required: true, message: $t('form.internships.city.required'), trigger: 'blur' }]"
          >
            <el-input v-model="internData.city" :placeholder="$t('suggest.placeholder.city')" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('table.internships.postalCode')"
            prop="postalCode"
            :rules="[{ required: true, message: $t('form.internships.postalCode.required'), trigger: 'blur' }]"
          >
            <el-input
              v-model="internData.postalCode"
              :placeholder="$t('suggest.placeholder.postalCode')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('table.internships.address')"
            prop="address"
            :rules="[{ required: true, message: $t('form.internships.address.required'), trigger: 'blur' }]"
          >
            <el-input
              v-model="internData.address"
              :placeholder="$t('suggest.placeholder.address')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('table.internships.additionalbis')" prop="additional">
            <el-input
              v-model="internData.additional"
              :placeholder="$t('suggest.placeholder.additonal')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="role === 'admin'">
        <h2 style="padding-bottom: 20px;">{{ $t('suggest.subTitle.settings')}}</h2>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('table.internships.publishAt')" prop="publishAt">
              <el-date-picker
                v-model="internData.publishAt"
                type="date"
                placeholder="Date de début"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.internships.date')" prop="date">
              <el-date-picker
                v-model="internData.date"
                type="daterange"
                start-placeholder="Date de début"
                end-placeholder="Date de fin"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('table.internships.isPublish')" prop="isPublish">
              <el-switch
                v-model="internData.isPublish"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <span style="padding-left: 10px;">{{ $t('suggest.checkbox.publish')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.internships.isValidated')" prop="isValidated">
              <el-switch
                v-model="internData.isValidated"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <span style="padding-left: 10px;">{{ $t('suggest.checkbox.abroad')}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-form-item
        v-if="role === 'admin'"
        :label="$t('table.internships.isProposition')"
        prop="isProposition"
      >
        <el-switch
          v-model="internData.isProposition"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
        <span style="padding-left: 10px;">{{ $t('suggest.checkbox.proposition')}}</span>
      </el-form-item>

      <h2 style="padding-bottom: 20px;">{{ $t('suggest.files.title')}}</h2>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('suggest.files.offer')">
            <label class="file">
              <input
                type="file"
                id="file"
                ref="offerInput"
                @change="offerDrop"
                accept="application/pdf"
              />
              <span
                class="file-custom"
              >{{ offerDefined ? offer.name : $t('input.file.placeholder') }}</span>
              <span class="file-custom-btn">{{ $t('input.file.btn') }}</span>
            </label>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('suggest.files.business')">
            <label class="file">
              <input
                type="file"
                id="file"
                ref="presInput"
                @change="presDrop"
                accept="application/pdf"
              />
              <span class="file-custom">{{ presDefined ? pres.name : $t('input.file.placeholder') }}</span>
              <span class="file-custom-btn">{{ $t('input.file.btn') }}</span>
            </label>
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
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import {
  defaultInternshipData,
  createInternship,
  linkInternshipFile,
} from '../../api/internships';
import { IInternship } from '../../api/types';
import { sendFile } from '../../api/files';

import CategorySelect from '@/components/CategorySelect/index.vue';
import ProgressDialog from '@/components/ProgressDialog/index.vue';

import { UserModule } from '../../store/modules/user';

@Component({
  name: 'EditInternship',
  components: { ProgressDialog, CategorySelect },
})
export default class EditInternship extends Vue {
  private internData: any = this.getDefaultData();
  private countryList = countryList.getNames();

  private pres?: File = undefined;
  private offer?: File = undefined;
  public offerDefined = false;
  private presDefined = false;

  public get id() {
    return this.$route.params.id;
  }

  private get role() {
    return UserModule.role;
  }

  public getDefaultData() {
    const tmp: any = cloneDeep(defaultInternshipData);
    tmp.isProposition = this.role === 'admin';

    tmp.date = ['', ''];
    tmp.publishAt = '';

    return tmp;
  }

  public reset() {
    this.internData = this.getDefaultData();

    this.presDefined = false;
    this.pres = undefined;
    this.offerDefined = false;
    this.offer = undefined;

    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  public created() {
    this.reset();
  }

  private agree() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        let businessDescription, internshipDescription;
        (this.$refs.ProgressDialog as any).setup(
          this.$t('suggest.progress.title'),
          this.$t('suggest.progress.step_1')
        );

        const tmp = cloneDeep(this.internData);
        tmp.startAt = tmp.date[0] ? moment(tmp.date[0]).valueOf() : 0;
        tmp.endAt = tmp.date[1] ? moment(tmp.date[1]).valueOf() : 0;
        delete tmp.date;
        tmp.publishAt = tmp.publishAt ? moment(tmp.publishAt).valueOf() : 0;

        const internships = (await createInternship(tmp)) as any;

        (this.$refs.ProgressDialog as any).step(
          50,
          this.$t('suggest.progress.step_2')
        );

        if (this.pres) {
          businessDescription = (await sendFile(
            this.pres,
            this.internData.subject,
            'bus-desc'
          )) as any;
          await linkInternshipFile(internships.id, businessDescription.id);
        }

        (this.$refs.ProgressDialog as any).step(
          80,
          this.$t('suggest.progress.step_3')
        );

        if (this.offer) {
          internshipDescription = (await sendFile(
            this.offer,
            this.internData.subject,
            'int-desc'
          )) as any;
          await linkInternshipFile(internships.id, internshipDescription.id);
        }

        (this.$refs.ProgressDialog as any).end(
          this.$t('suggest.progress.success')
        );
      }
    });
  }

  public offerDrop() {
    this.offer = ((this.$refs.offerInput as any).files as FileList)[0];
    this.offerDefined = true;
  }

  public presDrop() {
    this.pres = ((this.$refs.presInput as any).files as FileList)[0];
    this.presDefined = true;
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
