import { describe, expect, it } from 'bun:test';
import { container, inject } from '@';

describe('container', () => {
  class Katana {
    public readonly damage: number = 10;
  }

  class Ninja {
    constructor(
      @inject(Katana)
      public readonly katana: Katana,
    ) {}
  }

  it('should define Ninja and its dependencies', () => {
    container.bind(Ninja).toSelf();
    container.bind(Katana).toSelf();

    const ninja: Ninja = container.get(Ninja);
    expect(ninja).toBeInstanceOf(Ninja);
    expect(ninja.katana.damage).toEqual(10);
  });
});
