<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.businesses.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        style="margin-left: 10px;"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
    </div>

    <!-- Table -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.businesses.name')" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.businesses.country')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.businesses.city')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.businesses.postalCode')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.postalCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="330"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >{{ $t('table.edit') }}</el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-remove"
            @click="handleDelete(row, 'deleted')"
          >{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempBusinessData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.businesses.name')" prop="name">
          <el-input v-model="tempBusinessData.name" />
        </el-form-item>
        <el-form-item :label="$t('table.businesses.country')" prop="country">
          <el-input v-model="tempBusinessData.country" />
        </el-form-item>
        <el-form-item :label="$t('table.businesses.city')" prop="city">
          <el-input v-model="tempBusinessData.city" />
        </el-form-item>
        <el-form-item :label="$t('table.businesses.postalCode')" prop="postalCode">
          <el-input v-model="tempBusinessData.postalCode" />
        </el-form-item>
        <el-form-item :label="$t('table.businesses.address')" prop="address">
          <el-input v-model="tempBusinessData.address" />
        </el-form-item>
        <el-form-item :label="$t('table.businesses.additional')" prop="additional">
          <el-input v-model="tempBusinessData.additional" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';
import {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  defaultBusinessData,
} from '../../api/businesses';
import { IBusiness } from '../../api/types';
import { exportJson2Excel } from '../../utils/excel';
import { formatJson } from '../../utils';
import Pagination from '../../components/Pagination/index.vue';

@Component({
  name: 'Businesses',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IBusiness[] = [];
  private total = 0;
  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 10,
    title: undefined,
  };
  private showReviewer = false;
  private dialogFormVisible = false;
  private dialogStatus = '';
  private textMap = {};
  private dialogPageviewsVisible = false;
  private pageviewsData = [];
  private rules = {};
  private downloadLoading = false;
  private tempBusinessData = defaultBusinessData;

  public created() {
    this.textMap = {
      update: this.$t('dialog.title.edit'),
      create: this.$t('dialog.title.create'),
    };
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getBusinesses(this.listQuery).then((res: any) => {
      this.list = res ? res.data : [];
      this.total = res ? res.max : 0;
      this.listLoading = false;
    });
  }

  private handleFilter() {
    this.getList();
  }

  private async handleDelete(row: any, status: string) {
    await deleteBusiness(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.businesses.delete.title') as string,
      message: this.$t('notify.businesses.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private resetTempBusinessData() {
    this.tempBusinessData = cloneDeep(defaultBusinessData);
  }

  private handleCreate() {
    this.resetTempBusinessData();
    this.dialogStatus = 'create';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        await createBusiness(this.tempBusinessData);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.businesses.create.title') as string,
          message: this.$t('notify.businesses.create.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleUpdate(row: any) {
    this.tempBusinessData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempBusinessData);
        const { data } = await updateBusiness(tempData.id!, tempData);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.businesses.update.title') as string,
          message: this.$t('notify.businesses.update.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleDownload() {
    this.downloadLoading = true;
    const tHeader = [
      this.$t('export.id') as string,
      this.$t('export.name') as string,
      this.$t('export.country') as string,
      this.$t('export.city') as string,
      this.$t('export.postalCode') as string,
      this.$t('export.address') as string,
      this.$t('export.additional') as string,
    ];
    const filterVal = [
      'id',
      'name',
      'country',
      'city',
      'postalCode',
      'address',
      'additional',
    ];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, this.$t(
      'export.businesses.fileName'
    ) as string);
    this.downloadLoading = false;
  }
}
</script>
