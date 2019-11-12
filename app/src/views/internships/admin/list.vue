<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.subject"
        :placeholder="$t('table.internships.subject')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.countries"
        filterable
        multiple
        collapse-tags
        :placeholder="$t('table.filter.countries')"
        style="width: 200px; margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in countryList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.types"
        filterable
        multiple
        collapse-tags
        :placeholder="$t('table.filter.types')"
        style="width: 200px; margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option v-for="item in types" :key="item.id" :label="item.label" :value="item.id" />
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
      <el-checkbox
        v-model="listQuery.isAbroad"
        v-waves
        style="margin-left: 10px;"
        class="filter-item"
        type="primary"
        @change="handleFilter"
      >{{ $t('table.checkbox.isAbroad') }}</el-checkbox>
      <el-checkbox
        v-model="listQuery.isValidated"
        v-waves
        style="margin-left: 10px;"
        class="filter-item"
        type="primary"
        @change="handleFilter"
      >{{ $t('table.checkbox.isValidated') }}</el-checkbox>
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
      <el-table-column :label="$t('table.internships.subject')" min-width="250px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.internships.category')" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.category.label }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.internships.country')" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.internships.city')" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.internships.isInternshipAbroad')"
        min-width="85px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag
            :type="row.isInternshipAbroad ? 'success' : 'danger'"
            effect="dark"
          >{{ $t(row.isInternshipAbroad ? 'status.yes' : 'status.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.internships.isValidated')" min-width="75px" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.isValidated ? 'success' : 'danger'"
            effect="dark"
          >{{ $t(row.isValidated ? 'status.yes' : 'status.no') }}</el-tag>
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

    <edit-internship ref="EditInternship" />
  </div>
</template>

<script lang="ts">
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  defaultInternshipData,
} from '../../../api/internships';

import { IInternship } from '../../../api/types';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';
import EditInternship from '../dialog/EditInternship.vue';

import { CategoriesModule } from '../../../store/modules/categories';

@Component({
  name: 'InternshipsStudentList',
  components: {
    Pagination,
    EditInternship,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IInternship[] = [];
  private total = 0;

  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 10,
    subject: undefined,
    countries: [],
    types: [],
    isAbroad: false,
    isValidated: false,
  };

  private downloadLoading = false;

  private countryList = countryList.getNames();

  private get types() {
    return CategoriesModule.categories;
  }

  public created() {
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getInternships(this.listQuery).then((res: any) => {
      this.list = res ? res.data : [];
      this.total = res ? res.max : 0;
      this.listLoading = false;
    });
  }

  private handleFilter() {
    this.getList();
  }

  private async handleDelete(row: any, status: string) {
    await deleteInternship(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.internships.delete.title') as string,
      message: this.$t('notify.internships.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private handleCreate() {
    (this.$refs.EditInternship as EditInternship)
      .create()
      .then(async (createdRow: IInternship | undefined) => {
        if (createdRow) {
          await createInternship(createdRow);
          this.getList();
          this.$notify({
            title: this.$t('notify.internships.create.title') as string,
            message: this.$t('notify.internships.create.msg') as string,
            type: 'success',
            duration: 2000,
          });
        }
      });
  }

  private handleUpdate(row: any) {
    (this.$refs.EditInternship as EditInternship)
      .update(row)
      .then(async (updatedRow: IInternship | undefined) => {
        if (updatedRow) {
          const { data } = await updateInternship(updatedRow.id!, updatedRow);
          this.getList();
          this.$notify({
            title: this.$t('notify.internships.update.title') as string,
            message: this.$t('notify.internships.update.msg') as string,
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
      this.$t('export.subject') as string,
      this.$t('export.description') as string,
      this.$t('export.country') as string,
      this.$t('export.city') as string,
      this.$t('export.postalCode') as string,
      this.$t('export.address') as string,
      this.$t('export.additional') as string,
      this.$t('export.internships.isInternshipAbroad') as string,
      this.$t('export.internships.isValidated') as string,
    ];
    const filterVal = [
      'id',
      'subject',
      'description',
      'country',
      'city',
      'postalCode',
      'address',
      'additional',
      'isInternshipAbroad',
      'isValidated',
    ];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, this.$t(
      'export.internships.fileName'
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
