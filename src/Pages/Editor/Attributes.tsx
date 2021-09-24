import { Scrollbars } from 'react-custom-scrollbars-2';
import { Align } from '../../Components/Mods/Align';
import { Background } from '../../Components/Mods/Background';
import { Border } from '../../Components/Mods/Border';
import { BorderRadius } from '../../Components/Mods/BorderRadius';
import { ContainerBackground } from '../../Components/Mods/ContainerBackground';
import { CordinalBorder } from '../../Components/Mods/CordinalBorder';
import { Img } from '../../Components/Mods/Img';
import { Link } from '../../Components/Mods/Link';
import { Padding } from '../../Components/Mods/Paddings';
import { Height, Width } from '../../Components/Mods/WidthHeight';
import css from './Editor.module.scss';

export const Attributes = () => {
  return (
    <Scrollbars style={{ height: '100%' }} autoHide={true}>
      <div className={css.heading}>
        <span>Attributes</span>
      </div>
      <div className={css.mods}>
        <Width />
        <Height />
        <Border />
        <CordinalBorder />
        <BorderRadius />
        <Background />
        <ContainerBackground />
        <Padding />
        <Align />
        <Link />
        <Img />
      </div>
    </Scrollbars>
  );
};
