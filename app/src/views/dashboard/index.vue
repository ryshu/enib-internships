<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import AdminDashboard from './admin/index.vue';
import MentorDashboard from './mentor/index.vue';
import StudentDashboard from './student/index.vue';

@Component({
  name: 'Dashboard',
  components: {
    AdminDashboard,
    MentorDashboard,
    StudentDashboard,
  },
})
export default class extends Vue {
  private currentRole = 'admin-dashboard';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'admin') {
      this.currentRole = 'admin-dashboard';
    } else if(role === 'default') {
      this.currentRole = 'mentor-dashboard';
    } else {
      this.currentRole = 'student-dashboard';
    }
  }

  @Watch('role')
  onRoleChange(val: string) {
    this.changeRole(val);
  }

  created() {
    this.changeRole(this.role);
  }
}
</script>
