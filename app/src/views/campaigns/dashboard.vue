<template>
  <div class="app-container">
    <component :is="roleView" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import CampaignsMentorDashboard from './mentor/dashboard.vue';
import CampaignsAdminDashboard from './admin/dashboard.vue';

@Component({
  name: 'CampaignsDashboard',
  components: {
    CampaignsMentorDashboard,
    CampaignsAdminDashboard,
  },
})
export default class extends Vue {
  private roleView = 'campaigns-mentor-dashboard';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'admin') {
      this.roleView = 'campaigns-admin-dashboard';
    } else {
      this.roleView = 'campaigns-mentor-dashboard';
    }
  }

  created() {
    this.changeRole(this.role);
  }

  @Watch('role')
  onPropertyChanged(val: string) {
    this.changeRole(val);
  }
}
</script>
