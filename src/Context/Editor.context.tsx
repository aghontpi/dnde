import { message, Modal } from 'antd';
import _ from 'lodash';
import { createContext, FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useLazyGetTemplateQuery } from '../Api/api';
import { FONTS_CONFIG } from '../Components/Mods/FontConfig';
import { HEADSTYLE } from '../Components/Mods/HeadStyle';
import { useDragAndDropUniqueId } from '../Hooks/Drag.hook';
import { importJson } from '../Utils/mjmlProcessor';
import { UNDOREDO } from '../Utils/undoRedo';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { config } from 'process';

export const EditorContext = createContext<any>(null);

export const PageHeaderItems = [
  { tagName: 'mj-title', content: 'dnde-editor' },
  { tagName: 'mj-style', content: HEADSTYLE },
  ...FONTS_CONFIG.map((font) => {
    return {
      tagName: 'mj-font',
      attributes: {
        name: font.name,
        href: font.value,
      },
    };
  }),
];

const initialState = {
  tagName: 'mjml',
  children: [
    {
      tagName: 'mj-head',
      attributes: {},
      children: PageHeaderItems,
    },
    {
      tagName: 'mj-body',
      attributes: { 'css-class': 'mjml-tag identifier-mj-body', 'background-color': 'grey', width: '600px' },
      children: [],
      mutableProperties: ['width', 'background-color'],
    },
  ],
  attributes: {},
};

const LOADING_KEY = 'loading';

export const EDContext: FC = (props) => {
  const { templateId }: { templateId: string | undefined } = useParams();
  const { getId } = useDragAndDropUniqueId();
  const [mjmlJson, setMjmlJson] = useState<any>(null);
  const [trigger, { data, isError, isLoading, isSuccess }] = useLazyGetTemplateQuery();

  useEffect(() => {
    // if app crashed/ user left while editing, restoring from local
    const actions = localStorage.getItem('actions');

    async function restoreFromLocalStorage() {
      let result = false;
      if (actions) {
        result = await modalConfirmLoadLocalState(
          () => {
            const parsed = JSON.parse(actions);
            const processed = importJson(parsed, getId, true);
            UNDOREDO.newAction(processed);
            setMjmlJson({ ...processed });
          },
          () => {
            setMjmlJson({ ...initialState });
            UNDOREDO.newAction(initialState);
            localStorage.removeItem('actions');
          }
        );
      }
      return result;
    }

    restoreFromLocalStorage().then((isRestored) => {
      if (isRestored) {
        return;
      } else {
        if (templateId === 'new' || typeof templateId === 'undefined') {
          UNDOREDO.newAction(_.cloneDeep(initialState));
          setMjmlJson(_.cloneDeep(initialState));
        } else {
          if (templateId) {
            message.loading({ content: 'Fetching Template...', key: LOADING_KEY, duration: 0 });
            trigger({ id: templateId });
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      try {
        const processedJson = importJson(JSON.parse(data.response.data), getId);
        setMjmlJson(processedJson);
        UNDOREDO.newAction(_.cloneDeep(processedJson));
      } catch (e) {
        message.error('Unable to load template', 3);
      }
    } else if (isSuccess && !data) {
      message.error('Template is empty', 2);
    }
    if (isSuccess) {
      message.destroy(LOADING_KEY);
    }
    if (isError) {
      message.info('Network error, template not fetched.', 2);
    }
  }, [isError, isLoading, isSuccess, data]);

  const [attributes, setAttributes] = useState<any>({});

  return (
    <EditorContext.Provider
      value={{
        mjmlJson: mjmlJson,
        setMjmlJson,
        attributes,
        setAttributes,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

const modalConfirmLoadLocalState = async (okCallback: () => void, cancelCallback: () => void) => {
  return new Promise<boolean>((resolve, reject) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'local save found do you want to load it?',
      okText: 'restore',
      cancelText: 'cancel',
      onOk: () => {
        okCallback();
        resolve(true);
      },
      onCancel: () => {
        cancelCallback();
        resolve(false);
      },
    });
  });
};
