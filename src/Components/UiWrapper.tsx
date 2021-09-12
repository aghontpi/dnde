import css from './UiWrapper.module.scss';

export const UiWrapper = ({ background, label }: { background: string; label: string }) => {
  return (
    <div className={css.wrapper}>
      <div className={`${css.container} ${css[background]}`}></div>
      <span>{label}</span>
    </div>
  );
};
