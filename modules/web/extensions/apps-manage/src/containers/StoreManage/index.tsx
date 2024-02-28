import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@kubed/stook';
import { Appcenter, Pen } from '@kubed/icons';
import { Banner, Button, Field, notify } from '@kubed/components';
import { useDisclosure } from '@kubed/hooks';
import {
  Image,
  Icon,
  DeleteConfirmModal,
  StatusIndicator,
  CreateApp,
  AppDataTable,
  useItemActions,
  useTableActions,
  getWorkspacesAliasName,
  openpitrixStore,
  getLocalTime,
  getAuthKey,
  transferAppStatus,
  getAnnotationsAliasName,
  getAnnotationsDescription,
  getDisplayName,
  getUserAliasName,
  AppType,
} from '@ks-console/shared';
import { AppTemplateEdit } from '../../components/AppTemplateEdit';
// import Image from '../../Image';
// import Icon from '../../Icon';
// import { DeleteConfirmModal } from '../../Modals/DeleteConfirm';
// import StatusIndicator from '../../StatusIndicator';
//
// import CreateApp from '../AppCreate';
//
// import AppDataTable from '../AppDataTable';
// import AppTemplateEdit from '../../Modals/AppTemplateEdit';
// import { useItemActions, useTableActions } from '../../../hooks';
// import {
//   getLocalTime,
//   getAuthKey,
//   transferAppStatus,
//   getAnnotationsAliasName,
//   getAnnotationsDescription,
//   getDisplayName,
//   getUserAliasName,
// } from '../../../utils';
// import { getWorkspacesAliasName } from '../../../utils/caches';
// import { openpitrixStore } from '../../../stores';
// import { AppType } from '../../../types';
// import type { Column } from '../../DataTable';
import type { AppDetail, Column } from '@ks-console/shared';

const { deleteApp, useCategoryList } = openpitrixStore;

const AddButton = styled(Button)`
  min-width: 96px;
`;

export const TableItemField = styled(Field)`
  .field-avatar {
    span {
      margin-right: 0;
    }
  }

  .field-value {
    cursor: pointer;
  }

  .field-label {
    max-width: 300px;
  }
`;

