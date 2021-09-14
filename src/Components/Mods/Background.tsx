import _ from "lodash";
import styled from "styled-components";
import { useEditor } from "../../Hooks/Editor.hook";
import { Col, Form, Input, Row } from "antd";
import { ChromePicker } from "react-color";
import { useState } from "react";

export const Background = () => {
  const { active: activep } = useEditor();
  const [active, setActive] = useState(() => false);
  const [color, setColor] = useState(() => "#ccc");

  let value = "";
  //   if (activep.path) {
  //     value = _.get(mjmlJson, activep.path.slice(1) + 'attributes.background');
  //   }

  const handleColorChange = (color: any) => {
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a)}`;
    setColor(hexCode);
  };

  return activep.path ? (
    <>
      <Row>
        <Col flex="auto">
          <Form.Item label="Background"></Form.Item>
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

const decimalToHex = (alpha: number) => (alpha === 0 ? "00" : Math.round(255 * alpha).toString(16));

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
