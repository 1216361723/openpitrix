import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useStore } from '@kubed/stook';
import { Appcenter, Pen } from '@kubed/icons';
import { Banner, Button, Field, notify, Tooltip } from '@kubed/components';
import {
  Image,
  Icon,
  DeleteConfirmModal,
  StatusIndicator,
  useItemActions,
  useTableActions,
  getWorkspacesAliasName,
  openpitrixStore,
  workspaceStore,
  getLocalTime,
  getAuthKey,
  transferAppStatus,
  getAnnotationsAliasName,
  getAnnotationsDescription,
  getDisplayName,
  getUserAliasName,
  useV3action,
} from '@ks-console/shared';

import type { AppDetail, Column } from '@ks-console/shared';
import { AppDataTable } from '../../components/AppDataTable';
import { AppTemplateEdit } from '../../components/AppTemplateEdit';

const { deleteApp, useCategoryList } = openpitrixStore;
const { useFetchWorkspaceQuery } = workspaceStore;

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
  const { open, render: RenderTemplate } = useV3action();

  const tableRef = useRef();
  const { data: workspaces } = useFetchWorkspaceQuery({ workspace });
  const cluster = workspaces?.metadata?.labels?.['cluster-role.kubesphere.io/edge'];

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
  function handleOpen() {
    open({
      action: 'app.template.create.v2',
      v3Module: 'edgeStore',
      module: 'apptemplates',
      workspace,
      cluster: 'host',
      onlyDockerHub: false,
      v3StoreParams: {
        module: 'edgeappsets',
      },
      success: () => {
        tableRef?.current?.refetch();
      },
      // onOk: (val: any) => {
      //   console.log(123, val);
      // },
    });
  }
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
                iconLetter={getDisplayName(app)}
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
        disabled: !cluster,
        onClick: () => handleOpen(),
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
              <Tooltip disabled={!!cluster} content={t('EDGEWIZE_NEED_ADD_LABEL')}>
                <span>
                  <AddButton color="secondary" disabled={!cluster} onClick={() => handleOpen()}>
                    {t('ADD')}
                  </AddButton>
                </span>
              </Tooltip>
            ),
          }}
        />
      )}
      {RenderTemplate()}
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
