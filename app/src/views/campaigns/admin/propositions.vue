<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.firstName"
        :placeholder="$t('table.propositions.firstName')"
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
      <el-table-column :label="$t('table.mentoringProposition.student')" min-width="75px">
        <template slot-scope="{ row }">
          <span>{{ row.internship.student.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentoringProposition.internship')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.internship.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentoringProposition.business')" min-width="75px">
        <template slot-scope="{ row }">
          <span>{{ row.internship.business ? row.internship.business.name : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentoringProposition.country')" min-width="50px">
        <template slot-scope="{ row }">
          <span>{{ row.internship.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentoringProposition.mentor')" min-width="75px">
        <template slot-scope="{ row }">
          <span>{{ row.mentor.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentoringProposition.comment')" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="150"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <crud-btn
            type="success"
            icon="el-icon-check"
            :placeholder="$t('mentoringProposition.placeholder.validate')"
            @clicked="handleLinkMentorToInternship(row.id)"
          />
          <crud-btn
            type="danger"
            icon="el-icon-close"
            :placeholder="$t('mentoringProposition.placeholder.delete')"
            @clicked="handleDelete(row)"
          />
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
        :model="tempMentoringPropositionData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.propositions.id')" prop="id">
          <el-input v-model="tempMentoringPropositionData.id" />
        </el-form-item>
        <el-form-item :label="$t('table.propositions.comment')" prop="comment">
          <el-input v-model="tempMentoringPropositionData.comment" />
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
  getMentoringPropositions,
  getMentoringProposition,
  getMentoringPropositionsbyCampaign,
  updateMentoringProposition,
  createMentoringProposition,
  deleteMentoringProposition,
  defaultMentoringPropositionData,
} from '../../../api/mentoring.propositions';
import {
  IMentoringPropositionEntity,
  IInternshipEntity,
  INTERNSHIP_MODE,
  INTERNSHIP_RESULT,
} from '../../../declarations';

import { attributeInternshipToMentor } from '../../../api/internships';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';
import CrudBtn from '../../../components/CrudBtn/index.vue';
import { MentorOpts } from '../../../declarations/mentor';

@Component({
  name: 'CampaignsAdminPropositions',
  components: {
    Pagination,
    CrudBtn,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IMentoringPropositionEntity[] = [];
  private total = 0;
  private listLoading = true;

  // Filter for query, this will not be used until we add pagination
  private listQuery: MentorOpts = {
    page: 1,
    limit: 10,
    includes: ['student', 'mentor', 'business'],
  };
  private dialogFormVisible = false;
  private dialogStatus = '';

  // Available mode to print in edition dialog
  private textMap = {};

  // Validation rules for edit and update
  private downloadLoading = false;
  private tempMentoringPropositionData = defaultMentoringPropositionData;

  public created() {
    this.textMap = {
      update: this.$t('dialog.title.edit'),
      create: this.$t('dialog.title.create'),
    };
    this.getList();
  }
  private getList() {
    this.listLoading = true;
    getMentoringPropositionsbyCampaign(this.id, this.listQuery).then(
      (res: any) => {
        this.list = res ? res.data : [];
        this.total = res ? res.max : 0;
        this.listLoading = false;
      }
    );
  }

  public get id() {
    return Number(this.$route.params.id);
  }

  private handleFilter() {
    this.getList();
  }

  private resetTempPropositionData() {
    this.tempMentoringPropositionData = cloneDeep(
      Object.assign({}, defaultMentoringPropositionData, {
        mentorId: undefined,
      })
    );
  }

  private async handleDelete(row: any, status: string) {
    await deleteMentoringProposition(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.propositions.delete.title') as string,
      message: this.$t('notify.propositions.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }

  private handleUpdate(row: any) {
    this.tempMentoringPropositionData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempMentoringPropositionData);
        await updateMentoringProposition(tempData.id!, tempData);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.propositions.update.title') as string,
          message: this.$t('notify.propositions.update.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleDownload() {
    this.downloadLoading = true;
    const tHeader = [
      this.$t('table.propositions.id') as string,
      this.$t('table.propositions.comment') as string,
    ];
    const filterVal = ['id', 'comment'];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, this.$t(
      'export.propositions.fileName'
    ) as string);
    this.downloadLoading = false;
  }

  private handleLinkMentorToInternship(id: number) {
    const found = this.list.findIndex(mp => mp.id === id);
    if (found !== -1) {
      attributeInternshipToMentor(
        this.list[found].internship!.id!, // if student not included, just this.list[found].internship.student
        this.list[found].mentor!.id! // if mentor not included, just this.list[found].mentor
      ).then(async res => {
        if (res) {
          await deleteMentoringProposition(id);
          this.getList();
        }
        this.$notify({
          title: this.$t('notify.propositions.attributed.title') as string,
          message: this.$t('notify.propositions.attributed.msg') as string,
          type: 'success',
          duration: 2000,
        });
      });
    }
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
