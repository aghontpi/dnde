import { Button } from '../../Components/Button';
import { View } from './View';
import css from './Editor.module.scss';
import { Attributes } from './Attributes';

export const Editor = () => {
  return (
    <div className={css.editor}>
      <div className={css.bank}>
        <div className={css.heading}>
          <span>Components</span>
        </div>
        <div className={css.components}>
          <Button />
          <Button />
        </div>
      </div>
      <div className={css.view}>
        <View />
      </div>
      <div className={css.attributes}>
        <Attributes />
      </div>
    </div>
  );
};
