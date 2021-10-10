import styled from 'styled-components';
import { ChromePicker } from 'react-color';
import { useState } from 'react';

interface ColorPickerProps {
  handleChange: (color: string) => void;
  mouseDown: boolean;
}

export const ColorPicker = ({ handleChange, mouseDown }: ColorPickerProps) => {
  const [color, setColor] = useState(() => '#ccc');

  const handleColorChange = (color: any) => {
    const hexCode = `${color.hex}${decimalToHex(color.rgb.a)}`;
    setColor(hexCode);
    handleChange(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
  };

  return (
    <ColorPickerContainer
      onMouseDown={(e) => {
        if (!mouseDown) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      color={color}
    >
      <div className="popover">
        <ChromePicker disableAlpha={false} color={color} onChange={(color: any) => handleColorChange(color)} />
      </div>
    </ColorPickerContainer>
  );
};

const decimalToHex = (alpha: number) => (alpha === 0 ? '00' : Math.round(255 * alpha).toString(16));

const ColorPickerContainer = styled.div`
  display: inline-block;
  .ant-popover-inner-content {
    padding: 0;
  }
`;
