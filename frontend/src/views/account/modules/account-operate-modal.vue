<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { accountTypeRecord, enableStatusOptions } from '@/constants/business';
import { fetchCreateAccount, fetchUpdateAccount } from '@/service/api';
import { AccountType } from '@/enum';
import { transformRecordToOption } from '@/utils/common';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.AccountManage.Account | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.account.addAccount'),
    edit: $t('page.account.editAccount')
  };
  return titles[props.operateType];
});

type Model = Pick<Api.AccountManage.Account, 'cookie' | 'status' | 'account' | 'password' | 'accountType'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    cookie: '',
    status: 1,
    account: '',
    password: '',
    accountType: AccountType.GOOGLE
  };
}

type RuleKey = Extract<keyof Model, 'cookie' | 'account' | 'password'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  cookie: defaultRequiredRule,
  account: defaultRequiredRule,
  password: defaultRequiredRule
};

function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  if (props.operateType === 'add') {
    fetchCreateAccount(model).then(() => {
      window.$message?.success($t('common.addSuccess'));
      closeDrawer();
      emit('submitted');
    });
  } else {
    fetchUpdateAccount(model).then(() => {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer();
      emit('submitted');
    });
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem :label="$t('page.account.account')" path="account">
        <NInput v-model:value="model.account" :placeholder="$t('page.account.account')" />
      </NFormItem>
      <NFormItem :label="$t('page.account.password')" path="password">
        <NInput v-model:value="model.password" :placeholder="$t('page.account.password')" />
      </NFormItem>

      <NFormItem :label="$t('page.account.cookie')" path="cookie">
        <NInput v-model:value="model.cookie" type="textarea" :placeholder="$t('page.account.cookie')" />
      </NFormItem>
      <NFormItem :label="$t('page.account.accountType')">
        <NSelect
          v-model:value="model.accountType"
          :placeholder="$t('page.account.accountType')"
          :options="transformRecordToOption(accountTypeRecord)"
        />
      </NFormItem>
      <NFormItem :label="$t('page.account.status')" path="status">
        <NRadioGroup v-model:value="model.status">
          <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
        </NRadioGroup>
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
