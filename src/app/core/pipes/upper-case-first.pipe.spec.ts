import { UpperCaseFirstPipe } from './upper-case-first.pipe';

describe('UpperCaseFirstPipe', () => {
  const pipe = new UpperCaseFirstPipe();
  it('transform', () => {
    expect(pipe.transform('something')).toBe('Something');
  });

  it('transform empty string', () => {
    expect(pipe.transform('')).toBe(null);
  });

});
