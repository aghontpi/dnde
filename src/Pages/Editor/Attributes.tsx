import { Background } from '../../Components/Mods/Background';
import { Border } from '../../Components/Mods/Border';
import { BorderRadius } from '../../Components/Mods/BorderRadius';
import { CordinalBorder } from '../../Components/Mods/CordinalBorder';
import css from './Editor.module.scss';

export const Attributes = () => {
  return (
    <>
      <div className={css.heading}>
        <span>Attributes</span>
      </div>
      <div className={css.mods}>
        <Border />
        <BorderRadius />
        <CordinalBorder />
        <Background />
      </div>
    </>
  );
};
