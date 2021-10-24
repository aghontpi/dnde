import { Form, Row, Col, Input } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useEditor } from '../../Hooks/Editor.hook';

interface TitleProps {
  itemIndex: number;
}

const Title = ({ itemIndex: index }: TitleProps) => {
  const [value, setValue] = useState();
  const { mjmlJson, setMjmlJson } = useEditor();

  useEffect(() => {
    if (index !== -1) {
      const titleConfig = mjmlJson.children[0].children[index];
      if (titleConfig && titleConfig.content) {
        setValue(titleConfig.content);
      }
    }
  }, [index]);

  const handleChange = (e: any) => {
    if (index !== -1) {
      setValue(e.target.value);
    }
  };

  const onBlur = (e: any) => {
    if (e && index !== -1) {
      let titleConfig = _.cloneDeep(mjmlJson.children[0].children[index]);
      if (titleConfig) {
        titleConfig['content'] = e.target.value;
        const update = _.set(mjmlJson, `children[0].children[${index}]`, titleConfig);
        setMjmlJson({ ...update });
      }
    }
  };

  return (
    <Form.Item>
      <Row>
        <Col span={24}>
          <Input addonBefore="title" value={value} onBlur={onBlur} onChange={handleChange} />
        </Col>
      </Row>
    </Form.Item>
  );
};

export { Title };
