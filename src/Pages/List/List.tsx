import { NewItem, Preview } from './Preview';
import './List.scss';

const Items = [
  {
    id: 24234234,
    preview: 'https://picsum.photos/320/550',
  },
  {
    id: 4535345,
    preview: 'https://picsum.photos/320/400',
  },
  {
    id: 976824,
    preview: 'https://picsum.photos/320/600',
  },
];

const List = () => {
  return (
    <div className="template">
      <div className="header">header</div>
      <div className="template-list">
        <NewItem />
        {Items.map((item, key) => {
          return <Preview key={key} image={item.preview} />;
        })}
      </div>
    </div>
  );
};

export { List };
