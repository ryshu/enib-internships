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
        min-width="70px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag
            :type="row.isInternshipAbroad ? 'success' : 'danger'"
            effect="dark"
          >{{ $t(row.isInternshipAbroad ? 'status.yes' : 'status.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="200"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <crud-btn
            type="success"
            icon="el-icon-user"
            :placeholder="$t('internships.placeholder.attribute')"
            @clicked="handleAttribute(row)"
          />
          <crud-btn
            type="warning"
            icon="el-icon-edit"
            :placeholder="$t('internships.placeholder.update')"
            @clicked="handleUpdate(row)"
          />
          <crud-btn
            type="danger"
            icon="el-icon-download"
            :placeholder="$t('internships.placeholder.unpublish')"
            @clicked="handleUnpublish(row)"
          />
          <crud-btn
            type="danger"
            icon="el-icon-delete"
            :placeholder="$t('internships.placeholder.remove')"
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

    <el-dialog :title="this.$t('dialog.title.import')" :visible.sync="dialogAttributeStudent">
      <el-form
        ref="addForm"
        :model="addStudentData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.students.fullName')" prop="id">
          <el-select
            v-model="addStudentData.id"
            filterable
            remote
            reserve-keyword
            :remote-method="searchStudent"
            :loading="loadingStudent"
            :placeholder="$t('students.placeholder.includeStudent')"
          >
            <el-option v-for="c in students" :key="c.id" :label="c.fullName" :value="c.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAttributeStudent = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="handleAttributeStudent()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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
  unpublishInternship,
  attributeStudent,
} from '../../../api/internships';
import { getStudents } from '../../../api/students';

import {
  IInternshipEntity,
  InternshipOpts,
  INTERNSHIP_MODE,
  IStudentEntity,
} from '../../../declarations';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';
import CrudBtn from '../../../components/CrudBtn/index.vue';
import EditInternship from '../dialog/EditInternship.vue';

import { CategoriesModule } from '../../../store/modules/categories';

@Component({
  name: 'InternshipsStudentList',
  components: {
    Pagination,
    CrudBtn,
    EditInternship,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IInternshipEntity[] = [];
  private total = 0;

  private listLoading = true;
  private listQuery: InternshipOpts = {
    page: 1,
    limit: 10,
    subject: undefined,
    countries: [],
    types: [],
    mode: [INTERNSHIP_MODE.PUBLISHED],
    isAbroad: false,
  };

  private downloadLoading = false;

  private countryList = countryList.getNames();

  private dialogAttributeStudent = false;
  // Students dynamique query
  private students: IStudentEntity[] = [];
  private studentQuery = {
    page: 1,
    limit: 10,
    name: undefined,
  };
  private loadingStudent = true;
  private addStudentData: { id?: number; internshipId?: number } = {
    id: undefined,
  };

  private get types() {
    return CategoriesModule.categories;
  }

  public created() {
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getInternships(this.listQuery).then(res => {
      this.list = res ? res.data : [];
      this.total = res ? res.max : 0;
      this.listLoading = false;
    });
  }

  private handleCreate() {
    this.$router.push('/internships/new');
  }

  private handleFilter() {
    this.getList();
  }

  private async handleUnpublish(row: IInternshipEntity) {
    await unpublishInternship(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.internships.unpublish.title') as string,
      message: this.$t('notify.internships.unpublish.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private searchStudent(query: string) {
    if (query !== '') {
      this.loadingStudent = true;
      (this.studentQuery as any).name = query;
    }
    getStudents(this.studentQuery)
      .then(res => {
        this.loadingStudent = false;
        this.students = res ? res.data : [];
      })
      .catch(() => (this.students = []));
  }

  private handleAttribute(row: IInternshipEntity) {
    this.addStudentData = { id: undefined, internshipId: row.id! };
    this.dialogAttributeStudent = true;
    this.$nextTick(() => {
      (this.$refs['addForm'] as Form).clearValidate();
    });
  }

  private handleAttributeStudent() {
    (this.$refs['addForm'] as Form).validate(async valid => {
      if (valid) {
        await attributeStudent(
          this.addStudentData.internshipId!,
          this.addStudentData.id!
        );
        this.getList();
        this.dialogAttributeStudent = false;
        this.$notify({
          title: this.$t('notify.students.attribute.title') as string,
          message: this.$t('notify.students.attribute.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private async handleDelete(row: IInternshipEntity) {
    await deleteInternship(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.internships.delete.title') as string,
      message: this.$t('notify.internships.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private handleUpdate(row: IInternshipEntity) {
    (this.$refs.EditInternship as EditInternship)
      .update(row)
      .then(async (updatedRow: IInternshipEntity | undefined) => {
        if (updatedRow) {
          await updateInternship(updatedRow.id!, updatedRow);
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
