import { defaultValue, defined, JulianDate, Property } from "cesium";

export const getValueOrDefault = (
  property: any,
  time: JulianDate,
  valueDefault: any,
  result: any
) => {
  return defined(property)
    ? defaultValue(property.getValue(time, result), valueDefault)
    : valueDefault;
};

export const equals = function (left: any, right: any) {
  return left === right || (defined(left) && left.equals(right));
};

export const isConstant = (property: any) => {
  return !defined(property) || property.isConstant;
};

export const getValueOrClonedDefault = (
  property: Property | any,
  time: JulianDate,
  valueDefault: any,
  result: any
) => {
  let value;
  if (defined(property)) {
    value = property.getValue(time, result);
  }
  if (!defined(value)) {
    value = valueDefault.clone(value);
  }
  return value;
};

export default {
  getValueOrDefault,
  getValueOrClonedDefault,
  equals,
  isConstant,
};
