import { Row } from 'antd';
import { floor } from 'lodash';
import { SyntheticEvent } from 'react';
import styled from 'styled-components';
import { UiWrapper } from './UiWrapper';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ['align', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-top', 'color', 'container-background-color', 'css-class', 'font-family', 'font-size', 'font-style', 'font-weight', 'height', 'href', 'inner-padding', 'letter-spacing', 'line-height', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'rel', 'target', 'text-align', 'text-decoration', 'text-transform', 'title', 'vertical-align', 'width'];

// prettier-ignore
const properties_with_default_values = {"align": "center", "background-color": "#414141", "border": "none", "border-bottom": "", "border-left": "", "border-radius": "3px", "border-right": "", "border-top": "", "color": "#ffffff", "container-background-color": "", "css-class": "", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-style": "", "font-weight": "normal", "height": "", "href": "", "inner-padding": "10px 25px", "letter-spacing": "", "line-height": "120%", "padding": "10px 25px", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "rel": "", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "title": "", "vertical-align": "middle", "width": ""}

// prettier-ignore
const assigned_default_values  = {"align": "center", "background-color": "#414141", "border": "none", "border-radius": "3px", "color": "#ffffff", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-weight": "normal", "inner-padding": "10px 25px", "line-height": "120%", "padding": "10px 25px", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle"}

export const Section = () => {
  const config = {
    tagName: 'mj-button',
    attributes: {
      ...assigned_default_values,
      'border-right': '',
      'border-top': '',
      'border-bottom': '',
      'border-left': '',
      'css-class': 'button',
    },
    children: [],
    content: 'Customize this button!',
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
      <>
        <SectionTitle>
          <p>{value} Column</p>
        </SectionTitle>
        <SectionImage draggable={true}>
          <div className="wrapper">
            <div className="border">
              <Generator length={value} />
            </div>
          </div>
        </SectionImage>
      </>
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
