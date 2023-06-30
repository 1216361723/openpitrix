import React, { useMemo } from 'react';
import cx from 'classnames';

import { CategoryDetail, Icon, isUnCategorizedCtg } from '@ks-console/shared';

import { Actions, Category, Others } from './styles';

type Props = {
  detail: CategoryDetail;
  isActive: boolean;
  onSelectCategory: (item: CategoryDetail) => void;
  onEditCategory?: (item: CategoryDetail) => void;
  onDeleteCategory?: (item: CategoryDetail) => void;
};

function CategoryItem({
  detail,
  isActive,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
}: Props): JSX.Element {
  const iconName = useMemo(() => {
    if (['uncategorized', ''].includes(detail?.description || '')) {
      return 'tag';
    }

    return detail?.description;
  }, [detail?.description]);

  return (
    <Category onClick={() => onSelectCategory(detail)} className={cx({ active: isActive })}>
      {iconName && <Icon size={16} className="mr12" name={iconName} />}
      {t(`APP_CATE_${detail?.name?.toUpperCase().replace(/[^A-Z]+/g, '_')}`, {
        defaultValue: detail?.name,
      })}
      <Others>
        <span className="total_count">{detail?.app_total || 0}</span>
        {!isUnCategorizedCtg(detail?.category_id) && (
          <Actions className="actions">
            <Icon
              name="trash"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteCategory?.(detail);
              }}
            />
            <Icon
              name="pen"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onEditCategory?.(detail);
              }}
            />
          </Actions>
        )}
      </Others>
    </Category>
  );
}

export default CategoryItem;
