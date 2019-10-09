<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.students.name')"
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.students.firstName')" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.students.lastName')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.students.email')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.students.semester')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.semester }}</span>
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
        :model="tempStudentData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.students.firstName')" prop="firstName">
          <el-input v-model="tempStudentData.firstName" />
        </el-form-item>
        <el-form-item :label="$t('table.students.lastName')" prop="lastName">
          <el-input v-model="tempStudentData.lastName" />
        </el-form-item>
        <el-form-item :label="$t('table.students.email')" prop="email">
          <el-input v-model="tempStudentData.email" />
        </el-form-item>
        <el-form-item :label="$t('table.students.semester')" prop="semester">
          <el-input v-model="tempStudentData.semester" />
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
  getStudents,
  createStudent,
  updateStudent,
  defaultStudentData,
  deleteStudent,
} from '../../api/students';
import { IStudent } from '../../api/types';
import { exportJson2Excel } from '../../utils/excel';
import { formatJson } from '../../utils';
import Pagination from '../../components/Pagination/index.vue';

@Component({
  name: 'Students',
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
    title: undefined,
  };
  private showReviewer = false;
  private dialogFormVisible = false;
  private dialogStatus = '';
  private textMap = {
    update: 'Edit',
    create: 'Create',
  };
  private dialogPageviewsVisible = false;
  private pageviewsData = [];
  private rules = {
    type: [{ required: true, message: 'type is required', trigger: 'change' }],
    timestamp: [
      {
        required: true,
        message: 'timestamp is required',
        trigger: 'change',
      },
    ],
    title: [{ required: true, message: 'title is required', trigger: 'blur' }],
  };
  private downloadLoading = false;
  private tempStudentData = defaultStudentData;

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

  private async handleDelete(row: any, status: string) {
    await deleteStudent(row.id!);
    this.getList();
    this.$notify({
      title: 'Delete a student',
      message: 'Successfully Delete student data',
      type: 'success',
      duration: 2000,
    });
  }

  private handleCreate() {
    this.tempStudentData = cloneDeep(defaultStudentData);
    this.dialogStatus = 'create';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        await createStudent(this.tempStudentData);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: 'Student creation',
          message: 'Student successfully created',
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleUpdate(row: any) {
    this.tempStudentData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempStudentData);
        await updateStudent(tempData.id!, tempData);
        this.getList();

        this.dialogFormVisible = false;
        this.$notify({
          title: 'Update a student',
          message: 'Successfully update student data',
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleDownload() {
    this.downloadLoading = true;
    const tHeader = [
      'id',
      'name',
      'country',
      'city',
      'postalCode',
      'address',
      'additional',
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
    exportJson2Excel(tHeader, data, 'table-list');
    this.downloadLoading = false;
  }
}
</script>
