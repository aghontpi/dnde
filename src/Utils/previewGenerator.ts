import html2canvas from 'html2canvas';

const generatePreview = async (htmlString: string) => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');

  let previewElement = document.createElement('div');
  previewElement.appendChild(doc.documentElement);
  previewElement.setAttribute('id', 'preview');
  previewElement.setAttribute('visibility', 'hidden');
  document.body.appendChild(previewElement);
  const previewElementPosition = previewElement.getBoundingClientRect();
  const base64Image = await html2canvas(previewElement.getElementsByTagName('html')[0] as unknown as HTMLElement, {
    removeContainer: true,
    allowTaint: true,
    useCORS: true,
    backgroundColor: null,
    scale: 0.3,
    width: previewElementPosition.width,
    height: document.getElementsByClassName('mjml-wrapper')[0].getBoundingClientRect().height - 200,
    x: previewElementPosition.x,
    y: previewElementPosition.y,
  });
  previewElement.remove();
  console.log('::preview', base64Image.toDataURL('image/png', 0.5));
  const base64String = await base64Image.toDataURL('image/png', 0.6);
  return base64String;
};

export { generatePreview };