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
          <span class="link-type" @click="handleUpdate(row)">{{ row.subject }}</span>
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
        width="330"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handlePostuler(row)"
          >{{ $t('table.postuler') }}</el-button>
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
  </div>
</template>

<script lang="ts">
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import {
  getInternships,
  defaultInternshipData,
} from '../../../api/internships';

import { IInternshipEntity, InternshipOpts } from '../../../declarations';

import {
  getAvailabletInternshipCampaign,
  getCampaigns,
} from '../../../api/campaigns';

import { exportJson2Excel } from '../../../utils/excel';
import { formatJson } from '../../../utils';

import Pagination from '../../../components/Pagination/index.vue';

import { CategoriesModule } from '../../../store/modules/categories';

@Component({
  name: 'CampaignsMentorInternships',
  components: {
    Pagination,
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

  private downloadLoading = false;

  private countryList = countryList.getNames();

  private get types() {
    return CategoriesModule.categories;
  }

  private get id() {
    return Number(this.$route.params.id);
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

