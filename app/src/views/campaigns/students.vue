<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.firstName"
        :placeholder="$t('table.students.firstName')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.lastName"
        filterable
        multiple
        collapse-tags
        :placeholder="$t('table.students.lastName')"
        style="width: 200px; margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in countryList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.email"
        filterable
        multiple
        collapse-tags
        :placeholder="$t('table.filter.email')"
        style="width: 200px; margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
      <el-button
        v-waves
        style="margin-left: 10px;"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >{{ $t('table.search') }}</el-button
      >

      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        >{{ $t('table.export') }}</el-button
      >
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
      <el-table-column
        :label="$t('table.students.firstname')"
        min-width="250px"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.firstname
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.students.lastname')" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.category.label }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.students.email')" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.students.semester')" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="100"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
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

    <edit-internship ref="EditStudents" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import {
  getStudents,
  updateStudent,
  defaultStudentData,
} from '../../api/students';

import { IStudent } from '../../api/types';

import { exportJson2Excel } from '../../utils/excel';
import { formatJson } from '../../utils';

import Pagination from '../../../components/Pagination/index.vue';

import { CategoriesModule } from '../../store/modules/categories';

@Component({
  name: 'StudentCampaignsList',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IStudent[] = [];
  private total = 0;

  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 10,
    firstName: undefined,
    lastName: [],
    email: [],
    semester: [],
  };

  private downloadLoading = false;

  private get types() {
    return CategoriesModule.categories;
  }

  public created() {
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getStudents(this.listQuery).then((res: any) => {
      this.list = res ? res.data : [];
      this.total = res ? res.max : 0;
      this.listLoading = false;
    });
  }

  private handleFilter() {
    this.getList();
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
    const filterVal = ['id', 'firstName', 'lastName', 'email', 'semester'];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(
      tHeader,
      data,
      this.$t('export.students.fileName') as string
    );
    this.downloadLoading = false;
  }
}
</script>

<style lang="scss">
.el-form-item .el-select {
  width: 100%;
}
</style>
