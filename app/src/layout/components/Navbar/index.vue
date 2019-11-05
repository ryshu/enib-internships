<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <lang-select class="right-menu-item hover-effect" />
      </template>
      <div class="right-menu-item hover-effect">
        <el-dropdown trigger="click" class="international" @command="handleSetRole">
          <div>
            <svg-icon name="password" class="password-icon" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="role === 'student'" command="student">Etudiant</el-dropdown-item>
            <el-dropdown-item :disabled="role === 'default'" command="default">Professeur</el-dropdown-item>
            <el-dropdown-item :disabled="role === 'admin'" command="admin">Admin</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div>
          <i class="el-icon-user-solid"></i>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/">
            <el-dropdown-item>{{ $t('navbar.profile') }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AppModule } from '../../../store/modules/app';
import { UserModule } from '../../../store/modules/user';
import Breadcrumb from '../../../components/Breadcrumb/index.vue';
import ErrorLog from '../../../components/ErrorLog/index.vue';
import Hamburger from '../../../components/Hamburger/index.vue';
import LangSelect from '../../../components/LangSelect/index.vue';

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    ErrorLog,
    Hamburger,
    LangSelect,
  },
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar;
  }

  get device() {
    return AppModule.device.toString();
  }

  get role() {
    return UserModule.role;
  }

  private handleSetRole(role: string) {
    UserModule.changeRole(role).then(() => {
      this.$message({
        message: 'Switch Role Success',
        type: 'success',
      });
    });
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false);
  }

  private async logout() {
    window.location.assign('/logout');
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
