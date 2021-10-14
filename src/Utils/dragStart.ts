const dragStart = (e: DragEvent, config: any) => {
  if (e && e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    const draggingItem = e.target as HTMLElement;
    e.dataTransfer.setDragImage(draggingItem, -5, -5);
    e.dataTransfer.setData('config', JSON.stringify(config));
  }
};

export { dragStart };
