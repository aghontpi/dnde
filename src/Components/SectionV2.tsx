import { useCkeditor } from '../Hooks/Ckeditor.hook';
import { dragStart } from '../Utils/dragStart';
import { COLUMN, SECTION } from './Section';
import { UiWrapper } from './UiWrapper';

const SectionV2 = () => {
  const config = { ...SECTION, children: [COLUMN] };
  const {
    drag: { setIsColumn },
  } = useCkeditor();

  const onDragStart = (e: any) => {
    setIsColumn(true);
    dragStart(e, config);
  };
  return (
    <div onDragStart={onDragStart} draggable={true}>
      <UiWrapper background="section" label="Section" />
    </div>
  );
};

export { SectionV2 };
