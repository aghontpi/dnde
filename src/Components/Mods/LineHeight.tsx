import { Col, Input, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';

const ATTRIBUTE = 'line-height';

const LineHeight = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState<string>('100%');
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });

  useEffect(() => {
    if (visible && path) {
      let value = getValue();
      setValue(value);
    }
  }, [visible, path]);

  const onChange = (e: any) => {
    setValue(e.target.value);
    if (visible && path && e && e.target) {
      if (typeof e.target.value === 'number' && e.target.value < 0) {
        e.target.value = 0;
      }
      SetValue(e.target.value.toString(), path, mjmlJson, setMjmlJson);
    }
  };

  const addonBeforeClick = () => {
    changeValue(visible, value, mjmlJson, path, setValue, setMjmlJson, 'dec');
  };

  const addonAfterClick = () => {
    changeValue(visible, value, mjmlJson, path, setValue, setMjmlJson, 'inc');
  };

  return visible ? (
    <FormItem>
      <Row>
        <Col flex="auto">Line Height:</Col>

        <Col flex="none">
          <IncrementDecrementInput
            onChange={onChange}
            addonBefore={<span onClick={addonBeforeClick}>-</span>}
            addonAfter={<span onClick={addonAfterClick}>+</span>}
            value={value}
            style={{ width: `${value ? value.toString().length + 12 : 12}ch ` }}
          />
        </Col>
      </Row>
    </FormItem>
  ) : null;
};

const IncrementDecrementInput = styled(Input)`
  .ant-input-group-addon {
    cursor: pointer;
    user-select: none;
    padding:0px;
    &:hover {
      color: #40a9ff;
    }
    span{
        padding 0 11px;
    }
  }
`;

const changeValue = (
  visible: boolean | null,
  value: string,
  mjmlJson: any,
  path: string,
  setValue: (arg: string) => void,
  setMjmlJson: (arg: any) => void,
  type: 'inc' | 'dec'
) => {
  if (visible && value) {
    let existingValue: string | number = value;
    let copy = value;
    let increment;
    if (existingValue.includes('%')) {
      increment = type === 'inc' ? +10 : -10;
      existingValue = existingValue.split('%')[0];
      existingValue = parseInt(existingValue);
    } else {
      increment = type === 'inc' ? +1 : -1;
      existingValue = parseInt(existingValue);
    }
    const toSearch = existingValue;
    let valueIncrementNumber = Math.max(existingValue + increment, 0);
    const valueToSet = copy.replace(toSearch.toString(), valueIncrementNumber.toString());
    setValue(valueToSet);
    SetValue(valueToSet.toString(), path, mjmlJson, setMjmlJson);
  }
};

const SetValue = (valueToSet: string, path: string, mjmlJson: any, setMjmlJson: (arg: any) => void) => {
  let item = _.get(mjmlJson, path);
  if (item) {
    if (item.attributes) {
      item.attributes[ATTRIBUTE] = valueToSet;
      const updated = _.set(mjmlJson, path, item);
      if (updated) {
        setMjmlJson({ ...updated });
      }
    }
  }
};

export { LineHeight };
