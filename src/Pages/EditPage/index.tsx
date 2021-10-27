import { Button } from 'antd';
import { useRef } from 'react';
import Editor from '../Editor/';

const EditPage = () => {
  const ref = useRef<any>(null);

  const sendEmail = () => {
    if (ref.current) {
      const html = ref.current.getHtml();
      console.log('html', html);
    }
  };

  return (
    <div style={{ flex: '1', display: 'flex', width: '100%', height: '100%' }}>
      <Editor ref={ref} />
      <Button onClick={(e: any) => sendEmail()} style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
        gethtml
      </Button>
    </div>
  );
};

export { EditPage };
