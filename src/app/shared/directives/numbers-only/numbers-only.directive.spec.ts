import { NumbersOnlyDirective } from './numbers-only.directive';

describe('NumbersOnlyDirective', () => {
  const directive = new NumbersOnlyDirective();
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should allow alphabets', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = false;
    const event = new Event('keypress');
    Object.defineProperty(event, 'keyCode', {'value': 81});
    spyOn(event, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onKeyDown(event);
    expect(preventDefaultCalled).toBeFalsy();
  });

  it('should allow alphabets with nodecimal', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = false;
    directive.noDecimal = false;
    const event = new Event('keypress');
    Object.defineProperty(event, 'keyCode', {'value': 81});
    spyOn(event, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onKeyDown(event);
    expect(preventDefaultCalled).toBeFalsy();
  });

  it('should not allow alphabets', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = true;
    const event = new Event('keypress');
    // char: q
    Object.defineProperty(event, 'keyCode', {'value': 81});
    spyOn(event, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onKeyDown(event);
    expect(preventDefaultCalled).toBeTruthy();
  });

  it('should allow numeric', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = true;
    const event = new Event('keypress');
    // char: 3
    Object.defineProperty(event, 'keyCode', {'value': 51});
    spyOn(event, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onKeyDown(event);
    expect(preventDefaultCalled).toBeFalsy();
  });

  it('should allow home end ...etc', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = true;
    const event = new Event('keypress');
    // char: 3
    Object.defineProperty(event, 'keyCode', {'value': 37});
    spyOn(event, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onKeyDown(event);
    expect(preventDefaultCalled).toBeFalsy();
  });

  it('should allow special char', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = true;
    const event = new Event('keypress');
    // char: 3
    Object.defineProperty(event, 'keyCode', {'value': 27});
    spyOn(event, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onKeyDown(event);
    expect(preventDefaultCalled).toBeFalsy();
  });

  it('should allow numeric while pasting', () => {
    let preventDefaultCalled = false;
    directive.appNumbersOnly = true;
    const e = {
      clipboardData: {
        getData(name: string) {
          return 1234;
        }
      },
      preventDefault: () => {}
    };
    spyOn(e, 'preventDefault').and.callFake(() => {
      preventDefaultCalled = true;
    });
    directive.onPaste(e);
    expect(e.preventDefault).toHaveBeenCalledTimes(0);
  });
});
