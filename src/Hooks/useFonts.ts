import { useEffect, useState } from 'react';
import { FONTS_CONFIG } from '../Components/Mods/FontConfig';
import { useValue, useVisibility } from './Attribute.hook';

const ATTRIBUTE = 'font-family';
const fonts = FONTS_CONFIG.sort((a, b) => (a.name > b.name ? 1 : -1)).map((font) => font.name.trim());

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

  return [fonts, value];
};

export { useFonts };
