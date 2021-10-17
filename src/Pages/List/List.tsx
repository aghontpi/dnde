import { NewItem, Preview } from './Preview';
import { useAppSelector } from '../../Hooks/AppHooks';
import './List.scss';

const List = () => {
  const { templates } = useAppSelector((state) => state.templateList);

  return (
    <div className="template">
      <div className="header">header</div>
      <div className="template-list">
        <NewItem />
        {templates.map((item, key) => {
          return <Preview key={key} image={item.preview} />;
        })}
      </div>
    </div>
  );
};

export { List };
