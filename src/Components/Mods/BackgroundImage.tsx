import { Col, Form, Row, Input } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';

const URL = 'background-url';
const SIZE = 'background-size';
const REPEAT = 'background-repeat';

const BackgroundImage = () => {
  const [url, setUrl] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [repeat, setRepeat] = useState<string>('');
  const { mjmlJson, setMjmlJson } = useEditor();

  const [urlVisibility, urlPath] = useVisibility({ attribute: URL });
  const [sizeVisibility, sizePath] = useVisibility({ attribute: SIZE });
  const [repeatVisiblity, repeatPath] = useVisibility({ attribute: REPEAT });

  useEffect(() => {
    if (mjmlJson) {
      if (urlVisibility) {
        const item = _.get(mjmlJson, urlPath);
        item && setUrl(item.attributes[URL]);
      }
      if (sizeVisibility) {
        const item = _.get(mjmlJson, sizePath);
        item && setSize(item.attributes[SIZE]);
      }
      if (repeatVisiblity) {
        const item = _.get(mjmlJson, repeatPath);
        item && setRepeat(item.attributes[REPEAT]);
      }
    }
  }, [urlVisibility, sizeVisibility, repeatVisiblity]);

  if (urlVisibility === false && sizeVisibility === false && repeatVisiblity === false) {
    return null;
  }

  const onChangeUrl = (e: any) => {
    setUrl(e.target.value);
    if (urlVisibility && urlPath && e.target.value) {
      let item = _.get(mjmlJson, urlPath);
      if (item && item.attributes) {
        item.attributes[URL] = e.target.value;
        const updated = _.set(mjmlJson, urlPath, item);
        setMjmlJson({ ...updated });
      }
    }
  };

  const onChangeSize = (e: any) => {
    setSize(e.target.value);
    if (sizeVisibility && sizePath && e.target.value) {
      let item = _.get(mjmlJson, urlPath);
      if (item && item.attributes) {
        item.attributes[SIZE] = e.target.value;
        const updated = _.set(mjmlJson, sizePath, item);
        setMjmlJson({ ...updated });
      }
    }
  };

  const onChangeRepeat = (e: any) => {
    setRepeat(e.target.value);
    if (repeatVisiblity && repeatPath && e.target.value) {
      let item = _.get(mjmlJson, urlPath);
      if (item && item.attributes) {
        item.attributes[REPEAT] = e.target.value;
        const updated = _.set(mjmlJson, repeatPath, item);
        setMjmlJson({ ...updated });
      }
    }
  };

  return (
    <Form.Item label="Background Image:">
      <Input.Group>
        <Row gutter={[0, 4]}>
          {urlVisibility ? (
            <Col span={24}>
              <Input addonBefore="url" onChange={onChangeUrl} value={url} />
            </Col>
          ) : null}
          {sizeVisibility ? (
            <Col span={24}>
              <Input
                addonBefore="size"
                onChange={onChangeSize}
                value={size}
                placeholder="px/percent/'cover'/'contain'"
              />
            </Col>
          ) : null}
          {repeatVisiblity ? (
            <Col span={24}>
              <Input addonBefore="repeat" onChange={onChangeRepeat} value={repeat} placeholder="repeat" />
            </Col>
          ) : null}
        </Row>
      </Input.Group>
    </Form.Item>
  );
};

export { BackgroundImage };
