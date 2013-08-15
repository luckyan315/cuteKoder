/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */
// #ifdef __AMLITEM || __INC_ALL

/**
 * Item of a menu displaying a clickable area.
 * Example:
 *  <a:iconmap 
 *    id     = "tbicons" 
 *    src    = "toolbar.icons.gif"
 *    type   = "horizontal" 
 *    size   = "20" 
 *    offset = "2,2" />
 *  <a:menu id="menu1">
 *      <a:item icon="tbicons:1">Tutorials</a:item>
 *      <a:item icon="tbicons:5">Contact</a:item>
 *  </a:menu>
 *  <a:toolbar>
 *      <a:menubar>
 *          <a:button submenu="menu1">File</a:button>
 *      </a:menubar>
 *  </a:toolbar>
 * </code>
 * @define item, check, radio
 * @constructor
 *
 * @event click Fires when a user presses the mouse button while over this element.
 *   object:
 *   {XMLElement} xmlContext the xml data node that was selected in the opener at the time of showing the context menu.
 *   {AMLElement} opener the element that was clicked upon when showing the context menu.
 */
apf.radio = function(struct, tagName){
    this.$init(tagName || "radio", apf.NODE_HIDDEN, struct);
};

apf.check = function(struct, tagName){
    this.$init(tagName || "check", apf.NODE_HIDDEN, struct);
};

apf.item  = function(struct, tagName){
    this.$init(tagName || "item", apf.NODE_HIDDEN, struct);
};

