import path from 'path';

function escapeFileName(str: string) {
  return `svg-${path.basename(str, '.svg')}`
    .split(/\W+/)
    .map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`)
    .join('');
}

const transform = (src: string, filePath: string) => {
  if (path.extname(filePath) !== '.svg') {
    return src;
  }

  const { base: pathname, name: filename } = path.parse(filePath);
  const functionName = escapeFileName(filePath);

  return {
    code: `
    const React = require('react');
    const ${functionName} = (props) => 
    {
        return React.createElement('svg', { 
          ...props, 
        'data-jest-file-name': '${pathname}',
        'data-jest-svg-name': '${filename}',
        'data-testid': '${filename}'
      });
    }
    module.exports.default = ${functionName};
    module.exports.ReactComponent = ${functionName};
    `,
  };
};

export default {
  process: transform,
};
