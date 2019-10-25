<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { UserModule } from '../../store/modules/user';

import Account from './components/Account.vue';
import Activity from './components/Activity.vue';
import Timeline from './components/Timeline.vue';
import UserCard from './components/UserCard.vue';

export interface IProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const defaultProfile: IProfile = {
  name: 'Loading...',
  email: 'Loading...',
  avatar: 'Loading...',
  role: 'Loading...',
};

@Component({
  name: 'Profile',
  components: {
    Account,
    Activity,
    Timeline,
    UserCard,
  },
})
export default class extends Vue {
  private user = defaultProfile;
  private activeTab = 'activity';

  get fullName() {
    return `${UserModule.firstName} ${UserModule.lastName}`;
  }

  get email() {
    return UserModule.email;
  }

  get avatar() {
    return UserModule.avatar;
  }

  get role() {
    return UserModule.role;
  }

  created() {
    this.getUser();
  }

  private getUser() {
    this.user = {
      name: this.fullName,
      email: this.email,
      avatar: this.avatar,
      role: this.role,
    };
  }
}
</script>
