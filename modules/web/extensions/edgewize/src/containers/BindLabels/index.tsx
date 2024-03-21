import React from 'react';
import { Banner, BannerTip } from '@kubed/components';
import { Dashboard } from '@kubed/icons';

import ClusterBaseInfo from './Clusters';

export default function Overview() {
  return (
    <>
      <Banner
        icon={<Dashboard />}
        title={t('EDGEWIZE_LABELS')}
        description={t('EDGEWIZE_LABELS_DESC')}
        className="mb12"
      >
        <BannerTip key="1" title={t('边缘业务是否有特殊性?')}>
          {t(
            '一旦确定是边缘空间，无法转变为普通企业空间，边缘集群空间属于企业空间。且边缘集群空间里面允许用户创建边缘模板应用。其他和企业空间无任何差异。',
          )}
        </BannerTip>
      </Banner>
      <ClusterBaseInfo />
    </>
  );
}
