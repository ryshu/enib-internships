<template>
  <el-dialog
    :title="textMap[dialogStatus]"
    :before-close="cancel"
    :visible.sync="dialogFormVisible"
    @keydown.esc="cancel"
  >
    <el-form
      ref="dataForm"
      :model="tempBusinessData"
      label-position="left"
      label-width="250px"
      status-icon
      style="width: 100%; padding: 0 50px;"
    >
      <el-form-item
        :label="$t('table.businesses.name')"
        prop="name"
        :rules="[
            { required: true, message: $t('form.businesses.name.required'), trigger: 'blur' },
          ]"
      >
        <el-input v-model="tempBusinessData.name" />
      </el-form-item>
      <el-form-item
        :label="$t('table.businesses.country')"
        prop="country"
        :rules="[
            { required: true, message: $t('form.businesses.country.required'), trigger: 'blur' },
          ]"
      >
        <el-select v-model="tempBusinessData.country" filterable>
          <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('table.businesses.city')"
        prop="city"
        :rules="[
            { required: true, message: $t('form.businesses.city.required'), trigger: 'blur' },
          ]"
      >
        <el-input v-model="tempBusinessData.city" />
      </el-form-item>
      <el-form-item
        :label="$t('table.businesses.postalCode')"
        prop="postalCode"
        :rules="[
            { required: true, message: $t('form.businesses.postalCode.required'), trigger: 'blur' },
          ]"
      >
        <el-input v-model="tempBusinessData.postalCode" />
      </el-form-item>
      <el-form-item
        :label="$t('table.businesses.address')"
        prop="address"
        :rules="[
            { required: true, message: $t('form.businesses.address.required'), trigger: 'blur' },
          ]"
      >
        <el-input v-model="tempBusinessData.address" />
      </el-form-item>
      <el-form-item :label="$t('table.businesses.additional')" prop="additional">
        <el-input v-model="tempBusinessData.additional" />
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

import { defaultBusinessData } from '../../../api/businesses';
import { IBusiness } from '../../../api/types';
import { cloneDeep } from 'lodash';

@Component({
  name: 'EditBusiness',
})
export default class EditBusiness extends Vue {
  private tempBusinessData = defaultBusinessData;
  private dialogFormVisible = false;
  private countryList = countryList.getNames();
  private dialogStatus = '';
  private textMap = {};

  private resolve: (value?: IBusiness) => void = () => {};
  private reject: (error?: any) => void = () => {};

  public created() {
    this.textMap = {
      update: this.$t('dialog.title.edit'),
      create: this.$t('dialog.title.create'),
    };
  }

  public update(item: IBusiness) {
    this.tempBusinessData = cloneDeep(item);
    this.dialogStatus = 'update';
    return this.setup();
  }

  public create() {
    this.tempBusinessData = defaultBusinessData;
    this.dialogStatus = 'create';
    return this.setup();
  }

  private setup() {
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });

    return new Promise(
      (resolve: (value?: IBusiness) => void, reject: (error?: any) => void) => {
        this.resolve = resolve;
        this.reject = reject;
      }
    );
  }

  private agree() {
    (this.$refs['dataForm'] as Form).validate(valid => {
      if (valid) {
        this.dialogFormVisible = false;
        this.resolve(this.tempBusinessData);
      }
    });
  }

  private cancel() {
    this.dialogFormVisible = false;
    this.resolve();
  }
}
</script>
