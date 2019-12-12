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
      <el-table-column :label="$t('table.mentoringProposition.comment')" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';

import { getMentoringPropositionsbyCampaign } from '../../../api/mentoring.propositions';
import { IMentoringPropositionEntity } from '../../../declarations';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';
import { UserModule } from '../../../store/modules/user';

@Component({
  name: 'CampaignsMentorPropositions',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IMentoringPropositionEntity[] = [];
  private total = 0;
  private listLoading = true;

  // Filter for query, this will not be used until we add pagination
  private listQuery = {
    page: 1,
    limit: 10,
    subject: undefined,
    includes: ['student', 'mentor', 'business'],
    mentorId: UserModule.id!,
  };

  // Validation rules for edit and update
  private downloadLoading = false;

  public created() {
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
}
</script>
