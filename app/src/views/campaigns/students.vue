<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.students.lastName')"
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
      <el-table-column :label="$t('table.students.firstName')" min-width="250px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.students.lastName')" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.lastName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.students.email')" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="100"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <crud-btn
            type="warning"
            icon="el-icon-edit"
            :placeholder="$t('students.placeholder.update')"
            @clicked="handleUpdate(row)"
          />
          <crud-btn
            type="danger"
            icon="el-icon-delete"
            :placeholder="$t('students.placeholder.remove')"
            @clicked="handleDelete(row)"
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

import Pagination from '../../components/Pagination/index.vue';
import CrudBtn from '../../components/CrudBtn/index.vue';

@Component({
  name: 'StudentCampaignsList',
  components: {
    Pagination,
    CrudBtn,
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
    name: undefined,
  };

  private downloadLoading = false;

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
      this.$t('export.firstName') as string,
      this.$t('export.lastName') as string,
      this.$t('export.email') as string,
    ];
    const filterVal = ['id', 'firstName', 'lastName', 'email'];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, this.$t(
      'export.students.fileName'
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
