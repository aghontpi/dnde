import { Button, Col, Input, Popover, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useState } from 'react';

const AddCustomFonts = () => {
  return (
    <FormItem>
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Popover trigger="click" placement="bottom" content={GetFontsValue}>
            <Button>Add custom font</Button>
          </Popover>
        </Col>
      </Row>
    </FormItem>
  );
};

const GetFontsValue = () => {
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  return (
    <div>
      <FormItem>
        <Col span={24}>
          <Input addonBefore="name" value={fontName} onChange={(e) => setFontName(e.target.value)} />
        </Col>
      </FormItem>
      <FormItem>
        <Col span={24}>
          <Input addonBefore="url" value={fontUrl} onChange={(e) => setFontUrl(e.target.value)} />
        </Col>
      </FormItem>
    </div>
  );
};

export { AddCustomFonts };
