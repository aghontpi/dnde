import { message } from 'antd';

const success = (msg: string) => {
  message.success(msg);
};

const error = (msg: string) => {
  message.error(msg);
};

const warning = (msg: string) => {
  message.warning(msg);
};

export { success, error, warning };
