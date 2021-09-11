import css from './Editor.module.scss';

export const Editor = () => {
  return (
    <div className={css.editor}>
      <div className={css.bank}>components</div>
      <div className={css.view}>view</div>
      <div className={css.attributes}>attributes</div>
    </div>
  );
};
