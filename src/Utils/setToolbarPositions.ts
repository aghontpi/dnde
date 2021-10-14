import { floor } from 'lodash';

type fn = (arg: number) => void;

interface SetToolBarsProps {
  pos: any;
  delete: {
    setDelX: fn;
    setDelY: fn;
  };
  copy: {
    setCopyX: fn;
    setCopyY: fn;
  };
}

const setToolBars = ({ pos, delete: { setDelX, setDelY }, copy: { setCopyX, setCopyY } }: SetToolBarsProps) => {
  const IconSize = 32;
  const numberOfIcons = 2 * IconSize;
  if (pos) {
    setDelX(pos.right + 4);
    const middle = floor((pos.bottom - pos.top) / 2) - numberOfIcons / 2;
    setDelY(pos.top + middle);
    setCopyX(pos.right + 4);
    // below the delete icon, with a little offset
    setCopyY(pos.top + middle + IconSize + 4);
  }
};

export { setToolBars };
