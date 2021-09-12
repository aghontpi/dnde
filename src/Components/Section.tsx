import { Row } from 'antd';
import { floor } from 'lodash';
import { Fragment, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ['background-color', 'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'background-size', 'background-url', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-top', 'css-class', 'direction', 'full-width', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'text-align'];

// prettier-ignore
const properties_with_default_values = {"background-color": "", "background-position": "top center", "background-position-x": "none", "background-position-y": "none", "background-repeat": "repeat", "background-size": "auto", "background-url": "", "border": "none", "border-bottom": "", "border-left": "", "border-radius": "", "border-right": "", "border-top": "", "css-class": "", "direction": "ltr", "full-width": "", "padding": "20px 0", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "text-align": "center"};

// prettier-ignore
const assigned_default_values  = {"align": "center", "background-color": "#414141", "border": "none", "border-radius": "3px", "color": "#ffffff", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-weight": "normal", "inner-padding": "10px 25px", "line-height": "120%", "padding": "10px 25px", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle"};

export const Section = () => {
  const config = {
    tagName: 'mj-section',
    attributes: {
      ...assigned_default_values,
      'css-class': 'mjml-tag identifier-mj-section',
      'background-color': '#fff',
      'text-align': 'center',
    },
    children: [],
    cannot_have: ['mj-section'],
    mutableProperties: properties,
    mutalbePropertiesWithDefaultValues: properties_with_default_values,
  };

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.setData('config', JSON.stringify(config));
    console.log(e);
  };
  // access type, etc from comp nd set to context

  let dynamicRenderer = [1, 2, 3, 4, 5, 6].map((value, index) => {
    return (
      <Fragment key={value}>
        <SectionTitle key={value + index + 'title'}>
          <p>{value} Column</p>
        </SectionTitle>
        <SectionImage key={value + index + 'section'} draggable={true} onDragStart={onDragStart}>
          <div className="wrapper">
            <div className="border">
              <Generator length={value} />
            </div>
          </div>
        </SectionImage>
      </Fragment>
    );
  });
  return <>{dynamicRenderer}</>;
};

const SectionTitle = styled(Row)`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  p {
    text-align: inherit;
    color: rgb(85, 85, 85);
    font-size: 14px;
    font-weight: 600;
  }
`;

const SectionImage = styled(Row)`
  background-color: rgb(252, 252, 252);
  border: 1px solid rgb(229, 229, 229);
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  box-shadow: none;
  cursor: grab;

  &:hover {
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 20%) 0px 1px 4px;
    border-color: rgb(255, 255, 255);
  }

  .wrapper {
    margin: 10px;
    background-color: rgb(255, 255, 255);
    position: relative;
    width: 100%;
    display: flex;
    border-radius: 3px;
    box-sizing: border-box;

    .border {
      border: 1px solid rgb(85, 85, 85);
      border-radius: 3px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
`;

const Generator = ({ length }: { length: number }) => {
  let content = [];
  const flexGrow = floor(100 / length);

  for (let i = 0; i < length; i++) {
    content.push(
      <div
        key={i + flexGrow}
        style={{
          display: 'flex',
          flexGrow,
          height: '16px',
          borderRight: i === length - 1 ? '' : '1px solid rgb(85, 85, 85)',
          borderRadius: '0px',
        }}
      ></div>
    );
  }
  return <>{content}</>;
};
