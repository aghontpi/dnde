import { Form, Row, Col, Input } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';

const STYLEPATH = `children[0].children[1]`;

const CustomCss = () => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (mjmlJson) {
      const style = mjmlJson.children[0].children[1];
      if (style && style.tagName.includes('style')) {
        const _value = style.content;
        setValue(_value);
      }
    }
  }, []);

  useEffect(() => {
    if (mjmlJson && isActive === false) {
      const style = mjmlJson.children[0].children[1];
      if (style && style.tagName.includes('style')) {
        const _value = style.content;
        setValue(_value);
      }
    }
  }, [mjmlJson]);

  const handleChange = (e: any) => {
    let content = e.target.value;
    setValue(content);
    if (content) {
      let item = _.get(_.cloneDeep(mjmlJson), STYLEPATH);
      if (item && item.tagName.includes('style')) {
        item.content = content;
        const update = _.set(mjmlJson, STYLEPATH, item);
        setMjmlJson({ ...update });
      }
    }
  };

  const blurHandler = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsActive(false);
    }
  };

  const focusHandler = (e: any) => {
    setIsActive(true);
  };

  return (
    <Form.Item>
      <Row gutter={[0, 8]}>
        <Col span={24}>{/* <span className="ant-form-item-label">Content:</span> */}</Col>
        <Col span={24}>
          <Input.TextArea
            spellCheck={false}
            rows={24}
            onFocus={focusHandler}
            onBlur={blurHandler}
            onChange={handleChange}
            value={value}
          />
        </Col>
      </Row>
    </Form.Item>
  );
};

export { CustomCss };
