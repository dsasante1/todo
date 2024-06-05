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


});
