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
          <span class="link-type" @click="handleUpdate(row)">
            {{
              row.subject
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.internships.country')" min-width="70px">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.internships.city')" min-width="70px">
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
        width="150"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <crud-btn
            type="success"
            icon="el-icon-news"
            :placeholder="$t('mentoringProposition.placeholder.create')"
            @clicked="handleCreate(row)"
          />
          <crud-btn
            type="warning"
            icon="el-icon-edit"
            :placeholder="$t('internships.placeholder.update')"
            @clicked="handleUpdate(row)"
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

    <el-dialog
      :title="$t('table.mentoringProposition.title')"
      :before-close="cancel"
      :visible.sync="dialogFormPostVisible"
      width="60%"
      top="5vh"
      @keydown.esc="cancel"
    >
      <el-form
        ref="dataFormPost"
        :model="tempMentoringPropositionData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.mentoringProposition.comment')" prop="comment">
          <el-input v-model="tempMentoringPropositionData.comment" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormPostVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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
  updateInternship,
  deleteInternship,
  defaultInternshipData,
  linkInternshipPropositions,
} from '../../../api/internships';

import { IInternshipEntity,
         InternshipOpts,
         ICampaignEntity,
         IMentoringPropositionEntity,
         PropositionsOpts,
} from '../../../declarations';

import {
  getAvailabletInternshipCampaign,
  getCampaigns,
  linkCampaignMentoringPropositions,
} from '../../../api/campaigns';

import { linkMentorProposition } from '../../../api/mentors';

import { createMentoringProposition,
         defaultMentoringPropositionData,
} from '../../../api/mentoring.propositions';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';
import CrudBtn from '../../../components/CrudBtn/index.vue';
import EditInternship from '../../internships/dialog/EditInternship.vue';

import { CategoriesModule } from '../../../store/modules/categories';
import { UserModule } from '../../../store/modules/user';

@Component({
  name: 'CampaignsAdminInternships',
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
    isAbroad: false,
  };

  private resolve: (value?: IMentoringPropositionEntity) => void = () => {};

  private downloadLoading = false;

  private dialogFormPostVisible = false;
  private dialogStatus = '';

  private internshipId = -1;

  // Available mode to print in edition dialog
  private textMap = {};

  // Validation rules for edit and update
  private tempMentoringPropositionData = defaultMentoringPropositionData;

  private countryList = countryList.getNames();

  private get types() {
    return CategoriesModule.categories;
  }

  private get id() {
    return Number(this.$route.params.id);
  }

  private get userId() {
    return UserModule.id;
  }

  public created() {
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getAvailabletInternshipCampaign(this.id, this.listQuery).then(
      (res: any) => {
        this.list = res ? res.data : [];
        this.total = res ? res.max : 0;
        this.listLoading = false;
      }
    );
  }

  private handleFilter() {
    this.getList();
  }

  private resetTempMentoringPropositionData() {
    this.tempMentoringPropositionData = cloneDeep(defaultMentoringPropositionData);
  }

  private handleCreate(row: any) {
    this.resetTempMentoringPropositionData();
    this.internshipId = row.id;
    this.dialogStatus = 'create';
    this.dialogFormPostVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataFormPost'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataFormPost'] as Form).validate(async valid => {
      if (valid) {
        // TODO: Factorize in 1 function
        const data = await createMentoringProposition(this.tempMentoringPropositionData);
        linkMentorProposition(this.userId, Number(data.id));
        linkCampaignMentoringPropositions(this.id, Number(data.id));
        linkInternshipPropositions(this.internshipId, Number(data.id));
        this.getList();
        this.dialogFormPostVisible = false;
        this.internshipId = -1;
        this.$notify({
          title: this.$t('notify.mentorPropositions.create.title') as string,
          message: this.$t('notify.mentorPropositions.create.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
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

  private handleUpdate(row: any) {
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

  private cancel() {
    this.dialogFormPostVisible = false;
    this.resolve();
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
