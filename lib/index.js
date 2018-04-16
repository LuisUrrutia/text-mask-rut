export const convertToMask = strNumber => strNumber
  .split('')
  .map((char) => {
    if (char === '.') {
      return '.';
    } else if (char.toLowerCase() === 'k') {
      return /[kK]/;
    }
    return /\d/;
  });

// http://stackoverflow.com/a/10899795/604296
export const addThousandsSeparator = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const createRutMask = ({
  includeThousandsSeparator = true,
} = {}) => {
  function rutMask(rawValue = '') {
    const rawValueLength = rawValue.length;

    if (rawValue === '') {
      return [/\d/];
    }

    const indexOfVdSeparator = rawValue.lastIndexOf('-');
    const hasSeparator = indexOfVdSeparator !== -1;

    let rut;
    let dv;
    let mask;

    if (hasSeparator) {
      rut = rawValue.slice(0, indexOfVdSeparator);
      dv = rawValue.slice(indexOfVdSeparator + 1, rawValueLength);

      dv = convertToMask(dv.replace(/[^\dkK]+/, ''));
    } else {
      rut = rawValue;
    }

    const thousandsSeparatorRegex = '[.]';
    const numberOfThousandSeparators = (rut.match(new RegExp(thousandsSeparatorRegex, 'g')) || []).length;

    // No more than 8 digits
    const rutLimit = 8 + numberOfThousandSeparators;
    const excess = rut.slice(rutLimit, rutLimit + 1);
    rut = rut.slice(0, rutLimit);

    if (excess !== '' && (dv === undefined || dv.length === 0)) {
      dv = convertToMask(excess.replace(/[^\dkK]+/, ''));
    }

    rut = rut.replace(/\D+/g, '');
    rut = rut.replace(/^0+(0$|[^0])/, '$1');

    rut = (includeThousandsSeparator) ? addThousandsSeparator(rut) : rut;

    mask = convertToMask(rut);

    if (rawValue[indexOfVdSeparator - 1] !== '-') {
      mask.push('[]');
    }
    mask.push('-', '[]');

    if (dv) {
      dv = dv.slice(0, 1);
      mask = mask.concat(dv);
    }

    if (rawValue[indexOfVdSeparator] === '-' && (dv === undefined || dv.length === 0)) {
      mask.push(/[\dkK]/);
    }

    return mask;
  }

  rutMask.instanceOf = 'createRutMask';

  return rutMask;
};

export default createRutMask;