export function StoreManage(): JSX.Element {
  const params = useParams();
  const { workspace } = params;
  const tableRef = useRef();
  const [selectData, setSelectedApp] = useStore<AppDetail>('selectedApp');
  const { data: categories } = useCategoryList({
    options: {
      format: item => {
        const name = getAnnotationsAliasName(item) || item.metadata.name;
        return {
          value: item?.metadata?.name,
          label: name === 'kubesphere-app-uncategorized' ? t('APP_CATE_UNCATEGORIZED') : name,
        };
      },
    },
  });
  const { isOpen, open, close } = useDisclosure(false);
  const [isInit, setInit] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const authKey = getAuthKey(workspace && 'app-templates');
  useEffect(() => {
    // TODO 临时fix列表被压缩问题，默认隐藏2个字段
    if (!localStorage.getItem('tableState:APP')) {
      localStorage.setItem(
        'tableState:APP',
        '{"selectedRowIds":{},"pageSize":10,"pageIndex":0,"sortBy":[{"id":"createTime","desc":true}],"filters":[],"hiddenColumns":["maintainers","category_set"]}',
      );
    }
    setInit(true);
  }, []);

  async function handleDelete() {
    await deleteApp({ appName: selectData.metadata.name, workspace });
    setDelVisible(false);
    // @ts-ignore TODO
    tableRef?.current?.refetch();
    notify.success(t('DELETED_SUCCESSFULLY'));
  }

  const renderItemActions = useItemActions<AppDetail>({
    params,
    authKey,
    actions: [
      {
        key: 'edit',
        icon: <Pen />,
        text: t('EDIT'),
        action: 'edit',
        onClick: (_, app) => {
          setSelectedApp(app);
          setEditVisible(true);
        },
      },
      {
        key: 'delete',
        icon: <Icon name="trash" />,
        text: t('DELETE'),
        action: 'delete',
        onClick: (_, record) => {
          setDelVisible(true);
          setSelectedApp(record);
        },
      },
    ],
  });

  const columns: Column<AppDetail>[] = [
    {
      title: t('NAME'),
      field: 'metadata.name',
      width: '20%',
      searchable: true,
      render: (name, app) => {
        return (
          <TableItemField
            onClick={() => setSelectedApp(app as AppDetail)}
            label={getAnnotationsDescription(app)}
            value={<Link to={`${name}?appType=${app.spec.appType}`}>{getDisplayName(app)}</Link>}
            avatar={
              <Image
                iconSize={40}
                src={app.spec.icon}
                isBase64Str={!!app.spec.icon}
                iconLetter={app.spec.appType}
              />
            }
          />
        );
      },
    },
    {
      title: t('STATUS'),
      field: 'status.state',
      canHide: true,
      width: '10%',
      render: status => (
        // @ts-ignore TODO
        <StatusIndicator type={status}>{transferAppStatus(status)}</StatusIndicator>
      ),
    },
    {
      title: t('WORKSPACE'),
      field: 'metadata.labels["kubesphere.io/workspace"]',
      canHide: true,
      width: '15%',
      render: (_, record) =>
        getWorkspacesAliasName(record?.metadata.labels['kubesphere.io/workspace']),
    },
    {
      title: t('DEVELOPER'),
      field: 'maintainers',
      canHide: true,
      width: '10%',
      // @ts-ignore TODO
      render: (_, record) => {
        const user =
          record?.metadata.annotations?.['application.kubesphere.io/app-maintainers'] || '-';
        return getUserAliasName(user);
      },
    },
    {
      title: t('LATEST_VERSION'),
      field: 'metadata.resourceVersion',
      canHide: true,
      width: '10%',
      // @ts-ignore TODO
      render: (_, record) =>
        record?.metadata.annotations?.['application.kubesphere.io/latest-app-version'] || '-',
    },
    {
      title: t('CATEGORY'),
      field: 'category_set',
      canHide: true,
      width: '10%',
      // @ts-ignore TODO
      render: (_, record) => {
        const label = record?.metadata?.labels?.['application.kubesphere.io/app-category-name'];
        const aliasName = (categories as unknown as { label: string; value: string }[])?.find(
          item => item.value === label,
        );
        if (aliasName) {
          return aliasName.label;
        }

        if (label === 'kubesphere-app-uncategorized') {
          return t('APP_CATE_UNCATEGORIZED');
        }
        return t(`APP_CATE_${label?.toUpperCase().replace(/[^A-Z]+/g, '_')}`, {
          defaultValue: label || '-',
        });
      },
    },
    {
      title: t('App Templates'),
      field: 'spec.appType',
      canHide: true,
      width: '10%',
      // @ts-ignore
      render: types => AppType[types as typeof AppType],
    },
    {
      title: t('UPDATE_TIME_TCAP'),
      field: 'status.updateTime',
      canHide: true,
      width: '200px',
      render: time =>
        getLocalTime((time as string) || new Date().toDateString()).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      id: 'more',
      title: '',
      width: 20,
      render: renderItemActions as unknown as () => ReactNode,
    },
  ];
  function getActions() {
    if (!workspace) {
      return [];
    }
    return [
      {
        key: 'create',
        text: t('CREATE'),
        action: 'create',
        onClick: () => open(),
        props: {
          color: 'secondary',
          shadow: true,
        },
      },
    ];
  }

  const tableActions = useTableActions({
    authKey,
    params,
    actions: getActions(),
  });

  function editSuccess() {
    // @ts-ignore TODO
    tableRef?.current?.refetch();
  }

  return (
    <>
      <Banner
        className="mb12"
        icon={<Appcenter />}
        title={t('App Templates')}
        description={t('APP_STORE_DESC')}
      />
      {isInit && (
        <AppDataTable
          filter
          tableRef={tableRef}
          // @ts-ignore TODO
          columns={columns}
          workspace={workspace}
          toolbarRight={tableActions()}
          emptyOptions={{
            withoutTable: true,
            image: <Appcenter size={48} />,
            title: t('NO_APP_DESC_FOUND'),
            description: t('APP_CATEGORY_EMPTY_DESC'),
            createButton: !!tableActions() && workspace && (
              <AddButton color="secondary" onClick={() => open()}>
                {t('ADD')}
              </AddButton>
            ),
          }}
        />
      )}
      <CreateApp visible={isOpen} workspace={workspace} onCancel={close} tableRef={tableRef} />
      {delVisible && (
        <DeleteConfirmModal
          visible={true}
          type="APP_REPOSITORY"
          resource={selectData?.metadata.name}
          onOk={handleDelete}
          onCancel={() => setDelVisible(false)}
          confirmLoading={false}
        />
      )}
      <AppTemplateEdit
        onCancel={() => setEditVisible(false)}
        visible={editVisible}
        detail={selectData}
        success={editSuccess}
      />
    </>
  );
}

export default StoreManage;
