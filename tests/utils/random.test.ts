import { describe, expect, it } from 'bun:test';
import { random } from '@';

describe('random', () => {
  describe('uuid', () => {
    it('should generate a valid UUID', () => {
      const uuid = random.uuid();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('uuidv7', () => {
    it('should generate a valid UUIDv7', () => {
      const uuid = random.uuidv7();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('nanoid', () => {
    it('should generate a string with default length of 10', () => {
      const id = random.nanoid();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{10}$/);
    });

    it('should generate a string with specified length', () => {
      const id = random.nanoid(15);
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{15}$/);
    });
  });

  describe('stringInt', () => {
    it('should generate a string with default length of 10', () => {
      const randomInt = random.stringInt();
      expect(typeof randomInt).toBe('string');
      expect(randomInt).toMatch(/^[0-9]{10}$/);
    });

    it('should generate a string with specified length', () => {
      const randomInt = random.stringInt(15);
      expect(typeof randomInt).toBe('string');
      expect(randomInt).toMatch(/^[0-9]{15}$/);
    });
  });

  describe('nanoidFactory', () => {
    it('should return a function that generates ids with default length', () => {
      const generator = random.nanoidFactory();
      const id = generator();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{10}$/);
    });

    it('should return a function that generates ids with specified length', () => {
      const generator = random.nanoidFactory(15);
      const id = generator();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{15}$/);

      // Generator should respect override size
      const customId = generator(20);
      expect(customId).toMatch(/^[0-9a-f]{20}$/);
    });
  });
});
