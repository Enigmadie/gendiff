import { has } from 'lodash';
import isObject from './utils';

const propertyActions = [
  {
    type: 'add',
    children: () => [],
    check: (first, second, el) => !has(first, el),
  },
  {
    type: 'delete',
    children: () => [],
    check: (first, second, el) => !has(second, el),
  },
  {
    type: 'update',
    children: (func, first, second, el) => (isObject(second[el], first[el])
      ? func(first[el], second[el])
      : []),
    check: (first, second, el) => first[el] !== second[el],
  },
  {
    type: 'stay',
    children: () => [],
    check: (first, second, el) => first[el] === second[el],
  },
];

const getPropertyActions = (arg1, arg2, value) => (
  propertyActions.find(({ check }) => check(arg1, arg2, value))
);

const genDifAst = (before, after) => {
  const fileKeys = Object.keys({ ...before, ...after });

  const iterAst = fileKeys.reduce((acc, name) => {
    const { type, children } = getPropertyActions(before, after, name);
    const format = {
      type,
      name,
      beforeValue: before[name],
      afterValue: after[name],
      children: children(genDifAst, before, after, name),
    };
    return [...acc, format];
  }, []);
  return iterAst;
};
export default genDifAst;