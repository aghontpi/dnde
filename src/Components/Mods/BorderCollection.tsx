import _ from 'lodash';
import { BORDER_CONFIG } from './BorderConfig';
import { UnitConfig } from './UnitConfig';
import { Select, Input, Typography } from 'antd';
import { ChromePicker } from 'react-color';
import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useEditor } from '../../Hooks/Editor.hook';
import { useVisibility, useValue } from '../../Hooks/Attribute.hook';
import styled from 'styled-components';

export enum BorderDirection {
  Top,
  Bottom,
  Left,
  Right,
  All,
}

interface ColorPickerComponentProps {
  color: string;
  setColor: Function;
  showColor: boolean;
  setShowColor: Function;
  borderDirection?: BorderDirection;
}

const ColorPickerComponent = ({
  color,
  setColor,
  showColor,
  setShowColor,
  borderDirection,
}: ColorPickerComponentProps) => {
  let left = '0px';
  if (borderDirection === BorderDirection.Top || borderDirection === BorderDirection.Left) left = '-40px';
  else left = '-200px';

  return (
    <ColorPicker left={left} color={color}>
      <div className="swatch" onClick={() => setShowColor(true)}>
        <div className="color"></div>
      </div>
      {showColor ? (
        <div className="popover">
          <div className="cover" onClick={() => setShowColor(false)}></div>
          <ChromePicker disableAlpha={false} color={color} onChange={(x) => setColor(x.hex)} />
        </div>
      ) : null}
    </ColorPicker>
  );
};

interface BorderCollectionProps {
  activePath: string | undefined;
  direction: BorderDirection;
}

enum BorderAttribute {
  Top = 'border-top',
  Bottom = 'border-bottom',
  Left = 'border-left',
  Right = 'border-right',
}

export const BorderCollection = ({ activePath, direction }: BorderCollectionProps) => {
  const { mjmlJson, setMjmlJson } = useEditor();
  const [visible, path] = useVisibility({ attribute: 'border', customPath: activePath });

  const [style, setStyle] = useState<string>('none');
  const [color, setColor] = useState<string>('#000');
  const [showColor, setShowColor] = useState<boolean>(false);
  const [width, setWidth] = useState<string>('0');
  const [unit, setUnit] = useState<string>('px');

  const handleChange = (value: string): void => {
    if (visible && path) {
      let json = {};
      let element = _.get(mjmlJson, path);
      if (direction === BorderDirection.Left || direction === BorderDirection.All)
        element.attributes[BorderAttribute.Left] = value;
      if (direction === BorderDirection.Right || direction === BorderDirection.All)
        element.attributes[BorderAttribute.Right] = value;
      if (direction === BorderDirection.Top || direction === BorderDirection.All)
        element.attributes[BorderAttribute.Top] = value;
      if (direction === BorderDirection.Bottom || direction === BorderDirection.All)
        element.attributes[BorderAttribute.Bottom] = value;
      json = _.set(mjmlJson, path, element);
      setMjmlJson({ ...json });
    }
  };

  const splitWidth = (w: string): string[] => {
    const numPattern = /[0-9]/g;
    const alphaPattern = /[a-zA-Z]/g;
    let A: string[] = [];
    const num = w.match(numPattern);
    const alpha = w.match(alphaPattern);
    A.push(num === null ? '' : num.join(''));
    A.push(alpha === null ? '' : alpha.join(''));
    return A;
  };

  // Values
  const left = useValue({ path, visible, attribute: BorderAttribute.Left });
  const right = useValue({ path, visible, attribute: BorderAttribute.Right });
  const top = useValue({ path, visible, attribute: BorderAttribute.Top });
  const bottom = useValue({ path, visible, attribute: BorderAttribute.Bottom });

  const defaultValue: string = '0px none #000';

  const setValue = (value: string): void => {
    const VALUE: string[] = value.split(' ');
    const WIDTH: string[] = splitWidth(VALUE[0]);
    if (VALUE.length === 3 && WIDTH.length === 2) {
      setWidth(WIDTH[0]);
      setUnit(WIDTH[1]);
      setStyle(VALUE[1]);
      setColor(VALUE[2]);
    } else {
      setValue(defaultValue);
    }
  };

  const setVisibleValues = () => {
    let l: string | undefined = left.getValue();
    let r: string | undefined = right.getValue();
    let t: string | undefined = top.getValue();
    let b: string | undefined = bottom.getValue();

    if (l === r && l === t && l === b && l !== '' && direction === BorderDirection.All) {
      l && setValue(l);
    } else {
      switch (direction) {
        case BorderDirection.Left:
          if (l !== undefined) setValue(l);
          else setValue(defaultValue);
          break;
        case BorderDirection.Right:
          if (r !== undefined) setValue(r);
          else setValue(defaultValue);
          break;
        case BorderDirection.Top:
          if (t !== undefined) setValue(t);
          else setValue(defaultValue);
          break;
        case BorderDirection.Bottom:
          if (b !== undefined) setValue(b);
          else setValue(defaultValue);
          break;
        case BorderDirection.All:
          setValue(defaultValue);
      }
    }
  };

  useEffect(() => {
    if (visible && path) {
      setVisibleValues();
    }
  }, [visible, path]);

  useEffect(() => {
    handleChange(width + unit + ' ' + style + ' ' + color);
  }, [style, color, width, unit]);

  return visible ? (
    <>
      {direction === BorderDirection.All && (
        <Row gutter={[8, 4]} justify="space-between">
          <Col span={12}>
            <Select value={style} options={BORDER_CONFIG} onChange={(x) => setStyle(x)} />
          </Col>
          <Col flex="none">
            <Input
              style={{ width: '88px' }}
              placeholder="Width"
              value={width}
              onChange={(x) => setWidth(x.target.value)}
              addonAfter={unit}
            />
          </Col>
          <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '0px' }}>
            <ColorPickerComponent
              color={color}
              borderDirection={direction}
              setColor={setColor}
              showColor={showColor}
              setShowColor={setShowColor}
            />
          </Col>
        </Row>
      )}

      {direction !== BorderDirection.All && (
        <Row gutter={[0, 4]} justify="space-between">
          <Col span={24}>
            <Select value={style} options={BORDER_CONFIG} onChange={(x) => setStyle(x)} />
          </Col>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              {/* Border width */}
              <Col flex="none" style={{ width: '88px' }}>
                <Input placeholder="Width" value={width} onChange={(x) => setWidth(x.target.value)} addonAfter={unit} />
              </Col>
              {/* Border color */}
              <Col flex="none">
                <ColorPickerComponent
                  color={color}
                  borderDirection={direction}
                  setColor={setColor}
                  showColor={showColor}
                  setShowColor={setShowColor}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      {/* dont show unit for user for now */}
      {/* <Row>
        <Col span={12}>
        </Col>
        <Col span={11} offset={1}>
          <Select value={unit} options={UnitConfig} onChange={(x) => setUnit(x)} style={{ width: '50%' }} />
        </Col> 
      </Row> */}
    </>
  ) : null;
};

const ColorPicker = styled(Col)<{ left: string }>`
  display: flex;
  .color {
    width: 25px;
    height: 25px;
    border-radius: 2px;
    background: ${(props) => props.color};
  }
  .swatch {
    padding: 3px;
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
    left: ${(props) => props.left};
  }

  .cover {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`;
