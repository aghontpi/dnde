import { Button, Col, Form, Row, Tooltip } from 'antd';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import {
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons/lib/icons/';
import { useEditor } from '../../Hooks/Editor.hook';
import _ from 'lodash';

const ATTRIBUTE = 'vertical-align';

interface VerticalAlignProps {
  activePath?: string;
}

export const VerticalAlign = ({ activePath }: VerticalAlignProps) => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE, customPath: activePath });
  const { mjmlJson, setMjmlJson } = useEditor();
  const { active } = useHtmlWrapper();

  const onClick = (value: string) => {
    if (active && visible && path) {
      let item = _.get(mjmlJson, path);
      if (item && item.attributes) {
        item.attributes[ATTRIBUTE] = value;
        const updated = _.set(mjmlJson, path, item);
        setMjmlJson({ ...updated });
      }
    }
  };

  return visible ? (
    <Row>
      <Col flex="auto">
        <Form.Item label="Vertical Align"></Form.Item>
      </Col>
      <Col>
        <Row justify="space-between" gutter={[16, 0]}>
          <Tooltip title="Top">
            <Button onClick={() => onClick('top')} type="ghost" icon={<VerticalAlignTopOutlined />} />
          </Tooltip>

          <Col>
            <Tooltip
              placement="left"
              title="Middle :Note: all columns in section must be set to middle, for this to work."
            >
              <Button onClick={() => onClick('middle')} type="ghost" icon={<VerticalAlignMiddleOutlined />} />
            </Tooltip>
          </Col>

          <Col>
            <Tooltip title="Bottom">
              <Button onClick={() => onClick('bottom')} type="ghost" icon={<VerticalAlignBottomOutlined />} />
            </Tooltip>
          </Col>
        </Row>
      </Col>
    </Row>
  ) : null;
};
