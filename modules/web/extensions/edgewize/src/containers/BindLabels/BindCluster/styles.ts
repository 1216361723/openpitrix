import { Modal } from '@kubed/components';
import styled from 'styled-components';

export const FullScreenModal = styled(Modal)`
  position: relative;
  margin: 0;
  .kubed-modal-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .kubed-modal-body {
      padding: 20px;
      flex: 1;
    }
  }
`;
