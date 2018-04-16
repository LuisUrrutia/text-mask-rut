import createRutMask, { convertToMask, addThousandsSeparator } from '../lib/index';

describe('Mask conversion', () => {
  it('should return a dot', () => {
    const result = convertToMask('.');
    expect(result).toEqual(['.']);
  });

  it('should return a regex to match the k char', () => {
    const result = convertToMask('k');
    const regex = result[0];

    expect(regex.test('k')).toBe(true);
    expect(regex.test('K')).toBe(true);
    expect(regex.test('a')).toBe(false);
    expect(regex.test('1')).toBe(false);
    expect(regex.test('-')).toBe(false);
  });

  it('should return a digit regex matcher if is another thing', () => {
    const result = convertToMask('a');
    const regex = result[0];

    expect(regex.test(1)).toBe(true);
    expect(regex.test('e')).toBe(false);
  });

  it('should return an array of masking', () => {
    const result = convertToMask('Hello World');

    expect(result.length).toBe(11);
  });
});

describe('Thousands Separator', () => {
  it('should add the thousands separator to a number', () => {
    const result = addThousandsSeparator(1000);

    expect(result).toEqual('1.000');
  });

  it('should add the thousands separator to a string number', () => {
    const result = addThousandsSeparator('69000000');

    expect(result).toEqual('69.000.000');
  });
});

describe('RUT Mask Creator', () => {
  it('should return the base mask to enter a number', () => {
    const rutMask = createRutMask();

    expect(rutMask()).toEqual([/\d/]);
  });

  it('should return the mask with the caret trap and the verification digit separator', () => {
    const rutMask = createRutMask();

    const expected = [
      /\d/,
      '[]',
      '-',
      '[]',
    ];
    expect(rutMask('1')).toEqual(expected);
  });


  it('should return a base mask because the invalid value', () => {
    const rutMask = createRutMask();

    const expected = [
      '[]',
      '-',
      '[]',
    ];
    expect(rutMask('abc')).toEqual(expected);
  });

  it('should return the next valid value for verification digit', () => {
    const rutMask = createRutMask();

    const expected = [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '[]',
      '-',
      '[]',
      /[\dkK]/,
    ];
    expect(rutMask('17882988-')).toEqual(expected);
  });

  it('should return the complete mask for "pasted" rut without the verification digit included', () => {
    const rutMask = createRutMask();

    const expected = [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '[]',
      '-',
      '[]',
      /\d/,
    ];
    expect(rutMask('178829882')).toEqual(expected);
  });

  it('should return the complete mask for "pasted" rut with the verification digit included', () => {
    const rutMask = createRutMask();

    const expected = [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '[]',
      '-',
      '[]',
      /[kK]/,
    ];
    expect(rutMask('19997050-k')).toEqual(expected);
  });

  it('should return a mask without the thousands separator', () => {
    const rutMask = createRutMask({
      includeThousandsSeparator: false,
    });

    const expected = [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '[]',
      '-',
      '[]',
      /\d/,
    ];
    expect(rutMask('17882988-2')).toEqual(expected);
  });

  it('should return the right mask for an excessive string', () => {
    const rutMask = createRutMask();

    const expected = [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '[]',
      '-',
      '[]',
      /\d/,
    ];
    expect(rutMask('178829882-')).toEqual(expected);
  });

  it('should return the right mask for a double dashed string', () => {
    const rutMask = createRutMask();

    const expected = [
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      '[]',
      /[\dkK]/,
    ];
    expect(rutMask('1788298--')).toEqual(expected);
  });
});
