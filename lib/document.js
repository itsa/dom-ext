"use strict";

module.exports = function (window) {
    require('polyfill/lib/array.some.js');
    require('polyfill/lib/array.isarray.js');
    require('./nodelist.js')(window);
    require('polyfill/lib/element.matchesselector.js')(window);

    var HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    },
    DOCUMENT = window.document,
    SINGLE_NODE_ID_REGEXP = /^#\S+$/,

    /**
    @method html
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    escapeHTML = function (content) {
        (content.serialize) && (content=content.serialize());
        return content.replace(/[&<>"'\/`]/g, function (match) {return HTML_CHARS[match];});
    },

    toCamelCase = function(input) {
        return input.toLowerCase().replace(/-(.)/g, function(match, group) {
            return group.toUpperCase();
        });
    },

   /*
    * Creates a fragment out of a String, so that it can be inserted as a NodeList.
    *
    * @method _createFragment
    * @param content {String} content to be fragmented
    * @return {DocumentFragment}
    * @since 0.0.1
    */
    _createFragment = function(content) {
        var fragment = DOCUMENT.createDocumentFragment(),
            cont = DOCUMENT.createElement('div'),
            first;
        cont.innerHTML = content;
/*jshint boss:true */
        while (first=cont.firstChild) {
            fragment.appendChild(first);
        }
/*jshint boss:false */
        return fragment;
    };

   /**
    * Inserts a HtmlElement or text at the specified position.
    *
    * @method _insert
    * @param htmlElement {HtmlElement} the HtmlElement where the action should be applied to
    * @param method {String} method to be used (either `insertBefore` or `appendChild`)
    * @param content {HtmlElement|HtmlElementList|String} content to append
    * @param refElement {HtmlElement} reference-element in case of `insertBefore`
    * @param escape {Boolean} whether to insert `escaped` content, leading it into only text inserted
    * @return {HtmlElement} the original HtmlElement so it can be chained
    * @since 0.0.1
    */
    DOCUMENT._insert = function(htmlElement, method, content, refElement, escape) {
        var first;
        // cannot check if isArray: NodeList and HTMLCollection are extended with `forEach()` but they are no arrays
        if (content.forEach) {
            // carefull: in case of NodeList or HTMLCollection we cannot use "forEach" because the Elements will be
            // removes from the previous hash, making `forEach` to creates gaps
            if (escape || Array.isArray(content)) {
                content.forEach(
                    function(element) {
                        escape && (element=escapeHTML(element));
                        (typeof element === 'string') && (element=_createFragment(element));
                        htmlElement[method](element, refElement);
                    }
                );
            }
            else {
/*jshint boss:true */
                while (first=content[0]) {
                    htmlElement[method](escape ? escapeHTML(first) : first, refElement);
                }
/*jshint boss:false */
            }
        }
        else {
            escape && (content=escapeHTML(content));
            (typeof content === 'string') && (content=_createFragment(content));
            htmlElement[method](content, refElement);

        }
        return htmlElement;
    };

   /**
    * Returns the first of the HtmlElement's siblings, or the first that matches `cssSelector`.
    *
    * @method first
    * @param [cssSelector] {String} css-selector to be used as a filter
    * @return {HtmlElement|null}
    * @since 0.0.1
    */
    DOCUMENT.first = function(cssSelector) {
        var parent = this.parentHtmlElement || window.document, // not `this` because the context might change
            found;
        if (!cssSelector) {
            return parent.firstElementChild;
        }
        Array.prototype.some.call(parent.children, function(element) {
            element.matchesSelector(cssSelector) && (found=element);
            return found;
        });
        return found;
    };

   /**
    * Gets a NodeList of HtmlElements, specified by the css-selector.
    *
    * @method getAll
    * @param cssSelector {String} css-selector to match
    * @return {NodeList} NodeList of HtmlElements that match the css-selector
    * @since 0.0.1
    */
    DOCUMENT.getAll = function(cssSelector) {
        try {
            return this.querySelectorAll(cssSelector); // throws an error or falsy selector
        }
        catch (err) {
            return [];
        }
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
    DOCUMENT.getElement = function(cssSelector) {
        return SINGLE_NODE_ID_REGEXP.test(cssSelector) ? this.getElementById(cssSelector.substr(1)) : this.getAll(cssSelector)[0];
    };

   /**
    * Gets the HtmlElement that currently has the focus.
    * alias for `activeElement`
    *
    * @method getFocussed
    * @return {HtmlElement|null} the HtmlElement that has focus
    * @since 0.0.1
    */
    DOCUMENT.getFocussed = function() {
        return this.activeElement;
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
    DOCUMENT.insertAfter = function(content, refElement, escape) {
        var instance = this,
            children = instance.children,
            index = children.indexOf(refElement);
        if ((index==-1) || (index===children.length-1)) {
            return instance.DOCUMENT._insert(instance, 'appendChild', content, null, escape);
        }
        return instance.DOCUMENT._insert(instance, 'insertBefore', content, children[index+1], escape);
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
    DOCUMENT.insertBefore = function(content, refElement, escape) {
        var instance = this,
            index = instance.children.indexOf(refElement);
        if (index==-1) {
            return instance.DOCUMENT._insert(instance, 'appendChild', content, null, escape);
        }
        return instance.DOCUMENT._insert(instance, 'insertBefore', content, refElement, escape);
    };

   /**
    * Returns the last of the HtmlElement's siblings, or the last that matches `cssSelector`.
    *
    * @method last
    * @param [cssSelector] {String} css-selector to be used as a filter
    * @return {HtmlElement|null}
    * @since 0.0.1
    */
    DOCUMENT.last = function(cssSelector) {
        var parent = this.parentHtmlElement || window.document, // not `this` because the context might change
            found, i;
        if (!cssSelector) {
            return parent.lastElementChild;
        }
        for (i=parent.children-1; !found && (i>0); i--) {
            parent.children[i].matchesSelector(cssSelector) && (found=parent.children[i]);
        }
        return found;
    };

   /**
    * Replaces the HtmlElement with a new HtmlElement.
    *
    * @method replace
    * @param newHtmlElement {HtmlElement|String} the new HtmlElement
    * @param [escape] {Boolean} whether to insert `escaped` content, leading it into only text inserted
    * @chainable
    * @since 0.0.1
    */
    DOCUMENT.replace = function(oldHtmlElement, newHtmlElement, escape) {
        var instance = this,
            parentNode = instance.parentNode;
        (typeof newHtmlElement === 'string') && (newHtmlElement=_createFragment(newHtmlElement));
        parentNode.replaceChild(escape ? escapeHTML(newHtmlElement) : newHtmlElement, instance);
        return escape ? parentNode : newHtmlElement;
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
    DOCUMENT.test = function(cssSelector) {
        return this.matchesSelector(cssSelector);
    };

};