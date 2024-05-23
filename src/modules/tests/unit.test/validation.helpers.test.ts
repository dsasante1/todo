// test/validationHelper.spec.ts

import { expect } from 'chai';
import { ValidationHelper } from '../../../utils/helpers/validation.helper';
import { z } from 'zod';

describe('ValidationHelper', () => {
  it('should validate a required string', () => {
    const schema = ValidationHelper.stringCheck(3);
    expect(() => schema.parse('abc')).not.to.throw();
    expect(() => schema.parse('ab')).to.throw(z.ZodError);
  });

  it('should validate a required number', () => {
    const schema = ValidationHelper.numberCheck(5);
    expect(() => schema.parse(5)).not.to.throw();
    expect(() => schema.parse(4)).to.throw(z.ZodError);
  });

  it('should validate an optional string', () => {
    const schema = ValidationHelper.editstringCheck();
    expect(() => schema.parse(null)).not.to.throw();
    expect(() => schema.parse(undefined)).not.to.throw();
    expect(() => schema.parse('abc')).not.to.throw();
  });

  it('should validate an optional number', () => {
    const schema = ValidationHelper.editnumberCheck();
    expect(() => schema.parse(null)).not.to.throw();
    expect(() => schema.parse(undefined)).to.throw(z.ZodError);
    expect(() => schema.parse(5)).not.to.throw();
  });


  it('should validate a required email', () => {
    const schema = ValidationHelper.bulkEmailCheck(1);
    expect(() => schema.parse('test@example.com')).not.to.throw();
    expect(() => schema.parse('invalid-email')).to.throw(z.ZodError);
  });

  it('should validate a phone number', () => {
    const schema = ValidationHelper.phoneCheck(10, 14);
    expect(() => schema.parse('1234567890')).not.to.throw();
    expect(() => schema.parse('123')).to.throw(z.ZodError);
    expect(() => schema.parse('123456789012345')).to.throw(z.ZodError);
  });

  it('should validate an optional date', () => {
    const schema = ValidationHelper.dateCheck();
    expect(() => schema.parse(null)).not.to.throw();
    expect(() => schema.parse(undefined)).not.to.throw();
    expect(() => schema.parse(new Date())).not.to.throw();
  });
});
