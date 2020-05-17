/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  // eslint-disable-next-line func-names
  this.getArea = function () {
    return width * height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);

  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  string: '',
  element(value) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${this.string}${value}`;
    cssObject.propertyID = 1;
    this.checkCorrectness(cssObject.propertyID);
    return cssObject;
  },

  id(value) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${this.string}#${value}`;
    cssObject.propertyID = 2;
    this.checkCorrectness(cssObject.propertyID);
    return cssObject;
  },

  class(value) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${this.string}.${value}`;
    cssObject.propertyID = 3;
    this.checkCorrectness(cssObject.propertyID);
    return cssObject;
  },

  attr(value) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${this.string}[${value}]`;
    cssObject.propertyID = 4;
    this.checkCorrectness(cssObject.propertyID);
    return cssObject;
  },

  pseudoClass(value) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${this.string}:${value}`;
    cssObject.propertyID = 5;
    this.checkCorrectness(cssObject.propertyID);
    return cssObject;
  },

  pseudoElement(value) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${this.string}::${value}`;
    cssObject.propertyID = 6;
    this.checkCorrectness(cssObject.propertyID);
    return cssObject;
  },

  combine(selector1, combinator, selector2) {
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.string = `${selector1.string} ${combinator} ${selector2.string}`;
    return cssObject;
  },

  stringify() {
    return this.string;
  },

  checkCorrectness(x) {
    this.checkUniqueness(x);
    this.checkOrder(x);
  },

  checkUniqueness(x) {
    if (this.propertyID === x && [1, 2, 6].includes(x)) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  },

  checkOrder(x) {
    if (this.propertyID > x) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
