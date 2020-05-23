<template>
  <div
    v-if="(campaigns && campaigns.length !== 0) || checkPermission(['admin'])"
    class="menu-wrapper full-mode first-level"
  >
    <el-submenu :index="resolvePath('dashboard')" popper-append-to-body>
      <template slot="title">
        <svg-icon name="skill" />
        <span slot="title">{{ $t('route.campaigns.title') }}</span>
      </template>
      <el-submenu
        v-for="campaign in campaigns"
        :key="campaign.id"
        :index="resolvePath('dashboard', campaign.id)"
        popper-append-to-body
      >
        <template slot="title">
          <span slot="title">{{ campaign.name }}</span>
        </template>

        <sidebar-item-link :to="resolvePath('dashboard', campaign.id)">
          <el-menu-item
            :index="resolvePath('dashboard', campaign.id)"
            class="submenu-title-noDropdown"
          >
            <span slot="title">{{ $t('route.campaigns.dashboard') }}</span>
          </el-menu-item>
        </sidebar-item-link>
        <sidebar-item-link :to="resolvePath('internships', campaign.id)">
          <el-menu-item
            :index="resolvePath('internships', campaign.id)"
            class="submenu-title-noDropdown"
          >
            <span slot="title">{{ $t('route.campaigns.internships') }}</span>
          </el-menu-item>
        </sidebar-item-link>
        <sidebar-item-link
          v-if="checkPermission(['admin'])"
          :to="resolvePath('mentors', campaign.id)"
        >
          <el-menu-item
            :index="resolvePath('mentors', campaign.id)"
            class="submenu-title-noDropdown"
          >
            <span slot="title">{{ $t('route.campaigns.mentors') }}</span>
          </el-menu-item>
        </sidebar-item-link>
        <sidebar-item-link :to="resolvePath('propositions', campaign.id)">
          <el-menu-item
            :index="resolvePath('propositions', campaign.id)"
            class="submenu-title-noDropdown"
          >
            <span slot="title">{{ $t('route.campaigns.propositions') }}</span>
          </el-menu-item>
        </sidebar-item-link>
        <sidebar-item-link
          v-if="checkPermission(['admin'])"
          :to="resolvePath('settings', campaign.id)"
        >
          <el-menu-item
            :index="resolvePath('settings', campaign.id)"
            class="submenu-title-noDropdown"
          >
            <span slot="title">{{ $t('route.campaigns.settings') }}</span>
          </el-menu-item>
        </sidebar-item-link>
      </el-submenu>
      <sidebar-item-link v-if="checkPermission(['admin'])" :to="resolvePath('new')">
        <el-menu-item :index="resolvePath('new')" class="submenu-title-noDropdown">
          <span slot="title">{{ $t('route.campaigns.new') }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, RouteConfig } from 'vue-router';

import { isExternal } from '@/utils/validate';
import { checkPermission } from '@/utils/permission'; // Use permission directly

import SidebarItemLink from './SidebarItemLink.vue';

import { CampaignsModule } from '../../../store/modules/campaigns';

@Component({
  // Set 'name' here to prevent uglifyjs from causing recursive component not work
  // See https://medium.com/haiiro-io/element-component-name-with-vue-class-component-f3b435656561 for detail
  name: 'SidebarItem',
  components: { SidebarItemLink },
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig;

  private prev: number = -1;
  private checkPermission = checkPermission;

  public get campaigns() {
    return CampaignsModule.campaigns;
  }

  private resolvePath(routePath: string, id?: number) {
    return id
      ? path.resolve('campaigns', routePath, String(id))
      : path.resolve('campaigns', routePath);
  }

  private generateTitle(label: string) {
    return this.$t(`route.${label}`);
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
