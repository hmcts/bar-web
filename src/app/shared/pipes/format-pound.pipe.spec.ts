import { FormatPound } from './format-pound.pipe';

describe('FormatPound', () => {
  const formatPound = new FormatPound('GB');

  it('the amount should be displayed properly', () => {
    expect(formatPound.transform(100)).toEqual('£100.00');
  });
});
