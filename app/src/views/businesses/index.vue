<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.businesses.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.countries"
        filterable
        multiple
        collapse-tags
        style="width: 200px; margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
      </el-select>
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
        width="150px"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="small"
            icon="el-icon-search"
            circle
            @click="handleUpdate(row)"
          />
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            circle
            @click="handleUpdate(row)"
          />
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(row, 'deleted')"
          />
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

    <edit-business ref="EditBusiness" />
  </div>
</template>

<script lang="ts">
import countryList from 'country-list';
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
import EditBusiness from './dialog/EditBusiness.vue';

@Component({
  name: 'Businesses',
  components: {
    Pagination,
    EditBusiness,
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
    name: undefined,
    countries: [],
    withInternships: false,
  };
  private downloadLoading = false;
  private tempBusinessData = defaultBusinessData;

  private countryList = countryList.getNames();

  public created() {
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

  private handleCreate() {
    (this.$refs.EditBusiness as EditBusiness)
      .create()
      .then(async (createdRow: IBusiness | undefined) => {
        if (createdRow) {
          await createBusiness(createdRow);
          this.getList();
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
    (this.$refs.EditBusiness as EditBusiness)
      .update(row)
      .then(async (updatedRow: IBusiness | undefined) => {
        if (updatedRow) {
          const { data } = await updateBusiness(updatedRow.id!, updatedRow);
          this.getList();
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

<style lang="scss">
.el-form-item .el-select {
  width: 100%;
}
</style>
