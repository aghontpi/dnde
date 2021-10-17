import html2canvas from 'html2canvas';

const generatePreview = async (htmlString: string) => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');

  let previewElement = document.createElement('div');
  document.body.appendChild(previewElement);
  previewElement.appendChild(doc.documentElement);
  const base64Image = await html2canvas(previewElement.getElementsByTagName('body')[0] as unknown as HTMLElement, {
    useCORS: true,
    removeContainer: true,
    backgroundColor: null,
    scale: 0.3,
  });
  console.log('::preview', base64Image.toDataURL('image/png', 0.5));
  previewElement.remove();
  return base64Image;
};

export { generatePreview };
