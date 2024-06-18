<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { fetchDeleteAccount, fetchGetAccountList } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { accountTypeRecord, enableStatusRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import AccountSearch from './modules/account-search.vue';
import AccountOperateModal from './modules/account-operate-modal.vue';

const appStore = useAppStore();

const { columns, columnChecks, data, getData, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetAccountList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    status: null
  },
  columns: () => [
    {
      key: 'id',
      title: $t('page.account.id'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'account',
      title: $t('page.account.account'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'accountType',
      title: $t('page.account.accountType'),
      align: 'center',
      minWidth: 100,
      render: row => accountTypeRecord[row.accountType]
    },
    {
      key: 'credit',
      title: $t('page.account.credit'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'count',
      title: $t('page.account.count'),
      align: 'center',
      width: 120
    },
    {
      key: 'status',
      title: $t('page.account.status'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          0: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'createTime',
      title: $t('page.account.common.createTime'),
      align: 'center',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'updateTime',
      title: $t('page.account.common.updateTime'),
      align: 'center',
      minWidth: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData);

async function handleBatchDelete() {
  // request

  onBatchDeleted();
}

function handleDelete(id: number) {
  fetchDeleteAccount(id).then(() => {
    onDeleted();
  });
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <AccountSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard :title="$t('page.account.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>

    <AccountOperateModal
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getData"
    ></AccountOperateModal>
  </div>
</template>

<style scoped></style>
