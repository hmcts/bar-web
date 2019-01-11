import { FormatPound } from './format-pound.pipe';

describe('FormatPound', () => {
  const formatPound = new FormatPound();

  it('the amount should be displayed properly', () => {
    expect(formatPound.transform(100)).toEqual('£100.00');
  });

  it('if the value is null or undefined it should return empty string', () => {
    expect(formatPound.transform(null)).toEqual('-');
    expect(formatPound.transform(undefined)).toEqual('-');
  });

  it('if the value is 0 it should return 0.00 or - depending on the parameters', () => {
    expect(formatPound.transform(0)).toEqual('£0.00');
    expect(formatPound.transform(0, true)).toEqual('-');
  });
});
