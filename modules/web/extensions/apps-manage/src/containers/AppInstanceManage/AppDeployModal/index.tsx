import React, { useRef, useState } from 'react';
import { Firewall } from '@kubed/icons';
import { useParams } from 'react-router-dom';
import { Modal } from '@kubed/components';
import AppDeploy from '../../AppDeploy';

type Props = {
  visible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

function AppDeployModal({ onCancel }: Props): JSX.Element {
  const { workspace = '' } = useParams();
  const [visible, setVisible] = useState(true);
  const modals = useRef(null);
  function handleClose() {
    setVisible(false);
    onCancel?.();
  }
  function handleOk(): void {
    console.log(33);
  }

  return (
    <Modal
      ref={modals}
      width={691}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      titleIcon={<Firewall size={20} />}
      title={'APP_DEPLOY'}
      footer={null}
    >
      <AppDeploy close={handleClose} onOk={handleOk} appName="configyaml-testyaml" />
    </Modal>
  );
}

export default AppDeployModal;
