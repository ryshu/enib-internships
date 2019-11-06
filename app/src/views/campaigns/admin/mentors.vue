<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.firstName"
        :placeholder="$t('table.mentors.firstName')"
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
      <el-table-column :label="$t('table.mentors.firstName')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentors.lastName')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentors.email')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
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
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="tempMentorData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.mentors.firstName')" prop="firstName">
          <el-input v-model="tempMentorData.firstName" />
        </el-form-item>
        <el-form-item :label="$t('table.mentors.lastName')" prop="lastName">
          <el-input v-model="tempMentorData.lastName" />
        </el-form-item>
        <el-form-item :label="$t('table.mentors.email')" prop="email">
          <el-input v-model="tempMentorData.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
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
  getMentors,
  getMentorsByCampaign,
  createMentor,
  updateMentor,
  deleteMentor,
  defaultMentorData,
} from '../../../api/mentors';
import { IMentor } from '../../../api/types';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';

@Component({
  name: 'CampaignsAdminMentorsList',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IMentor[] = [];
  private total = 0;
  private listLoading = true;

  // Filter for query, this will not be used until we add pagination
  private listQuery = {
    page: 1,
    limit: 10,
    firstName: undefined,
  };
  private dialogFormVisible = false;
  private dialogStatus = '';

  // Available mode to print in edition dialog
  private textMap = {};

  // Validation rules for edit and update
  private downloadLoading = false;
  private tempMentorData = defaultMentorData;

  public created() {
    this.textMap = {
      update: this.$t('dialog.title.edit'),
      create: this.$t('dialog.title.create'),
    };
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getMentorsByCampaign(this.id, this.listQuery).then((res: any) => {
      this.list = res ? res.data : [];
      this.total = res ? res.max : 0;
      this.listLoading = false;
    });
  }

  public get id() {
    return Number(this.$route.params.id);
  }

  private handleFilter() {
    this.getList();
  }

  private resetTempMentorData() {
    this.tempMentorData = cloneDeep(defaultMentorData);
  }

  private async handleDelete(row: any, status: string) {
    await deleteMentor(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.mentors.delete.title') as string,
      message: this.$t('notify.mentors.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private handleCreate() {
    this.resetTempMentorData();
    this.dialogStatus = 'create';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const data = await createMentor(this.tempMentorData);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.mentors.create.title') as string,
          message: this.$t('notify.mentors.create.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleUpdate(row: any) {
    this.tempMentorData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempMentorData);
        await updateMentor(tempData.id!, tempData);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.mentors.update.title') as string,
          message: this.$t('notify.mentors.update.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleDownload() {
    this.downloadLoading = true;
    const tHeader = [
      this.$t('table.mentors.firstName') as string,
      this.$t('table.mentors.lastName') as string,
      this.$t('table.mentors.email') as string,
    ];
    const filterVal = ['firstName', 'lastName', 'email'];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, this.$t(
      'export.mentors.fileName'
    ) as string);
    this.downloadLoading = false;
  }
}
</script>
