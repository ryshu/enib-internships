<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('table.mentors.fullName')"
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
        @click="handleAdd"
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

    <el-dialog :title="$t('dialog.title.edit')" :visible.sync="dialogUpdateMentor">
      <el-form
        ref="updateForm"
        :model="tmpMentorData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.mentors.firstName')" prop="firstName">
          <el-input v-model="tmpMentorData.firstName" />
        </el-form-item>
        <el-form-item :label="$t('table.mentors.lastName')" prop="lastName">
          <el-input v-model="tmpMentorData.lastName" />
        </el-form-item>
        <el-form-item :label="$t('table.mentors.email')" prop="email">
          <el-input v-model="tmpMentorData.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus===updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="this.$t('dialog.title.import')" :visible.sync="dialogAddMentor">
      <el-form
        ref="addForm"
        :model="addMentorData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.mentors.fullName')" prop="id">
          <el-select
            v-model="addMentorData.id"
            filterable
            remote
            reserve-keyword
            :remote-method="searchMentor"
            :loading="loadingMentor"
            :placeholder="$t('mentors.placeholder.includeMentor')"
          >
            <el-option v-for="c in mentors" :key="c.id" :label="c.fullName" :value="c.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddMentor = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddMentor()">{{ $t('table.confirm') }}</el-button>
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
import { linkCampaignMentor } from '../../../api/campaigns';

import { IMentorEntity, MentorOpts } from '../../../declarations';

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
  private list: IMentorEntity[] = [];
  private total = 0;
  private listLoading = true;

  // Filter for query, this will not be used until we add pagination
  private listQuery = {
    page: 1,
    limit: 10,
    firstName: undefined,
  };

  private dialogUpdateMentor = false;
  private dialogAddMentor = false;

  // Mentors dynamique query
  private mentors: IMentorEntity[] = [];
  private mentorQuery: MentorOpts = {
    page: 1,
    limit: 10,
    name: undefined,
  };
  private loadingMentor = true;

  // Available mode to print in edition dialog
  private textMap = {};

  // Validation rules for edit and update
  private downloadLoading = false;
  private tmpMentorData = defaultMentorData;
  private addMentorData: { id?: number } = { id: undefined };

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
    this.tmpMentorData = cloneDeep(defaultMentorData);
  }

  private async handleDelete(row: any, status: string) {
    await deleteMentor(row.id!); // TODO: unlink, not delete
    this.getList();
    this.$notify({
      title: this.$t('notify.mentors.delete.title') as string,
      message: this.$t('notify.mentors.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private searchMentor(query: string) {
    if (query !== '') {
      this.loadingMentor = true;
      this.mentorQuery.name = query;
    }
    getMentors(this.mentorQuery)
      .then(res => {
        this.loadingMentor = false;
        this.mentors = res ? res.data : [];
      })
      .catch(() => (this.mentors = []));
  }

  private handleAdd() {
    this.addMentorData = { id: undefined };
    this.dialogAddMentor = true;
    this.$nextTick(() => {
      (this.$refs['addForm'] as Form).clearValidate();
    });
  }

  private handleAddMentor() {
    (this.$refs['addForm'] as Form).validate(async valid => {
      if (valid) {
        await linkCampaignMentor(
          Number(this.$route.params.id!),
          this.addMentorData.id!
        );
        this.getList();
        this.dialogAddMentor = false;
        this.$notify({
          title: this.$t('notify.mentors.import.title') as string,
          message: this.$t('notify.mentors.import.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleUpdate(row: any) {
    this.tmpMentorData = Object.assign({}, row);
    this.dialogUpdateMentor = true;
    this.$nextTick(() => {
      (this.$refs['updateForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['updateForm'] as Form).validate(async valid => {
      if (valid) {
        const tmpData = Object.assign({}, this.tmpMentorData);
        await updateMentor(tmpData.id!, tmpData);
        this.getList();
        this.dialogUpdateMentor = false;
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

<style lang="scss" scope>
.dialog-footer {
  padding: 0 !important;
  padding-bottom: 40px !important;
  margin: auto;

  display: flex;
  justify-content: center;
}
</style>
