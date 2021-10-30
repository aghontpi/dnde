import { useVisibility } from '../../Hooks/Attribute.hook';
import { Col, Form, Input, Row } from 'antd';
import { useEditor } from '../../Hooks/Editor.hook';
import { ChangeEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHtmlWrapper } from '../../Hooks/Htmlwrapper.hook';
import { domParser } from '../../Utils/htmlProcessor';
import { logger } from '../../Utils/logger';

const PROPERTY = 'content';

export const Content = () => {
  const [visible, path] = useVisibility({ property: PROPERTY });
  const { mjmlJson, setMjmlJson } = useEditor();
  const [value, setValue] = useState('');
  const [isReadOnly, setIsReadOnly] = useState<boolean | null>(null);
  const [htmlBlock, setHtmlBlock] = useState(false);
  const { active } = useHtmlWrapper();

  useEffect(() => {
    if (visible && path) {
      let item = _.get(mjmlJson, path);
      if (item) {
        setValue(item.content ? item.content : '');

        // maintain read only state for some attributes
        if (item.tagName === 'mj-text') {
          if (item.attributes && item.attributes['css-class'] && item.attributes['css-class'].includes('html-block')) {
            setIsReadOnly(false);
            setHtmlBlock(true);
            return;
          }
          setIsReadOnly(true);
        } else {
          setIsReadOnly(false);
        }
        setHtmlBlock(false);
      }
    }
  }, [visible, path]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.currentTarget.value;
    setValue(value);
    if (path && visible) {
      let element = _.get(mjmlJson, path);
      // while in middle of editing, if the element is removed. thus check element is not null
      if (element) {
        if (htmlBlock) {
          // if the content is empty, user will not know everything must be within a root node.
          // thus add a root node to the content.
          // ex:
          //   === can not have ===
          //    <h1>test heading</h1>
          //    <p>test para</p>
          //
          //  === can have ===
          //   <div>
          //    <h1>test heading</h1>
          //    <p>test para</p>
          //   </div>
          if (e.currentTarget.value.replace(/\n/, '').trim() === '') {
            setValue('<div></div>');
            e.currentTarget.value = '<div></dvi>';
          }
          // check the user string is valid or not before updating,
          // since this is a common component, validat this only for html block
          const partialHtml = domParser.parseFromString(value.replace(/\n/, ''), 'text/xml');
          const isError = partialHtml.querySelector('parsererror');
          if (isError) {
            logger.log('invalid html in content: not triggering rerender');
            return;
          }
        }

        if (element[PROPERTY] !== value) {
          element[PROPERTY] = value;
          const updated = _.set(mjmlJson, path, element);
          setMjmlJson({ ...updated });
        }
      }
    }
  };

  return visible ? (
    <Form.Item>
      <Row gutter={[0, 8]}>
        <Col span={24}>
          <span className="ant-form-item-label">Content:</span>
        </Col>
        <Col span={24}>
          {htmlBlock ? (
            <Input.TextArea spellCheck={false} rows={28} onChange={handleChange} value={value} />
          ) : (
            <Input.TextArea
              disabled={isReadOnly ? isReadOnly : false}
              readOnly={isReadOnly ? isReadOnly : false}
              spellCheck={false}
              rows={3}
              onChange={handleChange}
              value={value}
            />
          )}
        </Col>
      </Row>
    </Form.Item>
  ) : null;
};
