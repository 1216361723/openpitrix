import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Cluster } from '@kubed/icons';
import styled from 'styled-components';
import { SmartEdgeConfiguration } from '@kubed/icons';
import { useModal } from '@kubed/components';
import {
  NavMenu,
  NavTitle,
  useGlobalStore,
  ListPageSide,
  isMultiCluster,
} from '@ks-console/shared';
import { navs as navMenus } from './contants';
import { getClustersRole } from '../../stores/index';
import ClusterSelectorModal from './ClusterSelectorModal';

const PageMain = styled.div`
  margin-left: 240px;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NAV_KEY = 'CLUSTER_NAV';

function ListLayout(): JSX.Element {
  const location = useLocation();
  const { cluster = '' } = useParams();
  const navigate = useNavigate();
  const modal = useModal();

  const { getNav, setNav } = useGlobalStore();
  let navs = getNav(NAV_KEY);
  const [prefix, setPrefix] = useState('/v2/edgewize');
  const [title, setTitle] = useState(cluster);
  const [subTitle, setSubTitle] = useState('');

  useEffect(() => {
    const navs2 = getClustersRole(cluster);

    // TODO 需要处理权限
    setNav(NAV_KEY, navMenus);
    setPrefix(`/v2/edgewize/clusters/${cluster}`);
    setTitle(cluster);
    setSubTitle(t('EDGEWIZE_CLUSET'));
  }, [cluster]);

  const handleSelect = (modalId: string, selectedCluster: any) => {
    navigate(`/v2/edgewize/clusters/${selectedCluster.name}/node-groups`);
    modal.close(modalId);
  };

  const openClusterSelector = () => {
    if (isMultiCluster()) {
      const modalId = modal.open({
        title: t('CLUSTER_PL'),
        description: t('CLUSTER_DESC'),
        footer: null,
        titleIcon: <Cluster size={40} />,
        width: 960,
        content: (
          <ClusterSelectorModal
            onSelect={selectedCluster => handleSelect(modalId, selectedCluster)}
          />
        ),
      });
    }
  };

  return (
    <>
      <ListPageSide>
        <NavTitle
          icon={<SmartEdgeConfiguration variant="light" size={40} />}
          title={t(title)}
          subtitle={subTitle}
          style={{ marginBottom: '20px' }}
          onClick={openClusterSelector}
        />
        {navs && <NavMenu navs={navs} prefix={prefix} pathname={location.pathname} />}
      </ListPageSide>
      <PageMain>
        <Outlet />
      </PageMain>
    </>
  );
}

export default ListLayout;
