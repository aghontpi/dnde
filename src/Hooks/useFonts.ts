import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useValue, useVisibility } from './Attribute.hook';
import { useEditor } from './Editor.hook';

const ATTRIBUTE = 'font-family';

const useFonts = (): [string[], string] => {
  const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
  const { getValue } = useValue({ path, visible, attribute: ATTRIBUTE });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState('');
  const [fonts, setFonts] = useState<[]>([]);

  useEffect(() => {
    updateFonts(mjmlJson, fonts, setFonts, setMjmlJson);
  }, []);

  useEffect(() => {
    updateFonts(mjmlJson, fonts, setFonts, setMjmlJson);
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

const updateFonts = (mjmlJson: any, fonts: any, setFonts: (arg: any) => void, setMjmlJson: (arg: any) => void) => {
  if (mjmlJson) {
    const head = mjmlJson.children[0];
    if (head && head.children) {
      const fontList = head.children.filter((item: any) => item && item.tagName && item.tagName.includes('font'));
      if (fonts && fontList && fontList.length !== fonts.length) {
        let sortedFontList = fontList
          .map((item: any) => item.attributes.name.trim())
          .sort((a: any, b: any) => (a > b ? 1 : -1));
        sortedFontList = _.uniq(sortedFontList);

        setFonts(sortedFontList);

        // update the overall fonts in the mail
        // uitlizing the fact that the path to attributes tag is always the same/static
        let mailFont = mjmlJson.children[0].children[2];
        let toUpdate = 'Ubuntu,' + sortedFontList.join(',');
        // updating attributes tag in head section. the font-family for changing 'font-family' on the fly for text-tag
        if (
          mailFont &&
          mailFont.tagName.includes('attributes') &&
          mailFont.children &&
          mailFont.children[0] &&
          mailFont.children[0].tagName.includes('text') &&
          mailFont.children[0]['attributes']['font-family'] !== toUpdate
        ) {
          mailFont.children[0].attributes['font-family'] = toUpdate;
          const update = _.set(mjmlJson, 'children[0].children[2]', mailFont);
          if (update) {
            setMjmlJson({ ...update });
          }
        }
      }
    }
  }
};

export { useFonts };
