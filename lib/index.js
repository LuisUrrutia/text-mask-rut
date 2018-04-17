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

export const cleanRutPart = (toClean, includeThousandsSeparator = false) => {
  const withoutNonDigits = toClean.replace(/[^\dkK]+/g, '');
  const withoutLeadingZeros = withoutNonDigits.replace(/^0+(0$|[^0])/, '$1');

  let rut = withoutLeadingZeros.slice(0, 8);
  rut = rut.replace(/[kK]+/g, '');

  const excess = withoutLeadingZeros.slice(8, 9);

  return {
    rut: (includeThousandsSeparator) ? addThousandsSeparator(rut) : rut,
    excess,
  };
};

const createRutMask = ({
  includeThousandsSeparator = true,
} = {}) => {
  function rutMask(rawValue = '') {
    if (rawValue === '') { return [/\d/]; }

    const indexOfVdSeparator = rawValue.lastIndexOf('-');

    let mask;
    let rawRut = rawValue;
    let dv = [];

    if (indexOfVdSeparator !== -1) {
      rawRut = rawValue.slice(0, indexOfVdSeparator);
      dv = rawValue.slice(indexOfVdSeparator + 1, rawValue.length);

      dv = convertToMask(dv.replace(/[^\dkK]+/, ''));
    }

    const { rut, excess } = cleanRutPart(rawRut, includeThousandsSeparator);

    if (excess !== '' && dv.length === 0) {
      dv = convertToMask(excess);
    }

    mask = convertToMask(rut);

    if (rawValue[indexOfVdSeparator - 1] !== '-') {
      mask.push('[]');
    }
    mask.push('-', '[]');

    if (dv.length > 0) {
      dv = dv.slice(0, 1);
      mask = mask.concat(dv);
    }

    if (rawValue[indexOfVdSeparator] === '-' && dv.length === 0) {
      mask.push(/[\dkK]/);
    }

    return mask;
  }

  rutMask.instanceOf = 'createRutMask';

  return rutMask;
};

export default createRutMask;

