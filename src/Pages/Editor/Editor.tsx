import { Button } from '../../Components/Button';
import { View } from './View';
import css from './Editor.module.scss';

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
      <div className={css.attributes}>attributes</div>
    </div>
  );
};
