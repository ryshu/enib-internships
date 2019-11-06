<template>
  <div class="app-container">
    <component :is="roleView" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import CampaignsMentorPropositions from './mentor/propositions.vue';
import CampaignsAdminPropositions from './admin/propositions.vue';

@Component({
  name: 'CampaignsPropositions',
  components: {
    CampaignsMentorPropositions,
    CampaignsAdminPropositions,
  },
})
export default class extends Vue {
  private roleView = 'campaigns-mentor-propositions';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'admin') {
      this.roleView = 'campaigns-admin-propositions';
    } else {
      this.roleView = 'campaigns-mentor-propositions';
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
