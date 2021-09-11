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
  input {
    border: 1px solid black;
    width: 70%;
    min-height: 26px;
    border-radius: 2px;
    :focus-visible {
      outline: unset;
    }
  }
`;

export const Border = () => {
  const { active, setActive, mjmlJson } = useEditor();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (active && e.target.value) {
      const attributes = _.get(mjmlJson, active.path.slice(1) + 'attributes');
      setActive({ ...active, change: { ...attributes, border: e.target.value } });
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 1 && e.key === 'Backspace') {
      e.currentTarget.value = '';
    }
  };

  let value = '';
  if (active.path) {
    value = _.get(mjmlJson, active.path.slice(1) + 'attributes.border');
  }

  return (
    <Container>
      {active.path && (
        <>
          <label>Border</label>
          <input onChange={handleChange} value={value} onKeyDown={onKeyDown} />
        </>
      )}
    </Container>
  );
};
