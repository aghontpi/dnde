import AlignCenterOutlined from '@ant-design/icons/lib/icons/AlignCenterOutlined';
import AlignLeftOutlined from '@ant-design/icons/lib/icons/AlignLeftOutlined';
import AlignRightOutlined from '@ant-design/icons/lib/icons/AlignRightOutlined';
import PicCenterOutlined from '@ant-design/icons/lib/icons/PicCenterOutlined';
import { Button, Col, Form, Row, Tooltip } from 'antd';
import _ from 'lodash';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';

const ATTRIBUTE = 'align';

export const Align = () => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active } = useHtmlWrapper();

  const onClick = (align: string) => {
    if (active && visible && path) {
      let item = _.get(mjmlJson, path);
      if (item && item.attributes && item.attributes) {
        item.attributes['align'] = align;
        const updated = _.set(mjmlJson, path, item);
        setMjmlJson({ ...updated });
      }
    }
  };

  return visible ? (
    <Row>
      <Col flex="3">
        <Form.Item label="Align"></Form.Item>
      </Col>
      <Col flex="2">
        <Row justify="space-between">
          <Tooltip title="Left">
            <Button onClick={() => onClick('left')} type="ghost" icon={<AlignLeftOutlined />} />
          </Tooltip>

          <Col>
            <Tooltip title="Justify">
              <Button onClick={() => onClick('justify')} type="ghost" icon={<PicCenterOutlined />} />
            </Tooltip>
          </Col>

          <Col>
            <Tooltip title="Center">
              <Button onClick={() => onClick('center')} type="ghost" icon={<AlignCenterOutlined />} />
            </Tooltip>
          </Col>

          <Col>
            <Tooltip title="Right">
              <Button onClick={() => onClick('right')} type="ghost" icon={<AlignRightOutlined />} />
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  ) : null;
};
