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
        min-width="80px"
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
            icon="el-icon-check"
            :placeholder="$t('propositions.placeholder.add')"
            @clicked="handlePublish(row)"
          />
          <crud-btn
            type="warning"
            icon="el-icon-edit"
            :placeholder="$t('propositions.placeholder.update')"
            @clicked="handleUpdate(row)"
          />
          <crud-btn
            type="danger"
            icon="el-icon-delete"
            :placeholder="$t('propositions.placeholder.remove')"
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

    <edit-internship ref="EditInternship" />
  </div>
</template>

<script lang="ts">
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';

import {
  getInternships,
  updateInternship,
  deleteInternship,
  defaultInternshipData,
} from '../../../api/internships';
import { IInternship } from '../../../api/types';

import Pagination from '../../../components/Pagination/index.vue';
import CrudBtn from '../../../components/CrudBtn/index.vue';
import EditInternship from '../dialog/EditInternship.vue';

import { CategoriesModule } from '../../../store/modules/categories';

@Component({
  name: 'InternshipsStudentList',
  components: {
    Pagination,
    EditInternship,
    CrudBtn,
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
    mode: 'propositions',
    countries: [],
    types: [],
    isAbroad: false,
  };

  private countryList = countryList.getNames();

  private get types() {
    return CategoriesModule.categories;
  }

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

  private handleUpdate(row: IInternship) {
    (this.$refs.EditInternship as EditInternship)
      .update(row)
      .then(async updatedRow => {
        if (updatedRow) {
          const { data } = await updateInternship(updatedRow.id!, updatedRow);
          this.getList();
          this.$notify({
            title: this.$t('notify.internship.update.title') as string,
            message: this.$t('notify.internship.update.msg') as string,
            type: 'success',
            duration: 2000,
          });
        }
      });
  }

  private async handleDelete(row: any) {
    await deleteInternship(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.internships.delete.title') as string,
      message: this.$t('notify.internships.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }
}
</script>
