import React from 'react';
import { Form, FormItem, Select, useForm } from '@kubed/components';
import { FullScreenModal } from './styles';

interface Props {
  visible?: boolean;
  data: any[];
  onOk?: (value: { cluster: string }) => void;
  onCancel?: () => void;
}

function BindClusterModal({ visible, onOk, onCancel, data = [] }: Props) {
  const [form] = useForm();
  console.log(data);
  const options = data.map(item => ({
    label: item.aliasName || item.name,
    value: item.name,
  }));

  function onFinish() {
    form.validateFields().then(() => {
      const data = form.getFieldsValue(true);
      onOk?.(data);
    });
  }
  const handleOk = () => form.submit();

  return (
    <FullScreenModal
      title={t('EDGEWIZE_CLUSTER_SETTING')}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} onFinish={onFinish}>
        <FormItem
          label={t('EDGEWIZE_CLUSET')}
          name={['cluster']}
          rules={[
            {
              required: true,
              message: t('EDGEWIZE_SELECT_CLUSTER_PLACEHOLDER'),
            },
          ]}
        >
          <Select placeholder={t('EDGEWIZE_SELECT_CLUSTER_PLACEHOLDER')} options={options} />
        </FormItem>
      </Form>
    </FullScreenModal>
  );
}

export default BindClusterModal;
