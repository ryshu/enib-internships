<template>
  <div class="app-container">
    <component :is="roleView" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '../../store/modules/user';

import InternshipsStudentSuggest from './student/suggest.vue';
import InternshipsMentorSuggest from './mentor/suggest.vue';

@Component({
  name: 'InternshipsSuggest',
  components: {
    InternshipsStudentSuggest,
    InternshipsMentorSuggest,
  },
})
export default class extends Vue {
  private roleView = 'internships-student-suggest';

  get role() {
    return UserModule.role;
  }

  changeRole(role: string) {
    if (role === 'default') {
      this.roleView = 'internships-mentor-suggest';
    } else {
      this.roleView = 'internships-student-suggest';
    }
  }

  created() {
    this.changeRole(this.role);
  }

  @Watch('role')
  onRoleChange(val: string) {
    this.changeRole(val);
  }
}
</script>
