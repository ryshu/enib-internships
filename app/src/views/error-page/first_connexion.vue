<template>
  <div class="first-connexion-container">
    <el-form
      ref="dataForm"
      :model="userData"
      label-position="left"
      label-width="200px"
      status-icon
      style="width: 100%; padding: 0 20px;"
    >
      <h1 style="padding-bottom: 20px;" align="center">
        {{ $t('route.users.first') }}
      </h1>
      <el-form-item style="padding-left: 270px">{{
        $t('route.firstConnexion.description')
      }}</el-form-item>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            :label="$t('route.firstConnexion.firstName')"
            prop="firstName"
            :rules="[
              {
                required: true,
                message: $t('form.firstConnexion.firstName.required'),
              },
            ]"
          >
            <el-input
              v-model="userData.firstName"
              :placeholder="$t('firstConnexion.placeholder.firstName')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            :label="$t('route.firstConnexion.lastName')"
            prop="lastName"
            :rules="[
              {
                required: true,
                message: $t('form.firstConnexion.lastName.required'),
              },
            ]"
          >
            <el-input
              v-model="userData.lastName"
              :placeholder="$t('firstConnexion.placeholder.lastName')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="role === 'student'">
        <el-col :span="8">
          <el-form-item
            :label="$t('route.firstConnexion.semester')"
            prop="semester"
          >
            <el-input
              v-model="userData.semester"
              :placeholder="$t('firstConnexion.placeholder.semester')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-footer">
        <el-button type="primary" @click="agree">{{
          $t('table.confirm')
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import moment from 'moment';
import countryList from 'country-list';
import { Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';

import { defaultStudentData, updateStudent } from '../../api/students';

import { UserModule } from '../../store/modules/user';
import { defaultMentorData, updateMentor } from '../../api/mentors';

enum MessageType {
  INITIALIZED = 1,
  PROCESSING = 2,
  STOP = 3,
}

@Component({ name: 'first_connexion' })
export default class extends Vue {
  private userData: any = this.getDefaultData();

  private cnt: number = 0;
  private max: number = 1;

  get role() {
    return UserModule.role;
  }

  public getDefaultData() {
    const tmp: any = cloneDeep(
      this.role === 'student' ? defaultStudentData : defaultMentorData
    );
    delete tmp.email;
    delete tmp.role;

    return tmp;
  }
  private async agree() {
    const valid = await (this.$refs['dataForm'] as Form).validate();
    if (valid) {
      const tmp = cloneDeep(this.userData);
      this.role === 'student'
        ? await updateStudent(UserModule.id, tmp)
        : await updateMentor(UserModule.id, tmp);

      await UserModule.refresh();

      this.$router.push(`/`);
    }
  }
}
</script>

<style lang="scss">
.dialog-footer {
  width: 100%;
  padding: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    margin: 0 20px;
  }
}
.el-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
