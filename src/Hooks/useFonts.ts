import { useEffect, useState } from 'react';
import { FONTS_CONFIG } from '../Components/Mods/FontConfig';
import { useValue, useVisibility } from './Attribute.hook';

const ATTRIBUTE = 'font-family';
const defaultFonts = ['Ubuntu', 'Helvetica', 'Arial', 'sans-serif'];
const fonts = FONTS_CONFIG.map((font) => font.name.trim());

const useFonts = (): [string[], string] => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });
  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible) {
      const _value = getValue();
      if (_value && _value.indexOf(',')) {
        const _fonts = _value.split(',')[0];
        setValue(_fonts);
      }
    }
  }, [getValue]);

  return [[...defaultFonts, ...fonts], value];
};

export { useFonts };
