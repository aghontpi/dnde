import { Form, Input, Row, Col, Switch, Typography, Tooltip } from 'antd';
import _ from 'lodash';
import { ChangeEvent, useMemo, useState } from 'react';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { useEditor } from '../../Hooks/Editor.hook';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useStore } from 'react-redux';
interface PaddingProps {
  activePath?: string;
}

const Padding = ({ activePath }: PaddingProps) => {
  const { Text } = Typography;

  let [checkAdvance, setcheckAdvance] = useState(false);
  let [visible, path, active] = useVisibility({ attribute: 'padding', customPath: activePath });
  const { mjmlJson, setMjmlJson } = useEditor();

  const advancedOptions = (checked: boolean) => setcheckAdvance(checked);
  const handleChange = (e: ChangeEvent<HTMLInputElement>, direction: string) => {
    if (!e.currentTarget.value.includes('px')) {
      e.currentTarget.value = `${e.currentTarget.value}px`;
    }
    console.log(e.currentTarget.value);

    // setPadding(direction, e.currentTarget.value);
  };

  // const setPadding = useMemo(
  //   () => (direction: string, value: string) => {
  //     if (path && visible) {
  //       let json = {};

  //       if (direction) {
  //         let element = _.get(mjmlJson, path);
  //         element.attributes[`padding-${direction}`] = value;
  //         json = _.set(mjmlJson, path, element);
  //         setMjmlJson({ ...json });
  //       }
  //     }
  //   },
  //   [visible, path]
  // );

  //todo: optimize this function, move to useEffect, useState.
  // its being called on every hover event.
  const getValue = (direction: string) => {
    let value = '';
    //todo: debug why removing active causes crash  getValue:{@mods/pad..tsx}
    // move it to useeffect later
    if (path && visible && active) {
      let element = _.get(mjmlJson, path);
      if (!element) {
        return;
      }
      value = element.attributes ? element.attributes[`padding-${direction}`] : null;
      if (!value) {
        value = element.attributes['padding'];
        if (value) {
          const [vertical, horizontal] = value.split(' ');
          switch (direction) {
            case 'top':
            case 'bottom':
              return vertical;
            case 'left':
            case 'right':
              return horizontal;
          }
        }
      }
    }

    console.log(value);

    return value;
  };

  return visible ? (
    <>
      <Form.Item className="padding-control">
        <Row align="middle">
          <Col span={11}>
            <Form.Item colon={true} label="Padding" style={{ margin: 0 }}></Form.Item>
          </Col>
          <Col span={10} style={{ margin: 0, textAlign: 'right' }}>
            <Text type="secondary"> Advanced options </Text>
          </Col>
          <Col span={2} offset={1} style={{ textAlign: 'right' }}>
            <Switch size="small" onChange={advancedOptions} />
          </Col>
        </Row>
        <br />

        {!checkAdvance && (
          <Row>
            <Col span={24}>
              <Row align="middle">
                <Col span={24}>
                  <Input placeholder="Padding" />
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {checkAdvance && (
          <Row>
            <Col span={24}>
              <Row justify="space-between" align="middle">
                <Col span={5}>
                  <Input
                    type="number"
                    onChange={(e) => handleChange(e, 'top')}
                    value={getValue('top')}
                    prefix={
                      <Tooltip title="Padding Top">
                        <UpOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                    min={0}
                  />
                </Col>
                <Col span={5} offset={1}>
                  <Input
                    type="number"
                    onChange={(e) => handleChange(e, 'right')}
                    value={getValue('right')}
                    prefix={
                      <Tooltip title="Padding Bottom">
                        <DownOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                    min={0}
                  />
                </Col>
                <Col span={5} offset={1}>
                  <Input
                    type="number"
                    onChange={(e) => handleChange(e, 'bottom')}
                    value={getValue('bottom')}
                    prefix={
                      <Tooltip title="Padding Left">
                        <LeftOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                    min={0}
                  />
                </Col>
                <Col span={5} offset={1}>
                  <Input
                    type="number"
                    onChange={(e) => handleChange(e, 'left')}
                    value={getValue('left')}
                    prefix={
                      <Tooltip title="Padding Right">
                        <RightOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }
                    min={0}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Form.Item>
    </>
  ) : null;
};

export { Padding };
