const typeoftag = (className: string) => {
  let regExMatch = 'content';
  let regex = className.match(/identifier-mj-(.*)/);
  if (regex) {
    regExMatch = regex[1];
    if (regExMatch.includes('social-element')) {
      regExMatch = regExMatch.replace('social-element', 'icon');
    }

    if (regExMatch.includes('-')) {
      regExMatch = regExMatch.split('-')[0];
    }
  }
  return regExMatch;
};

export { typeoftag };
