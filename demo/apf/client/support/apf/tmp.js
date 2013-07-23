//gist 1
    apf.insertHtmlNode = function(xmlNode, htmlNode, beforeNode, s) {
        if (!s) {
            s = apf.html_entity_decode(xmlNode.serialize 
                ? xmlNode.serialize(true)
                : ((xmlNode.nodeType == 3 || xmlNode.nodeType == 4 || xmlNode.nodeType == 2)
                    ? xmlNode.nodeValue
                    : serializer.serializeToString(xmlNode)));
        }
        
 
        /*
         * Fix bug of no insertAdjacentHTML error
         * 
         * @author lijingsen
         * @data   17 July, 2013
         */
        var node = beforeNode || htmlNode;
        s = s.replace(/<([^>]+)\/>/g, "<$1></$1>");
 
        if (node.insertAdjacentHTML) {
            node.insertAdjacentHTML(beforeNode
                ? "beforebegin"
                : "beforeend", s);
        }
 
        return beforeNode ? beforeNode.previousSibling : htmlNode.lastChild;
    };
 
    if (apf.runNonIe)
        apf.runNonIe();

 
 
//gist 2
 
    /**
     * Add a new lock token/ object to the stack
     * 
     * @path {String} sPath Path pointing to the resource on the server
     * @type {Object}
     * @private
     */
    function newLock(sPath) {
        /*
         * Fix bug of undefined $this
         * 
         * @author lijingsen
         * @date   17 July, 2013
         */
        return this.$locks[sPath] = {
            path : sPath,
            id   : this.$lockId++,
            token: null
        };
    }
 
//gist 3
    function parseItem(oNode) {
        var NS      = apf.webdav.NS,
            sPath   = $xmlns(oNode, "href", NS.D)[0].firstChild.nodeValue.replace(/[\\\/]+$/, ""),
            sName   = decodeURIComponent(sPath.split("/").pop()),
            bHidden = (sName.charAt(0) == ".");
 
        if (!this.$showHidden && bHidden)
            return "";
        
        var iId, oItem = getItemByPath.call(this, sPath);
        if (oItem && typeof oItem.id == "number")
            iId = oItem.id;
        else
            iId = this.$fsCache.length;
 
        /*
         * Fix bug of no firstChild error
         * 
         * @author lijingsen
         * @date   17 July 2013
         */
        var sType  = $xmlns(oNode, "collection", NS.D).length > 0 ? "folder" : "file",
            aCLen  = $xmlns(oNode, "getcontentlength", NS.lp1)[0],
            aCType = $xmlns(oNode, "getcontenttype", NS.D)[0],
            aCDate = $xmlns(oNode, "creationdate", NS.lp1)[0],
            aLast  = $xmlns(oNode, "getlastmodified", NS.lp1)[0],
            aExec  = $xmlns(oNode, "executable", NS.lp2)[0],
            aETag  = $xmlns(oNode, "getetag", NS.lp1)[0];
        oItem = this.$fsCache[iId] = {
            id          : iId,
            path        : sPath,
            type        : sType,
            size        : parseInt(sType == "file" ? (aCLen ? aCLen.firstChild.nodeValue : "0") : 0),
            name        : sName,
            contentType : (sType == "file" && aCType ? aCType.firstChild.nodeValue : ""),
            creationDate: (aCDate ? aCDate.firstChild.nodeValue : null),
            lastModified: (aLast ? aLast.firstChild.nodeValue : null),
            etag        : (aETag ? aETag.firstChild.nodeValue : null),
            lockable    : ($xmlns(oNode, "locktype", NS.D).length > 0),
            executable  : (aExec && aExec.firstChild.nodeValue == "T" ? true : false)
        };
 
}
 
//gist 4

<?xml version="1.0"?>
<textarea type="text" class="ta" onmousedown="this.host.dispatchEvent('mousedown', {htmlEvent : event});" onmouseup="this.host.dispatchEvent('mouseup', {htmlEvent : event});" onclick="this.host.dispatchEvent('click', {htmlEvent : event});"/>

<textarea type="text" class="ta" onmousedown="this.host.dispatchEvent('mousedown', {htmlEvent : event});" onmouseup="this.host.dispatchEvent('mouseup', {htmlEvent : event});" onclick="this.host.dispatchEvent('click', {htmlEvent : event});"></textarea type="text" class="ta" onmousedown="this.host.dispatchEvent('mousedown', {htmlEvent : event});" onmouseup="this.host.dispatchEvent('mouseup', {htmlEvent : event});" onclick="this.host.dispatchEvent('click', {htmlEvent : event});">