import _ from 'lodash';
import { ChangeEvent } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';
import { Col, Input, Row } from 'antd';
import { useValue, useVisibility } from '../../Hooks/Attribute.hook';
import Form from 'rc-field-form/es/Form';
import FormItem from 'antd/lib/form/FormItem';

const ATTRIBUTE = 'href';

const Link = () => {
  const [visible, path] = useVisibility();
  const { mjmlJson, setMjmlJson } = useEditor();

  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });

  //todo: check if changing directly to mjmlJson causes perfomance impact
  //   if so, then maintain a local state, then on change change the value first,
  //   then by using useeffect listen for the in localvalue, then update the mjmlJson.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (path && visible) {
      let json = {};
      let element = _.get(mjmlJson, path);
      element.attributes[ATTRIBUTE] = value;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  return visible ? (
    <FormItem>
      <Row>
        <Col span={24}>
          <Input addonBefore={ATTRIBUTE} onChange={(e) => handleChange(e)} value={getValue()} />
        </Col>
      </Row>
    </FormItem>
  ) : null;
};

export { Link };
