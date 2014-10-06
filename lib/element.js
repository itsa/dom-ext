"use strict";

module.exports = function (window) {

    var POSITION = 'position',
    RESERVED_WORDS = require('js-ext/extra/reserved-words.js'),

    toCamelCase = function(input) {
        return input.toLowerCase().replace(/-(.)/g, function(match, group) {
            return group.toUpperCase();
        });
    };

    window.Element && (function(ElementPrototype) {

        require('js-ext/lib/string.js');
        require('./document.js')(window);
        require('polyfill/lib/element.matchesselector.js')(window);
        require('window-ext')(window);

        var documentElement = window.document.documentElement;

       /**
        * Adds a class to the HtmlElement. If the class already exists it won't be duplicated.
        *
        * @method addClass
        * @param className {String} className to be added
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.addClass = function(className) {
            var instance = this;
            instance.hasClass(className) || (instance.className += ((instance.className.length>0) ? ' ' : '') + className);
            return instance;
        };

       /**
        * Appends a HtmlElement or text at the end of HtmlElement's innerHTML.
        *
        * @method append
        * @param content {HtmlElement|HtmlElementList|String} content to append
        * @param escape {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.append = function(content, escape) {
            return window.document._insert(this, 'appendChild', content, null, escape);
        };

       /**
        * Sets the inline-style of the HtmlElement exactly to the specified `value`, overruling previous values.
        * Making the HtmlElement's inline-style look like: style="value".
        *
        * This is meant for a quick one-time setup. For individually inline style-properties to be set, you can use `setInlineStyle()`.
        *
        * @method defineInlineStyle
        * @param value {String} the style string to be set
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.defineInlineStyle = function(value) {
            this.style.cssText = value;
            return this;
        };

       /**
        * Returns the first of the HtmlElement's siblings, or the first that matches `cssSelector`.
        *
        * @method first
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.first = function(cssSelector) {
            return window.document.first.apply(this, arguments);
        };

       /**
        * Gets a NodeList of HtmlElements, specified by the css-selector.
        *
        * @method getAll
        * @param cssSelector {String} css-selector to match
        * @return {NodeList} NodeList of HtmlElements that match the css-selector
        * @since 0.0.1
        */
        ElementPrototype.getAll = function(cssSelector) {
            return window.document.getAll.apply(this, arguments);
        };

       /**
        * Gets an attribute of the HtmlElement.
        * Cautious: do not use `value` to retrieve the value. Use `getValue()` instead.
        *
        * Alias for getAttribute().
        *
        * @method getAttr
        * @param attributeName {String}
        * @return {String|null} value of the attribute
        * @since 0.0.1
        */
        ElementPrototype.getAttr = function(attributeName) {
            return this.getAttribute.apply(this, arguments);
        };

       /**
        * Gets the HtmlElement's class as a whole String.
        *
        * Alias for this.className
        *
        * @method getClass
        * @return {String} The complete class of the HtmlElement as a String
        * @since 0.0.1
        */
        ElementPrototype.getClass = function() {
            return this.className;
        };

       /**
        * Returns data set specified by `key`. If not set, `undefined` will be returned.
        *
        * @method getData
        * @param key {string} name of the key
        * @return {Any|undefined} data set specified by `key`
        * @since 0.0.1
        */
        ElementPrototype.getData = function(key) {
            return this._data && this._data[key];
        };

       /**
        * Gets one HtmlElement, specified by the css-selector. To retrieve a single element by id,
        * you need to prepend the id-name with a `#`. When multiple HtmlElement's match, the first is returned.
        *
        * @method getElement
        * @param cssSelector {String} css-selector to match
        * @return {HtmlElement|null} the HtmlElement that was search for
        * @since 0.0.1
        */
        ElementPrototype.getElement = function(cssSelector) {
            return window.document.getElement.apply(this, arguments);
        };

       /**
        * Gets the height of the element in pixels. Included are padding and border, not any margins.
        *
        * @method getHeight
        * @param [overflow=false] {Boolean} in case of elements that overflow: return total height, included the invisible overflow
        * @return {Number} width in pixels
        * @since 0.0.1
        */
        ElementPrototype.getHeight = function(overflow) {
            return overflow ? this.scrollHeight : this.offsetHeight;
        };

       /**
        * Returns the innerContent of the HtmlElement as a string with HTML entities.
        *
        * Alias for innerHTML
        *
        * @method getHtml
        * @return {String} content as a string with HTML entities
        * @since 0.0.1
        */
        ElementPrototype.getHtml = function() {
            return this.innerHTML;
        };

       /**
        * Gets the HtmlElement's id.
        *
        * Alias for this.id
        *
        * @method getId
        * @return {String} The id of the HtmlElement (=== '') when undefined
        * @since 0.0.1
        */
        ElementPrototype.getId = function() {
            return this.id;
        };

       /**
        * Returns inline style of the specified property. `Inline` means: what is set directly on the HtmlElement,
        * this doesn't mean necesairy how it is looked like: when no css is set inline, the HtmlElement might still have
        * an appearance because of other CSS-rules.
        *
        * In most cases, you would be interesting in using `getStyle()` instead.
        *
        * Note: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method getInlineStyle
        * @return {String} content as a string with HTML entities
        * @since 0.0.1
        */
        ElementPrototype.getInlineStyle = function(cssProperty) {
            return this.style[toCamelCase(cssProperty)];
        };

        /**
         * Gets the left-scroll offset of the content of the HtmlElement.
         * Only apropriate when the HtmlElement has overflow.
         *
         * @method getScrollLeft
         * @return {Number} left-offset in pixels
         * @since 0.0.1
        */
        ElementPrototype.getScrollLeft = function() {
            return this.scrollLeft;
        };

        /**
         * Gets the top-scroll offset of the content of the HtmlElement.
         * Only apropriate when the HtmlElement has overflow.
         *
         * @method getScrollTop
         * @return {Number} top-offset in pixels
         * @since 0.0.1
        */
        ElementPrototype.getScrollTop = function() {
            return this.scrollTop;
        };

       /**
        * Returns cascaded style of the specified property. `Cascaded` means: the actual present style,
        * the way it is visible (calculated through the DOM-tree).
        *
        * Note1: values are absolute: percentages and points are converted to absolute values, sizes are in pixels, colors in rgb/rgba-format.
        * Note2: you cannot query shotcut-properties: use `margin-left` instead of `margin`.
        * Note3: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine.
        *
        * @method getCascadeStyle
        * @param cssProperty {String} property that is queried
        * @param [pseudo] {String} to query pseudo-element, fe: `:before` or `:first-line`
        * @return {String} value for the css-property
        * @since 0.0.1
        */
        ElementPrototype.getStyle = function(cssProperty, pseudo) {
            return window.getComputedStyle(this, pseudo)[toCamelCase(cssProperty)];
        };

       /**
        * Gets the HtmlElement's tagname. Always uppercased.
        *
        * Alias for this.nodeName
        *
        * @method getTag
        * @return {String} The tag-name of the HtmlElement in uppercase
        * @since 0.0.1
        */
        ElementPrototype.getTag = function() {
            return this.nodeName;
        };

       /**
        * Gets the text content of the HtmlElement and its descendants.
        * If you need full HTML, you should use getHTML().
        *
        * Alias for textContent
        *
        * @method getText
        * @return {String} content of the HtmlElement as text
        * @since 0.0.1
        */
        ElementPrototype.getText = function() {
            var instance = this;
            if (window.documentElement.textContent) {
                return instance.textContent;
            }
            // now we are in IE8-, but it might not return the same as textContent
            // (see https://developer.mozilla.org/en-US/docs/Web/API/Node.textContent)
            // We accept this for it will be an edgecase we might never run into
            // and we prefer to keep the code lightweight
            return instance.innerText;
        };

       /**
        * Gets the width of the element in pixels. Included are padding and border, not any margins.
        *
        * @method getWidth
        * @param [overflow=false] {Boolean} in case of elements that overflow: return total width, included the invisible overflow
        * @return {Number} width in pixels
        * @since 0.0.1
        */
        ElementPrototype.getWidth = function(overflow) {
            return overflow ? this.scrollWidth : this.offsetWidth;
        };

       /**
        * Gets the value of the following HtmlElements:
        *
        * <ul>
        *     <li>input</li>
        *     <li>textarea</li>
        *     <li>select</li>
        *     <li>any container that is `contenteditable`</li>
        *
        * @method getValue
        * @return {String|null} value of the attribute
        * @since 0.0.1
        */
        ElementPrototype.getValue = function() {
            // cautious: input and textarea must be accessed by their propertyname:
            // input.getAttribute('value') would return the defualt-value instead of actusl
            // and textarea.getAttribute('value') doesn't exist
            var editable = ((editable=this.getAttr('contenteditable')) && (editable!=='false'));
            return editable ? this.innerHTML : this.value;
        };

       /**
        * Gets the x-position (in the window.document) of the element in pixels.
        * window.document-related: regardless of the window's scroll-position.
        *
        * @method getX
        * @return {Number} x-position in pixels
        * @since 0.0.1
        */
        ElementPrototype.getX = function() {
            return this.getBoundingClientRect().left + window.getScrollLeft();
        };

       /**
        * Gets the y-position (in the window.document) of the element in pixels.
        * window.document-related: regardless of the window's scroll-position.
        *
        * @method getY
        * @return {Number} y-position in pixels
        * @since 0.0.1
        */
        ElementPrototype.getY = function() {
            return this.getBoundingClientRect().top + window.getScrollTop();
        };

       /**
        * Whether the HtmlElement has the attribute set.
        *
        * Alias for hasAttribute().
        *
        * @method hasAttr
        * @param attributeName {String}
        * @return {Boolean} Whether the HtmlElement has the attribute set.
        * @since 0.0.1
        */
        ElementPrototype.hasAttr = function(attributeName) {
            return this.hasAttribute.apply(this, arguments);
        };

       /**
        * Checks whether the className is present on the Element.
        *
        * @method hasClass
        * @param newHtmlElement {HtmlElement} the new HtmlElement
        * @return {Boolean} whether the className is present on the Element
        * @since 0.0.1
        */
        ElementPrototype.hasClass = function(className) {
            var regexp = new RegExp('\\b' + className + '\\b');
            return regexp.test(this.className);
        };

       /**
        * If the Element has data set specified by `key`.
        *
        * @method hasData
        * @param key {string} name of the key
        * @return {Boolean}
        * @since 0.0.1
        */
        ElementPrototype.hasData = function(key) {
            return !!this._data && !!this._data[key];
        };

       /**
        * Checks whether HtmlElement currently has the focus.
        *
        * @method hasFocus
        * @param newHtmlElement {HtmlElement} the new HtmlElement
        * @return {Boolean} whether the className is present on the Element
        * @since 0.0.1
        */
        ElementPrototype.hasFocus = function() {
            return (window.document.activeElement===this);
        };

       /**
        * Inserts a HtmlElement or text inside HtmlElement's innerHTML after `refElement`.
        *
        * @method insertAfter
        * @param content {HtmlElement|HtmlElementList|String} content to insert
        * @param refElement {HtmlElement} the HtmlElement where the content should be placed after
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.insertAfter = function(content, refElement, escape) {
            return window.document.insertAfter.apply(this, arguments);
        };

       /**
        * Inserts a HtmlElement or text inside HtmlElement's innerHTML before `refElement`.
        *
        * @method insertBefore
        * @param content {HtmlElement|HtmlElementList|String} content to insert
        * @param refElement {HtmlElement} the HtmlElement where the content should be placed before
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.insertBefore = function(content, refElement, escape) {
            return window.document.insertBefore.apply(this, arguments);
        };

       /**
        * Returns the last of the HtmlElement's siblings, or the last that matches `cssSelector`.
        *
        * @method last
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.last = function(cssSelector) {
            return window.document.last.apply(this, arguments);
        };

       /**
        * Returns the next of the HtmlElement's siblings, or the next that matches `cssSelector`.
        *
        * @method next
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.next = function(cssSelector) {
            var found, nextElement;
            if (!cssSelector) {
                return this.nextElementSibling;
            }
/*jshint noempty:true */
            while ((nextElement=this.nextElementSibling) && (found=nextElement.matchesSelector(cssSelector))) {}
/*jshint noempty:false */
            return found && nextElement;
        };

       /**
        * Prepends a HtmlElement or text at the start of HtmlElement's innerHTML.
        *
        * @method prepend
        * @param content {HtmlElement|HtmlElementList|String} content to prepend
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.prepend = function(content, escape) {
            var instance = this,
                children = instance.children;
            if (children.length===0) {
                return instance.window.document._insert(instance, 'appendChild', content, null, escape);
            }
            return instance.window.document._insert(instance, 'insertBefore', content, children[0], escape);
        };

       /**
        * Returns the previous of the HtmlElement's siblings, or the previous that matches `cssSelector`.
        *
        * @method prev
        * @param [cssSelector] {String} css-selector to be used as a filter
        * @return {HtmlElement|null}
        * @since 0.0.1
        */
        ElementPrototype.prev = function(cssSelector) {
            var found, previousElement;
            if (!cssSelector) {
                return this.previousElementSibling;
            }
/*jshint noempty:true */
            while ((previousElement=this.previousElementSibling) && (found=previousElement.matchesSelector(cssSelector))) {}
/*jshint noempty:false */
            return found && previousElement;
        };

       /**
        * Removes the HtmlElement from the DOM.
        *
        * @method remove
        * @since 0.0.1
        */
        ElementPrototype.remove = function() {
            this.parentNode.removeChild(this);
        };

       /**
        * Removes the attribute from the HtmlElement.
        *
        * Alias for removeAttribute().
        *
        * @method removeAttr
        * @param attributeName {String}
        * @return {Boolean} Whether the HtmlElement has the attribute set.
        * @since 0.0.1
        */
        ElementPrototype.removeAttr = function(attributeName) {
            return this.hasAttribute.apply(this, arguments);
        };

       /**
        * Removes a className from the HtmlElement.
        *
        * @method removeClass
        * @param className {String} the className that should be removed.
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeClass = function(className) {
            var instance = this,
                regexp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');
            instance.className = instance.className.replace(regexp, ' ').trim();
            return instance;
        };

       /**
        * Removes data specified by `key`. When no arguments are passed, all node-data (key-value pairs) will be removed.
        *
        * @method removeData
        * @param key {string} name of the key
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeData = function(key) {
            var instance = this;
            if (instance._data) {
                if (key) {
                    delete instance._data[key];
                }
                else {
                    // we cannot just redefine _data, for it is set as readonly
                    instance._data.each(
                        function(value, key) {
                            delete instance._data[key];
                        }
                    );
                }
            }
            return instance;
        };

       /**
        * Removes a css-property (inline) out of the HtmlElement. Use camelCase.
        *
        * @method removeInlineStyle
        * @param cssAttribute {String} the css-property to be removed
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.removeInlineStyle = function(cssAttribute) {
            this.setInlineStyle(cssAttribute, '');
            return this;
        };

       /**
        * Replaces the HtmlElement with a new HtmlElement.
        *
        * @method replace
        * @param newHtmlElement {HtmlElement|String} the new HtmlElement
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @since 0.0.1
        */
        ElementPrototype.replace = function(newHtmlElement, escape) {
            window.document.replace(this, newHtmlElement, escape);
        };

       /**
        * Replaces the className of the HtmlElement with a new className.
        * If the previous className is not available, the new className is set nevertheless.
        *
        * @method replaceClass
        * @param prevClassName {String} the className to be replaced
        * @param newClassName {String} the className to be set
        * @param [force ] {Boolean} whether the new className should be set, even is the previous className isn't there
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.replaceClass = function(prevClassName, newClassName, force) {
            var instance = this;
            if (force || instance.hasClass(prevClassName)) {
                instance.removeClass(prevClassName).addClass(newClassName);
            }
            return instance;
        };

        /**
         * Scrolls the content of the HtmlElement into the specified scrollposition.
         * Only available when the HtmlElement has overflow.
         *
         * @method scrollTo
         * @param x {Number} left-offset in pixels
         * @param y {Number} top-offset in pixels
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.scrollTo = function(x, y) {
            var instance = this;
            instance.scrollLeft = x;
            instance.scrollTop = y;
            return instance;
        };

       /**
         * Sets the attribute on the HtmlElement with the specified value.
         *
         * Alias for setAttribute().
         *
         * @method setAttr
         * @param attributeName {String}
         * @param value {Any} the value that belongs to `key`
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.setAttr = function(attributeName, value) {
            this.setAttribute.apply(this, arguments);
            return this;
        };

       /**
        * Sets the HtmlElement's class as a whole String. Cleaning up any previous classes.
        *
        * Alias for this.className = value
        *
        * @method setClass
        * @param value {Any} the value that belongs to `key`
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setClass = function(value) {
            this.className = value;
            return this;
        };

        /**
         * Stores arbitary `data` at the HtmlElement. This has nothing to do with node-attributes whatsoever,
         * it is just a way to bind any data to the specific Element so it can be retrieved later on with `getData()`.
         *
         * @method setData
         * @param key {string} name of the key
         * @param value {Any} the value that belongs to `key`
         * @chainable
         * @since 0.0.1
        */
        ElementPrototype.setData = function(key, value) {
            var instance = this;
            instance._data ||  Object.defineProperty(instance, '_data', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: {} // `writable` is false means we cannot chance the value-reference, but we can change {}'s properties itself
            });
            instance._data[key] = value;
            return instance;
        };

       /**
        * Sets the content of the HtmlElement (innerHTML). Careful: only set content like this if you controll the data and
        * are sure what is going inside. Otherwise XSS might occur. If you let the user insert, or insert right from a db,
        * you might be better of using setContent().
        *
        * @method setHTML
        * @param content {HtmlElement|HtmlElementList|String} content to append
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setHTML = function(content) {
            this.innerHTML = content;
            return this;
        };

       /**
        * Gets the serialized HTML fragment describing the element including its descendants.
        *
        * alias for outerHTML()
        *
        * @method serialize
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.serialize = function() {
            return this.outerHTML;
        };

       /**
        * Sets a css-property (inline) out of the HtmlElement. Use camelCase.
        *
        * Note: no need to camelCase cssProperty: both `margin-left` as well as `marginLeft` are fine
        *
        * @method setStyle
        * @param cssAttribute {String} the css-property to be set
        * @param value {String} the css-value
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setInlineStyle = function(cssAttribute, value) {
            // cautious: in case of preserved words (fe `float`), we need to modify the attributename
            // in order to get it processed. It should be translated into `cssFloat` or alike.
            RESERVED_WORDS[cssAttribute] && (cssAttribute='css-'+cssAttribute); // will be camelCased in the next step
            this.style[toCamelCase(cssAttribute)] = String(value).replace(/;$/, '');
            return this;
        };

       /**
        * Sets the content of the HtmlElement. This is a safe way to set the content, because HTML is not parsed.
        * If you do need to set HTML inside the node, use setHTML().
        *
        * @method setText
        * @param content {HtmlElement|HtmlElementList|String} content to append. In case of HTML, it will be escaped.
        * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setText = function(content) {
            var instance = this;
            // IE8- do not have `textContent`, but they do have `innerText`
            if (documentElement.textContent) {
                instance.textContent = content;
            }
            else {
                instance.innerText = content;
            }
            return instance;
        };

       /**
        * Sets the value of the following HtmlElements:
        *
        * <ul>
        *     <li>input</li>
        *     <li>textarea</li>
        *     <li>select</li>
        *     <li>any container that is `contenteditable`</li>
        *
        * Will fire an `valuechange` event, in case both the `itsa/event` as well as
        * `itsa/event-dom/extra/event-valuechange.js` are used.
        *
        * Therefore it is highly suggested to use `setValue()` instead of setting the value manually.
        *
        * @method setValue
        * @param value {Any} the value to be set
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.setValue = function(value) {
            var instance = this;
            // cautious: input and textarea must be accessed by their propertyname:
            // input.getAttribute('value') would return the defualt-value instead of actusl
            // and textarea.getAttribute('value') doesn't exist
            var editable = ((editable=instance.getAttr('contenteditable')) && (editable!=='false'));
            if (editable) {
                instance.innerHTML = value;
            }
            else {
                instance.value = value;
            }
            // if `document._emitVC` is available, then invoke it to emit the `valuechange`-event
            window.document._emitVC && window.document._emitVC(instance, value);
            return instance;
        };

       /**
         * Set the position of an html element in page coordinates.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param element The target element
         * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        ElementPrototype.setXY = function(x, y) {
            var instance = this,
                position = instance.getStyle(POSITION),
                currentX, currentY;

            // default position to relative
            (position==='static') && instance.setInlineStyle(POSITION, 'relative');
            currentX = instance.getX();
            currentY = instance.getY();
            x && instance.setInlineStyle('left', (x - currentX) + 'px');
            y && instance.setInlineStyle('top', (y - currentY) + 'px');
        };

        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param element The target element
         * @param {Number} x The X values for new position (coordinates are page-based)
         */
        ElementPrototype.setX = function(node, x) {
            return this.setXY(x);
        };

        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param element The target element
         * @param {Number} y The Y values for new position (coordinates are page-based)
         */
        ElementPrototype.setY = function(node, y) {
            return this.setXY(null, y);
        };

       /**
        * Tests if the HtmlElement would be selected by the specified cssSelector.
        * Alias for `matchesSelector()`
        *
        * @method test
        * @param cssSelector {String} the css-selector to test against
        * @return {Boolean} whether or not the node matches the selector
        * @since 0.0.1
        */
        ElementPrototype.test = function(cssSelector) {
            return window.document.test.apply(this, arguments);
        };

       /**
        * Toggles the className of the Element.
        *
        * @method toggleClass
        * @param className {String} the className that should be toggled
        * @chainable
        * @since 0.0.1
        */
        ElementPrototype.toggleClass = function(className) {
            var instance = this;
            instance.hasClass(className) ? instance.removeClass(className) : instance.addClass(className);
            return instance;
        };

    }(window.Element.prototype));
};