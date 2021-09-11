import _ from 'lodash';
import styled from 'styled-components';
import { useEditor } from '../../Hooks/Editor.hook';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  line-height: 2;
  label {
    font-size: 16px;
    font-weight: bold;
  }
  div {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    div {
      width: 50%;
      justify-content: space-between;

      label: {
        font-size: 16px;
        font-weight: bold;
      }
      input {
        border: 1px solid black;
        width: 60%;
        min-height: 26px;
        border-radius: 2px;
        :focus-visible {
          outline: unset;
        }
      }
    }
  }
`;

export const CordinalBorder = () => {
  const { active, setActive, mjmlJson } = useEditor();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, direction: string) => {
    if (active && e.target.value) {
      if (e.target.value === '') {
        e.target.value = 'none';
      }
      const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
      changeValue(active, attributes, direction, e, setActive);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, direction: string) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (active.path) {
        const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
        let value = attributes['border-' + direction];
        const re = new RegExp(/^\d+/);
        const match = re.exec(value);
        let matchedValue = match ? parseInt(match[0]) : 0;
        if (e.key === 'ArrowUp') {
          value = value.replace(/^\d+/, matchedValue + 1);
        } else if (e.key === 'ArrowDown' && matchedValue > 0) {
          value = value.replace(/^\d+/, matchedValue - 1);
        }
        e.currentTarget.value = value;
        changeValue(active, attributes, direction, e, setActive);
      }
    }
  };

  let [valuel, valuer, valueb, valuet] = ['', '', '', ''];
  if (active.path) {
    valuel = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-left');
    valuer = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-right');
    valuet = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-top');
    valueb = _.get(mjmlJson, active.path.slice(1) + 'attributes.border-bottom');
  }

  return (
    <Container>
      {active.path && (
        <>
          <label>Border Directions</label>
          <div>
            <div>
              <label>Top</label>
              <input onKeyDown={(e) => onKeyDown(e, 'top')} onChange={(e) => handleChange(e, 'top')} value={valuet} />
            </div>

            <div>
              <label>Right</label>
              <input
                onKeyDown={(e) => onKeyDown(e, 'right')}
                onChange={(e) => handleChange(e, 'right')}
                value={valuer}
              />
            </div>

            <div>
              <label>Bottom</label>
              <input
                onKeyDown={(e) => onKeyDown(e, 'bottom')}
                onChange={(e) => handleChange(e, 'bottom')}
                value={valueb}
              />
            </div>

            <div>
              <label>Left</label>
              <input onKeyDown={(e) => onKeyDown(e, 'left')} onChange={(e) => handleChange(e, 'left')} value={valuel} />
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

const changeValue = (
  active: any,
  attributes: any,
  direction: string,
  e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>,
  setActive: (v: any) => void
) => {
  switch (direction) {
    case 'left':
      setActive({ ...active, change: { ...attributes, 'border-left': e.currentTarget.value } });
      break;
    case 'right':
      setActive({ ...active, change: { ...attributes, 'border-right': e.currentTarget.value } });
      break;
    case 'top':
      setActive({ ...active, change: { ...attributes, 'border-top': e.currentTarget.value } });
      break;
    case 'bottom':
      setActive({ ...active, change: { ...attributes, 'border-bottom': e.currentTarget.value } });
      break;
    default:
      console.error(`unable to handle ${direction} `);
  }
};
