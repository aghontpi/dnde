import { floor } from 'lodash';

const isEventWithTargetElement = (event: any, target: HTMLElement) => {
  const pos = target.getBoundingClientRect();
  const eventX = event.clientX;
  const eventY = event.clientY;

  let within = pos && eventX && eventY && true;

  if (eventX < pos.left || eventX > pos.right) {
    within = false;
  }

  if (eventY < pos.top || eventY > pos.bottom) {
    within = false;
  }

  return within;
};

const closeToTopOrBottom = (event: any, target: HTMLElement) => {
  const pos = target.getBoundingClientRect();
  const eventY = event.clientY;

  if (isEventWithTargetElement(event, target)) {
    const middle = floor((pos.bottom - pos.top) / 2) + pos.top;
    if (eventY < middle) {
      return 'top';
    } else if (eventY > middle) {
      return 'bottom';
    }
  }

  return false;
};

export { isEventWithTargetElement, closeToTopOrBottom };
