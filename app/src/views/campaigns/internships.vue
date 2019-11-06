<template>
  <div class="app-container">
    <component :is="roleView" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import CampaignsMentorInternships from './mentor/internships.vue';
import CampaignsAdminInternships from './admin/internships.vue';

@Component({
  name: 'CampaignsInternships',
  components: {
    CampaignsMentorInternships,
    CampaignsAdminInternships,
  },
})
export default class extends Vue {
  private roleView = 'campaigns-mentor-internships';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'admin') {
      this.roleView = 'campaigns-admin-internships';
    } else {
      this.roleView = 'campaigns-mentor-internships';
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
