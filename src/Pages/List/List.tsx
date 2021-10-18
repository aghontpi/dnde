import { NewItem, Preview } from './Preview';
import { useAppSelector } from '../../Hooks/AppHooks';
import './List.scss';
import { useEffect } from 'react';
import { useGetTemplatesQuery } from '../../Api/api';

const List = () => {
  // const { templates } = useAppSelector((state) => state.templateList);

  const { data, isLoading, isError, isSuccess } = useGetTemplatesQuery();

  console.log('::listservice', data);

  return (
    <div className="template">
      <div className="header">header</div>
      <div className="template-list">
        <NewItem />
        {isSuccess && data
          ? data.response.map((item, key) => {
              return <Preview key={key} id={item.docRef} image={item.preview} />;
            })
          : null}
      </div>
    </div>
  );
};

export { List };
