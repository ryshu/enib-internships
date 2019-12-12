<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import CampaignsAdminMentorsList from './admin/mentors.vue';

@Component({ name: 'CampaignsMentorsList',
  components: {
    CampaignsAdminMentorsList,} })

export default class extends Vue {
  private roleView = 'campaigns-admin-mentors';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'admin') {
      this.roleView = 'campaigns-admin-mentors';
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
