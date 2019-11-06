<template>
  <el-dialog
    :title="textMap[dialogStatus]"
    :before-close="cancel"
    :visible.sync="dialogFormVisible"
    @keydown.esc="cancel"
  >
    <el-form
      ref="dataForm"
      :model="tempInternshipData"
      label-position="left"
      label-width="250px"
      status-icon
      style="width: 100%; padding: 0 50px;"
    >
      <el-form-item
        :label="$t('table.internships.subject')"
        prop="subject"
        :rules="[
          { required: true, message: $t('form.internships.subject.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.subject" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.description')"
        prop="description"
        :rules="[
          { required: true, message: $t('form.internships.description.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.description" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.country')"
        prop="country"
        :rules="[
          { required: true, message: $t('form.internships.country.required'), trigger: 'blur' },
        ]"
      >
        <el-select v-model="tempInternshipData.country" filterable>
          <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.city')"
        prop="city"
        :rules="[
          { required: true, message: $t('form.internships.city.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.city" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.postalCode')"
        prop="postalCode"
        :rules="[
          { required: true, message: $t('form.internships.postalCode.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.postalCode" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.address')"
        prop="address"
        :rules="[
          { required: true, message: $t('form.internships.address.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.address" />
      </el-form-item>
      <el-form-item :label="$t('table.internships.additional')" prop="additional">
        <el-input v-model="tempInternshipData.additional" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.isInternshipAbroad')"
        prop="isInternshipAbroad"
        :rules="[
          { required: true, message: $t('form.internships.isInternshipAbroad.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.isInternshipAbroad" />
      </el-form-item>
      <el-form-item
        :label="$t('table.internships.isValidated')"
        prop="isValidated"
        :rules="[
          { required: true, message: $t('form.internships.isValidated.required'), trigger: 'blur' },
        ]"
      >
        <el-input v-model="tempInternshipData.isValidated" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="agree">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';

import { defaultInternshipData } from '../../../api/internships';
import { IInternship } from '../../../api/types';
import { cloneDeep } from 'lodash';

@Component({
  name: 'EditInternship',
})
export default class EditInternship extends Vue {
  private tempInternshipData = defaultInternshipData;
  private dialogFormVisible = false;
  private countryList = countryList.getNames();
  private dialogStatus = '';
  private textMap = {};

  private resolve: (value?: IInternship) => void = () => {};
  private reject: (error?: any) => void = () => {};

  public created() {
    this.textMap = {
      update: this.$t('dialog.title.edit'),
      create: this.$t('dialog.title.create'),
    };
  }

  public update(item: IInternship) {
    this.tempInternshipData = cloneDeep(item);
    this.dialogStatus = 'update';
    return this.setup();
  }

  public create() {
    this.tempInternshipData = defaultInternshipData;
    this.dialogStatus = 'create';
    return this.setup();
  }

  private setup() {
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });

    return new Promise(
      (resolve: (value?: IInternship) => void, reject: (error?: any) => void) => {
        this.resolve = resolve;
        this.reject = reject;
      }
    );
  }

  private agree() {
    (this.$refs['dataForm'] as Form).validate(valid => {
      if (valid) {
        this.dialogFormVisible = false;
        this.resolve(this.tempInternshipData);
      }
    });
  }

  private cancel() {
    this.dialogFormVisible = false;
    this.resolve();
  }
}
</script>
