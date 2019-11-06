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
      <el-table-column :label="$t('table.internships.subject')" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.subject }}</span>
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

      <el-table-column :label="$t('table.internships.isInternshipAbroad')" min-width="50px" align="center">
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
        width="100px"
        class-name="fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            :icon="row.isFavourites ? 'el-icon-star-off': 'el-icon-star-off'"
            circle
            @click="toogleFavourites(row)"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getInternships } from '../../../api/internships';
import { IInternship } from '../../../api/types';
import Pagination from '../../../components/Pagination/index.vue';

@Component({
  name: 'InternshipsStudentFavourites',
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

  public created() {
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
}
</script>
