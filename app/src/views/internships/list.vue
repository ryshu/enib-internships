<template>
  <div class="app-container">
    <component :is="roleView" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import InternshipsStudentList from './student/list.vue';
import InternshipsMentorList from './mentor/list.vue';

@Component({
  name: 'InternshipsList',
  components: {
    InternshipsStudentList,
    InternshipsMentorList,
  },
})
export default class extends Vue {
  private roleView = 'internships-student-list';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'default') {
      this.roleView = 'internships-mentor-list';
    } else {
      this.roleView = 'internships-student-list';
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
