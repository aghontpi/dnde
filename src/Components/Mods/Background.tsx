import _ from 'lodash';
import styled from 'styled-components';
import { useEditor } from '../../Hooks/Editor.hook';
import { Col, Form, Row } from 'antd';
import { ChromePicker } from 'react-color';
import { useEffect, useState } from 'react';
import { useVisibility } from '../../Hooks/Attribute.hook';
import { logger } from '../../Utils/logger';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';

const ATTRIBUTE = 'background-color';
interface BackgroundProps {
  activePath?: string;
  label?: string;
  overrideAttribute?: string;
}

export const Background = ({ activePath, label, overrideAttribute }: BackgroundProps) => {
  const attribute = overrideAttribute || ATTRIBUTE;
  const { mjmlJson, setMjmlJson } = useEditor();
  const [active, setActive] = useState(() => false);
  const [color, setColor] = useState(() => '#ccc');
  const [visible, path] = useVisibility({ attribute, customPath: activePath });

  useEffect(() => {
    if (visible && path) {
      const item = _.get(mjmlJson, path);
      if (item && item.attributes && item.attributes[attribute]) {
        setColor(item.attributes[attribute]);
      }
    }
    logger.log('background reloading,', path, visible);
  }, [path, visible]);

  const handleColorChange = (color: any) => {
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a)}`;
    setColor(hexCode);
    if (path && visible) {
      let element = _.get(mjmlJson, path);
      element.attributes[attribute] = hexCode;
      let json = _.set(mjmlJson, path, element);

      setMjmlJson({ ...json });
    }
  };

  return visible ? (
    <>
      <Row>
        <Col flex="auto">
          <Form.Item label={label ? label : 'Background'}></Form.Item>
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
