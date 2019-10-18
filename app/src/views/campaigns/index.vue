<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.campaigns.name')"
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
      <el-table-column :label="$t('table.campaigns.name')" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.campaigns.startAt')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.startAt | formate('LL') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.campaigns.endAt')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.endAt | formate('LL') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.campaigns.semester')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.semester }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.campaigns.maxProposition')" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.maxProposition }}</span>
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
        :model="tempCampaignData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.campaigns.name')" prop="name">
          <el-input v-model="tempCampaignData.name" />
        </el-form-item>
        <el-form-item :label="$t('table.campaigns.description')" prop="description">
          <el-input v-model="tempCampaignData.description" />
        </el-form-item>
        <el-form-item :label="$t('table.campaigns.startAt')" prop="startAt">
          <el-input v-model="tempCampaignData.startAt" />
        </el-form-item>
        <el-form-item :label="$t('table.campaigns.endAt')" prop="endAt">
          <el-input v-model="tempCampaignData.endAt" />
        </el-form-item>
        <el-form-item :label="$t('table.campaigns.semester')" prop="semester">
          <el-input v-model="tempCampaignData.semester" />
        </el-form-item>
        <el-form-item :label="$t('table.campaigns.maxProposition')" prop="maxProposition">
          <el-input v-model="tempCampaignData.maxProposition" />
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
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  defaultCampaignData,
} from '../../api/campaigns';
import { ICampaigns } from '../../api/types';
import { exportJson2Excel } from '../../utils/excel';
import { formatJson } from '../../utils';
import Pagination from '../../components/Pagination/index.vue';

@Component({
  name: 'Campaigns',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: ICampaigns[] = [];
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
  private tempCampaignData = defaultCampaignData;

  public created() {
    this.textMap =  {
    update: this.$t('table.update') as string,
    create: this.$t('table.create') as string,
  };
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getCampaigns(this.listQuery).then((res: any) => {
      this.list = res ? res.data : [];
      this.total = res ? res.max : 0;
      this.listLoading = false;
    });
  }

  private handleFilter() {
    this.getList();
  }

    private async handleDelete(row: any, status: string) {
    await deleteCampaign(row.id!);
    this.getList();
    this.$notify({
      title: this.$t('notify.campaigns.delete.title') as string,
      message: this.$t('notify.campaigns.delete.msg') as string,
      type: 'success',
      duration: 2000,
    });
  }
  private resetTempCampaignData() {
    this.tempCampaignData = cloneDeep(defaultCampaignData);
  }

  private handleCreate() {
    this.resetTempCampaignData();
    this.dialogStatus = 'create';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const res = await createCampaign(this.tempCampaignData);
        this.getList();

        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.campaigns.create.title') as string,
          message: this.$t('notify.campaigns.create.msg') as string,
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleUpdate(row: any) {
    this.tempCampaignData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempCampaignData);
        await updateCampaign(tempData.id!, tempData);
        this.getList();

        this.dialogFormVisible = false;
        this.$notify({
          title: this.$t('notify.campaigns.update.title') as string,
          message: this.$t('notify.campaigns.update.msg') as string,
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
      this.$t('table.campaigns.name') as string,
      this.$t('table.campaigns.startAt') as string,
      this.$t('table.campaigns.endAt') as string,
      this.$t('table.campaigns.semester') as string,
      this.$t('table.campaigns.maxProposition') as string,
    ];
    const filterVal = [
      'id',
      'name',
      'startAt',
      'endAt',
      'semester',
      'maxProposition',
    ];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, 'table-list');
    this.downloadLoading = false;
  }
}
</script>
