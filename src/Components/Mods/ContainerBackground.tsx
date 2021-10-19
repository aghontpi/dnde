import _ from 'lodash';
import styled from 'styled-components';
import { useEditor } from '../../Hooks/Editor.hook';
import { Col, Form, Row } from 'antd';
import { ChromePicker } from 'react-color';
import { useEffect, useState } from 'react';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { logger } from '../../Utils/logger';

const ATTRIBUTE = 'container-background-color';

export const ContainerBackground = () => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [active, setActive] = useState(() => false);
  const [color, setColor] = useState(() => '#ccc');
  const { active: clicked } = useHtmlWrapper();
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });

  useEffect(() => {
    if (clicked && visible) {
      try {
        if (path) {
          let item = _.get(mjmlJson, path);
          if (item.mutableProperties.includes(ATTRIBUTE)) {
            setColor(item.attributes[ATTRIBUTE]);
          }
        }
      } catch (e) {
        logger.info('got exception, hiding background mod', e);
      }
    }
  }, [clicked]);

  const handleColorChange = (color: any) => {
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a)}`;
    setColor(hexCode);
    if (path && visible) {
      let element = _.get(mjmlJson, path);
      element.attributes['container-background-color'] = hexCode;
      let json = _.set(mjmlJson, path, element);

      setMjmlJson({ ...json });
    }
  };

  return visible ? (
    <>
      <Row>
        <Col flex="auto">
          <Form.Item label="Container Background"></Form.Item>
        </Col>

        <ColorPicker color={color} flex="none">
          <div className="swatch" onClick={() => setActive(true)}>
            <div className="color"></div>
          </div>
          {active ? (
            <div className="popover">
              <div className="cover" onClick={() => setActive(false)}></div>
              <ChromePicker disableAlpha={false} color={color} onChange={(color: any) => handleColorChange(color)} />
            </div>
          ) : null}
        </ColorPicker>
      </Row>
    </>
  ) : null;
};

const decimalToHex = (alpha: number) => (alpha === 0 ? '00' : Math.round(255 * alpha).toString(16));

const ColorPicker = styled(Col)`
  .color {
    width: 25px;
    height: 25px;
    border-radius: 2px;
    background: ${(props) => props.color};
  }
  .swatch {
    padding: 5px;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    cursor: pointer;
  }

  .popover {
    position: absolute;
    z-index: 2;
    top: -108px;
    left: -200px;
  }

  .cover {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`;
