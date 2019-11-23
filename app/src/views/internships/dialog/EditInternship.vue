<template>
  <el-dialog
    :title="$t('suggest.title')"
    :before-close="cancel"
    :visible.sync="dialogFormVisible"
    width="80%"
    top="5vh"
    @keydown.esc="cancel"
  >
    <el-form
      ref="dataForm"
      :model="internData"
      label-position="left"
      label-width="150px"
      status-icon
      style="width: 100%; padding: 0 50px;"
    >
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
          :autosize="true"
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

      <h2 style="padding-bottom: 20px;">{{ $t('suggest.subTitle.settings')}}</h2>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('table.internships.publishAt')" prop="publishAt">
            <el-date-picker v-model="internData.publishAt" type="date" placeholder="Date de début" />
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
          <el-form-item :label="$t('table.internships.isInternshipAbroad')" prop="isAbroad">
            <el-switch
              v-model="internData.isAbroad"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <span style="padding-left: 10px;">{{ $t('suggest.checkbox.abroad')}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="agree">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import countryList from 'country-list';
import moment from 'moment';

import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import CategorySelect from '@/components/CategorySelect/index.vue';

import { defaultInternshipData } from '../../../api/internships';
import { IInternshipEntity } from '../../../declarations/internship';
function getData(item: IInternshipEntity) {
  const tmp: any = cloneDeep(item);
  tmp.category = tmp.category ? tmp.category.id : null;
  tmp.publishAt = tmp.publishAt ? moment(tmp.publishAt).format('LL') : '';
  tmp.date = [
    tmp.startAt ? moment(tmp.startAt).format('LL') : '',
    tmp.endAt ? moment(tmp.endAt).format('LL') : '',
  ];

  return tmp;
}

@Component({
  name: 'EditInternship',
  components: { CategorySelect },
})
export default class EditInternship extends Vue {
  private internData: any = getData(defaultInternshipData);
  private dialogFormVisible = false;
  private countryList = countryList.getNames();

  private resolve: (value?: IInternshipEntity) => void = () => {};
  private reject: (error?: any) => void = () => {};

  public created() {}

  public update(item: IInternshipEntity) {
    // Glitch to update category select
    this.internData.category = 1111111111;

    this.dialogFormVisible = true;

    this.$nextTick(() => {
      this.internData = getData(item);
      (this.$refs['dataForm'] as Form).clearValidate();
    });

    return new Promise(
      (
        resolve: (value?: IInternshipEntity) => void,
        reject: (error?: any) => void
      ) => {
        this.resolve = resolve;
        this.reject = reject;
      }
    );
  }

  private agree() {
    (this.$refs['dataForm'] as Form).validate(valid => {
      if (valid) {
        const tmp = cloneDeep(this.internData);
        tmp.startAt = tmp.date[0] ? moment(tmp.date[0]).valueOf() : 0;
        tmp.endAt = tmp.date[1] ? moment(tmp.date[1]).valueOf() : 0;
        tmp.publishAt = tmp.publishAt ? moment(tmp.publishAt).valueOf() : 0;

        this.dialogFormVisible = false;
        this.resolve(tmp);
      }
    });
  }

  private cancel() {
    this.dialogFormVisible = false;
    this.resolve();
  }
}
</script>
