import _ from 'lodash';
import styled from 'styled-components';
import { useEditor } from '../../Hooks/Editor.hook';
import { Form, Input } from 'antd';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  line-height: 2;
  label {
    font-size: 16px;
    font-weight: bold;
  }
  input {
    border: 1px solid black;
    width: 70%;
    min-height: 26px;
    border-radius: 2px;
    :focus-visible {
      outline: unset;
    }
  }
`;

export const BorderRadius = () => {
  const { active, setActive, mjmlJson } = useEditor();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (active && e.target.value) {
      if (e.target.value === '') {
        e.target.value = 'none';
      }
      const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
      setActive({ ...active, change: { ...attributes, 'border-radius': e.target.value } });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (active) {
        const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
        let value = attributes['border-radius'];
        const re = new RegExp(/^\d+/);
        const match = re.exec(value);
        let matchedValue = match ? parseInt(match[0]) : 0;
        if (e.key === 'ArrowUp') {
          value = value.replace(/^\d+/, matchedValue + 1);
        } else if (e.key === 'ArrowDown' && matchedValue > 0) {
          value = value.replace(/^\d+/, matchedValue - 1);
        }
        setActive({ ...active, change: { ...attributes, 'border-radius': value } });
      }
    }
  };

  let value = '';
  if (active.path) {
    value = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-radius');
  }

  return active.path ? (
    <Form.Item label="Border Radius">
      <Input onChange={handleChange} value={value} onKeyDown={onKeyDown} />
    </Form.Item>
  ) : null;
};
