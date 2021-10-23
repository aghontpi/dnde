import { Row } from 'antd';
import _, { floor } from 'lodash';
import { Fragment, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { useCkeditor } from '../Hooks/Ckeditor.hook';
import { findUniqueIdentifier } from '../Utils/closestParent';
import { dragStart } from '../Utils/dragStart';

export type DragEvent = SyntheticEvent & { dataTransfer: DataTransfer };

// prettier-ignore
const properties = ['background-color', 'background-position', 'background-position-x', 'background-position-y', 'background-repeat', 'background-size', 'background-url', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-top', 'css-class', 'direction', 'full-width', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'text-align'];

// prettier-ignore
const properties_with_default_values = {"background-color": "", "background-position": "top center", "background-position-x": "none", "background-position-y": "none", "background-repeat": "repeat", "background-size": "auto", "background-url": "", "border": "none", "border-bottom": "", "border-left": "", "border-radius": "", "border-right": "", "border-top": "", "css-class": "", "direction": "ltr", "full-width": "", "padding": "20px 0", "padding-bottom": "", "padding-left": "", "padding-right": "", "padding-top": "", "text-align": "center"};

// prettier-ignore
const assigned_default_values  = {"align": "center", "background-color": "#414141", "border": "none", "border-radius": "3px", "color": "#ffffff", "font-family": "Ubuntu, Helvetica, Arial, sans-serif", "font-size": "13px", "font-weight": "normal", "inner-padding": "10px 25px", "line-height": "120%", "padding": "10px 25px", "target": "_blank", "text-align": "none", "text-decoration": "none", "text-transform": "none", "vertical-align": "middle"};

// prettier-ignore
const properties_column = ["background-color", "inner-background-color", "border", "border-bottom", "border-left", "border-right", "border-top", "border-radius", "inner-border", "inner-border-bottom", "inner-border-left", "inner-border-right", "inner-border-top", "inner-border-radius", "width", "vertical-align", "padding", "padding-top", "padding-bottom", "padding-left", "padding-right", "css-class"]

// prettier-ignore
const properties_with_default_values_column = {"background-color": "", "inner-background-color": "", "border": "none", "border-bottom": "", "border-left": "", "border-right": "", "border-top": "", "border-radius": "", "inner-border": "", "inner-border-bottom": "", "inner-border-left": "", "inner-border-right": "", "inner-border-top": "", "inner-border-radius": "", "width": "(100 / number of non-raw elements in section)%", "vertical-align": "top", "padding": "", "padding-top": "", "padding-bottom": "", "padding-left": "", "padding-right": "", "css-class": ""}

// prettier-ignore
const assigned_default_values_column = {"border": "none", "width": "(100 / number of non-raw elements in section)%", "vertical-align": "top"}

export const columnPlaceholder = [
  {
    tagName: 'mj-image',
    attributes: {
      src: 'https://dev.bluepie.in/assets/87583817874843.svg',
      'css-class': 'mj-placeholder',
      width: '120px',
    },
  },
  {
    tagName: 'mj-text',
    attributes: {
      'padding-top': '0px',
      'font-size': '16px',
      align: 'center',
      'css-class': 'mj-placeholder',
    },
    content: 'drag and drop a content block here!',
  },
];

export const COLUMN = {
  tagName: 'mj-column',
  attributes: {
    'css-class': 'mjml-tag identifier-mj-column',
    padding: '0px 0px',
  },
  children: [...columnPlaceholder],
  mutableProperties: properties_column,
};

export const SECTION = {
  tagName: 'mj-section',
  attributes: {
    ...assigned_default_values,
    'css-class': 'mjml-tag identifier-mj-section',
    'border-radius': '0px',
    'background-color': '#fff',
    'text-align': 'center',
  },
  children: [],
  cannot_have: ['mj-section', 'mj-column'], // 'https://documentation.mjml.io/#mj-column' Columns cannot be nested into columns, and sections cannot be nested into columns as well.
  mutableProperties: properties,
};

export const Section = () => {
  let config = {
    ...SECTION,
  };

  const {
    drag: { setIsColumn },
  } = useCkeditor();

  const onDragStart = (e: DragEvent) => {
    const target = e.target as Element;
    const identifier = findUniqueIdentifier(target, target.classList, 'mj-columns');
    if (identifier) {
      const match = identifier.match(/mj-columns-(.*)/);
      if (match) {
        let count = parseInt(match[1]);
        let children = [];
        while (count > 0) {
          children.push(COLUMN);
          count--;
        }
        config = _.set(config, 'children', children);
      }
    }
    dragStart(e as any, config);
    setIsColumn(true);
  };

  let dynamicRenderer = [1, 2, 3, 4].map((value, index) => {
    return (
      <Fragment key={value}>
        <SectionTitle key={value + index + 'title'}>
          <p>{value} Column</p>
        </SectionTitle>
        <SectionImage
          key={value + index + 'section'}
          className={`mj-columns-${value}`}
          draggable={true}
          onDragStart={onDragStart}
        >
          <div className={`wrapper`}>
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