(function(){
    this.$focussable    = false;
    this.$childProperty = "caption";
    this.$canLeechSkin  = "item";

    this.implement(apf.ChildValue);

    /**** Properties and Attributes ****/
    
    //1 = force no bind rule, 2 = force bind rule
    this.$attrExcludePropBind = apf.extend({
        "match" : 1
    }, this.$attrExcludePropBind);

    this.$supportedProperties.push("submenu", "value", "match", "group", "icon",
                                   "checked", "selected", "disabled", "caption");

    /**
     * @attribute {String} [submenu] the id of the menu that is shown
     * when the user hovers over this menu item.
     * Example:
     * <code>
     *  <a:menu id="msub">
     *      <a:item icon="tbicons:12">test</a:item>
     *      <a:item icon="tbicons:14">test2</a:item>
     *  </a:menu>
     *
     *  <a:menu id="mmain">
     *      <a:item submenu="msub">Sub menu</a:item>
     *  </a:menu>
     * </code>
     */
    this.$propHandlers["submenu"] = function(value){
        apf.setStyleClass(this.$ext, "submenu");
    }
    
    /**
     * @attribute {String} value the value of this element.
     */

    /**
     * @attribute {String} [select] the xpath statement which works on the
     * xml context of the parent menu element to determine whether this
     * item is shown.
     * Example:
     * This example shows a list
     * <code>
     *  <a:list>
     *     [...]
     *
     *     <a:contextmenu menu="mnuXY" select="computer" />
     *     <a:contextmenu menu="mnuTest" />
     *  </a:list>
     *
     *  <a:menu id="mnuTest">
     *     <a:item select="person">Send an E-mail</a:Item>
     *     <a:item select="phone">Call Number</a:Item>
     *     <a:divider />
     *     <a:item select="phone">Remove</a:Item>
     *     <a:divider />
     *     <a:item select="person|phone">View Pictures</a:Item>
     *  </a:menu>
     *
     *  <a:menu id="mnuXY">
     *     <a:item>Reboot</a:Item>
     *  </a:menu>
     * </code>
     */
    this.$propHandlers["select"] = function(value){
        this.select = value
            ? "self::" + value.split("|").join("|self::")
            : value;
    }
    
    /**
     * @attribute {String} [group] the name of the group this item belongs
     * to.
     * Example:
     * <code>
     *  <a:menu>
     *      <a:radio group="example">item 1</a:radio>
     *      <a:radio group="example">item 2</a:radio>
     *      <a:radio group="example">item 3</a:radio>
     *      <a:radio group="example">item 4</a:radio>
     *  </a:menu>
     * </code>
     */

    //#ifdef __WITH_HOTKEY
    /**
     * @attribute {String} hotkey the key combination a user can press
     * to active the function of this element. Use any combination of
     * Ctrl, Shift, Alt, F1-F12 and alphanumerical characters. Use a
     * space, a minus or plus sign as a seperator.
     * Example:
     * <code>
     *  <a:item hotkey="Ctrl+Q">Quit</a:item>
     * </code>
     */
    this.$propHandlers["hotkey"] = function(value){
        if (this.$hotkey)
            apf.setNodeValue(this.$hotkey, value);

        if (this.$lastHotkey)
            apf.removeHotkey(this.$lastHotkey);

        if (value) {
            this.$lastHotkey = value;
            var _self = this;
            apf.registerHotkey(value, function(){
                //hmm not very scalable...
                var buttons = apf.document.getElementsByTagNameNS(apf.ns.aml, "button");
                for (var i = 0; i < buttons.length; i++) {
                    if (buttons[i].submenu == _self.parentNode.name) {
                        var btn = buttons[i];
                        btn.$setState("Over", {});

                        $setTimeout(function(){
                            btn.$setState("Out", {});
                        }, 200);

                        break;
                    }
                }

                _self.$down();
                _self.$up();
                _self.$click();
            });
        }
    }
    //#endif
    /**
     * @attribute {String} icon the url of the image used as an icon or
     * a reference to an iconmap.
     */
    this.$propHandlers["icon"] = function(value){
        if (this.$icon)
            apf.skins.setIcon(this.$icon, value, this.parentNode.iconPath);
    }
    
    /**
     * @attribute {String} caption the text displayed on the item.
     */
    this.$propHandlers["caption"] = function(value){
        if (this.$caption)
            apf.setNodeValue(this.$caption, value);
    }
    
    /**
     * @attribute {Boolean} checked whether the item is checked.
     */
    this.$propHandlers["checked"] = function(value){
        if (this.localName != "check")
            return;

        if (apf.isTrue(value))
            apf.setStyleClass(this.$ext, "checked");
        else
            apf.setStyleClass(this.$ext, "", ["checked"]);
    }

    /**
     * @attribute {Boolean} checked whether the item is selected.
     */
    this.$propHandlers["selected"] = function(value){
        if (this.localName != "radio")
            return;

        if (apf.isTrue(value))
            apf.setStyleClass(this.$ext, "selected");
        else
            apf.setStyleClass(this.$ext, "", ["selected"]);
    }
    
    /**
     * @attribute {Boolean} disabled whether the item is active.
     */
    this.$propHandlers["disabled"] = function(value){
        if (apf.isTrue(value))
            apf.setStyleClass(this.$ext, "disabled");
        else
            apf.setStyleClass(this.$ext, "", ["disabled"]);
    }

    /**** Public Methods ****/

    /**
     * @private
     */
    this.enable = function(list){
        apf.setStyleClass(this.$ext,
            this.parentNode.$baseCSSname + "Disabled");
    };

    /**
     * @private
     */
    this.disable = function(list){
        apf.setStyleClass(this.$ext, null,
            [this.parentNode.$baseCSSname + "Disabled"]);
    };

    /**
     * @private
     */
    this.show = function(){
        this.$ext.style.display = "block";
    };

    /**
     * @private
     */
    this.hide = function(){
        this.$ext.style.display = "none";
    };

    /**** Dom Hooks ****/

    this.addEventListener("AMLReparent", function(beforeNode, pNode, withinParent){
        if (!this.$amlLoaded)
            return;

        if (!withinParent && this.skinName != pNode.skinName) {
            //@todo for now, assuming dom garbage collection doesn't leak
            this.loadAml();
        }
    });

    /**** Events ****/

    this.$down = function(){

    };

    this.$up = function(){
        if (this.localName == "radio")
            this.parentNode.select(this.group, this.value || this.caption);

        else if (this.localName == "check")
            this.$handlePropSet("checked", !this.checked);

        if (this.submenu) {
            this.$over(null, true);
            return;
        }

        this.parentNode.$hideTree = true;
        this.parentNode.hide();//true not focus?/

        this.parentNode.dispatchEvent("itemclick", {
            value : this.value || this.caption
        });

        //@todo Anim effect here?
    };

    this.$click = function(){
        this.dispatchEvent("click", {
            xmlContext : this.parentNode.xmlReference,
            opener     : this.parentNode.opener
        });
    };

    var timer;
    this.$out = function(e){
        if (apf.isChildOf(this.$ext, e.toElement || e.explicitOriginalTarget)
          || apf.isChildOf(this.$ext, e.srcElement || e.target))  //@todo test FF
            return;

        clearTimeout(timer);
        if (!this.submenu || this.$submenu(true)) {
            apf.setStyleClass(this.$ext, '', ['hover']);

            var sel = this.parentNode.$selected;
            if (sel && sel != this)
                apf.setStyleClass(sel.$ext, "", ["hover"]);

            this.parentNode.$selected = null;
        }
    };

    this.$over = function(e, force){
        if (this.parentNode.$selected == this)
            return;

        if (this.parentNode.$selected)
            apf.setStyleClass(this.parentNode.$selected.$ext, "", ["hover"]);

        apf.setStyleClass(this.$ext, "hover");
        this.parentNode.$selected = this;

        if (!force && (apf.isChildOf(this.$ext, e.toElement || e.explicitOriginalTarget)
          || apf.isChildOf(this.$ext, e.fromElement || e.target)))  //@todo test FF
            return;

        var ps = this.parentNode.$showingSubMenu;
        if (ps) {
            if (ps.name == this.submenu)
                return;

            ps.hide();
            this.parentNode.$showingSubMenu = null;
        }

        if (this.submenu) {
            if (force) {
                this.$submenu();
            }
            else {
                var _self = this;
                clearTimeout(timer);
                timer = $setTimeout(function(){
                    _self.$submenu();
                    timer = null;
                }, 200);
            }
        }
    };

    this.$submenu = function(hide, force){
        if (!this.submenu)
            return true;

        var menu = self[this.submenu];
        if (!menu) {
            //#ifdef __DEBUG
            throw new Error(apf.formatErrorString(0, this,
                "Displaying submenu",
                "Could not find submenu '" + this.submenu + "'", this.$aml));
            //#endif

            return;
        }

        if (!hide) {
            //if (this.parentNode.showingSubMenu == this.submenu)
                //return;

            this.parentNode.$showingSubMenu = menu;

            var pos = apf.getAbsolutePosition(this.$ext, this.parentNode.$ext.offsetParent);
            menu.display(pos[0] + this.$ext.offsetWidth - 3,
                pos[1] + 3, false, this,
                this.parentNode.xmlReference, this.parentNode.$uniqueId);
            menu.setAttribute("zindex", (this.parentNode.zindex || 1) + 1);
        }
        else {
            if (menu.visible && !force) {
                return false;
            }
            
            if(this.parentNode.$showingSubMenu) {
                this.parentNode.$showingSubMenu = null;
            }
            
            apf.setStyleClass(this.$ext, '', ['hover']);
            menu.hide();
            return true;
        }
    };

    /**** Init ****/
    
    this.$draw = function(isSkinSwitch){
        var p = this.parentNode;
        while (p.$canLeechSkin == "item")
            p = p.parentNode;

        //@todo apf3.0 rename doesnt work yet.
        //@todo apf3.0 implement DOM Mutation events for multiselect widgets
        //@todo apf3.0 implement attribute change triggers for icon, image, value, caption to updateNode this.$int
        //@todo apf3.x this should be rearchitected
        //@todo apf3.x the functions dont need to be overloaded if selectNodes would work properly
        if (p.hasFeature(apf.__MULTISELECT__)) {
            var _self = this;
            
            //@todo DOMNodeInserted should reset this
            //@todo DOMNodeRemoved should reset this
            if (!this.$hasSetSkinListener) {
                var f;
                this.parentNode.addEventListener("$skinchange", f = function(){
                    if (_self.$amlDestroyed) //@todo apf3.x
                        return;
                    
                    if (_self.$ext.parentNode)
                        this.$deInitNode(_self, _self.$ext);
    
                    var oInt = p == _self.parentNode ? p.$int : _self.parentNode.$int;
                    var node = oInt.lastChild;//@todo this should be more generic
                    p.$add(_self, _self.getAttribute(apf.xmldb.xmlIdTag) + "|" + this.$uniqueId, 
                        _self.parentNode, oInt != p.$int && oInt, null);
                    p.$fill();
                    
                    if (p.$isTreeArch) {
                        _self.$int = p.$getLayoutNode("item", "container", 
                           _self.$ext = node && node.nextSibling || oInt.firstChild);//@todo this should be more generic
                    }
                    else _self.$ext = node && node.nextSibling || oInt.firstChild;
                    
                    var ns = _self;
                    while((ns = ns.nextSibling) && ns.nodeType != 1);
        
                    if (!ns || ns.$canLeechSkin != "item")
                        p.dispatchEvent("afterload");
                });
                this.addEventListener("DOMNodeRemoved", function(e){
                    this.parentNode.removeEventListener("$skinchange", f);
                });
                
                this.$hasSetSkinListener = true;
            }
            
            if (!p.$itemInited) {
                p.canrename = false; //@todo fix rename
                p.$removeClearMessage(); //@todo this should be more generic
                p.$itemInited = [p.getTraverseNodes, p.getFirstTraverseNode, p.getTraverseParent];
                
                p.getTraverseNodes = function(xmlNode){
                    return (xmlNode || p).getElementsByTagNameNS(apf.ns.apf, "item");
                }
                p.getFirstTraverseNode = function(xmlNode){
                    return (xmlNode || p).getElementsByTagNameNS(apf.ns.apf, "item")[0];
                }
                p.getTraverseParent = function(xmlNode){
                    return xmlNode && xmlNode.parentNode;
                }
                p.each = (this.prefix ? this.prefix + ":" : "") + "item";

                //@todo this is all an ugly hack (copied to baselist.js line 868)
                p.$preventDataLoad = true;//@todo apf3.0 add remove for this

                p.$initingModel = true;
                p.$setDynamicProperty("icon", "[@icon]");
                p.$setDynamicProperty("image", "[@image]");
                p.$setDynamicProperty("caption", "[label/text()|@caption|text()]");
                p.$setDynamicProperty("eachvalue", "[value/text()|@value|text()]");
                p.$canLoadDataAttr = false;
                
                if (!p.xmlRoot)
                    p.xmlRoot = p;
            }
            
            this.$loadAml = function(){
                //hack
                if (!this.getAttribute("caption"))
                    this.setAttribute("caption", this.caption);
                
                var oInt = p == this.parentNode ? p.$int : this.parentNode.$int;
                var node = oInt.lastChild;//@todo this should be more generic
                if (!p.documentId)
                    p.documentId = apf.xmldb.getXmlDocId(this);
                p.$add(this, apf.xmldb.nodeConnect(p.documentId, this, null, p), 
                    this.parentNode, oInt != p.$int && oInt, null);
                p.$fill();
    
                if (p.$isTreeArch) {
                    this.$int = p.$getLayoutNode("item", "container", 
                       this.$ext = node && node.nextSibling || oInt.firstChild);//@todo this should be more generic
                }
                else this.$ext = node && node.nextSibling || oInt.firstChild;
                
                var ns = this;
                while((ns = ns.nextSibling) && ns.nodeType != 1);
    
                if (!ns || ns.$canLeechSkin != "item") {
                    p.dispatchEvent("afterload");
                    if (p.autoselect)
                        p.$selectDefault(this.parentNode);
                }
            }
            
            return;
        }
        
        this.$ext = this.$getExternal(this.$isLeechingSkin
          ? "item" //this.localName 
          : "main", null, function($ext){
            var o = 'apf.lookup(' + this.$uniqueId + ')';
            $ext.setAttribute("onmouseup",   o + '.$up(event)');
            $ext.setAttribute("onmousemove", o + '.$over(event)');
            $ext.setAttribute("onmouseout",  o + '.$out(event)');
            $ext.setAttribute("onmousedown", o + '.$down()');
            $ext.setAttribute("onclick",     o + '.$click()');
        });

        /*p.$getNewContext("item");
        var elItem = p.$getLayoutNode("item");*/
        
        //@todo if not elItem try using own skin

        apf.setStyleClass(this.$ext, this.localName);

        //this.$ext   = apf.insertHtmlNode(elItem, this.parentNode.$int);
        this.$caption = this.$getLayoutNode("item", "caption", this.$ext)
        this.$icon    = this.$getLayoutNode("item", "icon", this.$ext);
        this.$hotkey  = this.$getLayoutNode("item", "hotkey", this.$ext);

        if (!isSkinSwitch && this.nextSibling && this.nextSibling.$ext)
            this.$ext.parentNode.insertBefore(this.$ext, this.nextSibling.$ext);
    };

    /**
     * @private
     */
    this.addEventListener("DOMNodeInsertedIntoDocument", function(e){
        //var x = this.$aml;

        //this.skinName    = this.parentNode.skinName;
        var isSkinSwitch = this.$ext ? true : false;
        if (isSkinSwitch) {
            if (typeof this.checked !== "undefined")
                this.$handlePropSet("checked", this.checked);
            else if (typeof this.selected !== "undefined")
                this.$handlePropSet("selected", this.selected);

            if (this.disabled)
                this.$handlePropSet("disabled", this.disabled);

            if (this.caption)
                this.$handlePropSet("caption", this.caption);
        }
    });
}).call(apf.item.prototype = new apf.Presentation());

apf.radio.prototype =
apf.check.prototype = apf.item.prototype;

apf.aml.setElement("radio", apf.radio);
apf.aml.setElement("check", apf.check);
apf.aml.setElement("item",  apf.item);
// #endif