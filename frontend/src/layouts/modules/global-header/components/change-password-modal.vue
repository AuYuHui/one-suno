<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchUpdateUserInfo } from '@/service/api';

defineOptions({
  name: 'ChangePasswordModal'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type Model = Record<'password', string>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    password: ''
  };
}

type RuleKey = Extract<keyof Model, 'password'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  password: defaultRequiredRule
};

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  fetchUpdateUserInfo(model.password).then(() => {
    window.$message?.success($t('common.updateSuccess'));
    closeDrawer();
  });
}

watch(visible, () => {
  if (visible.value) {
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="$t('common.changePassword')" preset="card" class="w-480px">
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem :label="$t('page.manage.user.password')" path="password">
        <NInput v-model:value="model.password" :placeholder="$t('page.manage.user.form.password')" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace :size="16" reverse>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
