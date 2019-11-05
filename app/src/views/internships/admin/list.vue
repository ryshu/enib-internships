<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.internships.subject')"
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
      <el-table-column :label="$t('table.internships.subject')" min-width="250px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.subject }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.internships.country')" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.internships.city')" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.city }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.internships.isInternshipAbroad')" min-width="70px" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.isInternshipAbroad ? 'success' : 'danger'"
            effect="dark"
          >{{ $t(row.isInternshipAbroad ? 'status.yes' : 'status.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.internships.isValidated')" min-width="70px" align="center">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempInternshipData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.internships.subject')" prop="subject">
          <el-input v-model="tempInternshipData.subject" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.description')" prop="description">
          <el-input v-model="tempInternshipData.description" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.country')" prop="country">
          <el-input v-model="tempInternshipData.country" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.city')" prop="city">
          <el-input v-model="tempInternshipData.city" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.postalCode')" prop="postalCode">
          <el-input v-model="tempInternshipData.postalCode" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.address')" prop="address">
          <el-input v-model="tempInternshipData.address" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.additional')" prop="additional">
          <el-input v-model="tempInternshipData.additional" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.isInternshipAbroad')" prop="isInternshipAbroad">
          <input v-model="tempInternshipData.isInternshipAbroad" type="checkbox" />
        </el-form-item>
        <el-form-item :label="$t('table.internships.isValidated')" prop="isValidated">
          <input v-model="tempInternshipData.isValidated" type="checkbox" />
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

@Component({
  name: 'InternshipsStudentList',
  components: {
    Pagination,
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
  private tempInternshipData = defaultInternshipData;

  public created() {
    this.textMap = {
      update: this.$t('dialog.title.edit'),
      create: this.$t('dialog.title.create'),
    };
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

  private resetTempInternshipData() {
    this.tempInternshipData = cloneDeep(defaultInternshipData);
  }

  private handleCreate() {
    this.resetTempInternshipData();
    this.dialogStatus = 'create';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const res = await createInternship(this.tempInternshipData);
        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.internships.create.title') as string,
          message: this.$t('notify.internships.create.msg') as string,
          type: 'success',
          duration: 2000,
        });
        this.getList();
      }
    });
  }

  private handleUpdate(row: any) {
    this.tempInternshipData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempInternshipData);

        // Wait update
        await updateInternship(tempData.id!, tempData);
        this.getList();
        this.dialogFormVisible = false;
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
