import { useEffect, useState } from 'react';
import { useValue, useVisibility } from './Attribute.hook';
import { useEditor } from './Editor.hook';

const ATTRIBUTE = 'font-family';

const useFonts = (): [string[], string] => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });
  const { mjmlJson } = useEditor();
  const [value, setValue] = useState('');
  const [fonts, setFonts] = useState<[]>([]);

  useEffect(() => {
    updateFonts(mjmlJson, fonts, setFonts);
  }, []);

  useEffect(() => {
    updateFonts(mjmlJson, fonts, setFonts);
  }, [mjmlJson]);

  useEffect(() => {
    if (visible && mjmlJson) {
      const _value = getValue();
      if (_value && _value.indexOf(',')) {
        const _fonts = _value.split(',')[0];
        setValue(_fonts);
      }
    }
  }, [mjmlJson]);

  return [fonts, value];
};

const updateFonts = (mjmlJson: any, fonts: any, setFonts: (arg: any) => void) => {
  if (mjmlJson) {
    const head = mjmlJson.children[0];
    if (head && head.children) {
      const fontList = head.children.filter((item: any) => item && item.tagName && item.tagName.includes('font'));
      if (fonts && fontList && fontList.length !== fonts.length) {
        setFonts(fontList.map((item: any) => item.attributes.name.trim()).sort((a: any, b: any) => (a > b ? 1 : -1)));
      }
    }
  }
};

export { useFonts };
