import { Modal as M } from "antd";
import { ReactNode, useState } from "react";

interface ModalProps {
  okClick: () => void;
  visible: boolean;
  children: ReactNode;
}

export const Modal = ({ okClick, visible, children }: ModalProps) => {
  const [isVisible, setVisible] = useState(false);

  setVisible(visible);

  return (
    <M title="Basic Modal" visible={isVisible} onOk={okClick}>
      {children}
    </M>
  );
};
