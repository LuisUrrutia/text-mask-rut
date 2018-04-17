import create from '../lib/index-umd';

describe('UMD index', () => {
  it('should export the create rut mask function', () => {
    expect(create).toBeInstanceOf(Function);

    const result = create();

    expect(result.instanceOf).toBe('createRutMask');
  });
});
