
/* inspired from http://www.quirksmode.org/js/dragdrop.html */

function addEventSimple(obj,evt,fn, capture) {
    capture = (capture) ? capture : false;
	if (obj.addEventListener)
		obj.addEventListener(evt,fn,capture);
	else if (obj.attachEvent)
		obj.attachEvent('on'+evt,fn);
}

function removeEventSimple(obj,evt,fn) {
	if (obj.removeEventListener)
		obj.removeEventListener(evt,fn,false);
	else if (obj.detachEvent)
		obj.detachEvent('on'+evt,fn);
}

function getStyle(el,styleProp)
{
    if (typeof el == 'string')
        el = document.getElementById(el);
	if (el.currentStyle)
		var y = el.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
	return y;
}

dragDrop = {
    id_drag_drop: 0,
    handlerHTML: ['<div class="handler" id="', '" onmousedown="dragDrop.startDragMouse(event,',')"></div>'],
    closeHTML: ['<a href="#" class="closeLink" id="','" onclick="dragDrop.closeElement(',')"><img class="icon-small" src="iconmonstr-x-mark-4-icon.svg"></a>'],
    allowed_position: ['absolute', 'fixed'],
    drag_drop_list: [],
    default_title: 'Window ',
    // static method that registers draggable windows
    drag_drop_init: function(element) {
        if (element)
            dragDrop.drag_drop_list.push(new dragDrop.constr(element, dragDrop.drag_drop_list.length))
        else {
            var elems = document.getElementsByClassName('draggable');
            for (var el=0; el<elems.length; el++) {
                dragDrop.drag_drop_list.push(new dragDrop.constr(elems[el], el));
            }
        }
    },
    // constructor. creates a manager instance for each window
    constr: function(elem, index) {
        if (typeof elem == 'string')
            elem = document.getElementById(elem);
        if (dragDrop.allowed_position.indexOf(getStyle(elem, 'position')) == -1) {
            elem.style['position'] = dragDrop.allowed_position[0];
        }
        this.elem = elem;
        this.index = index;
        this.elem.js_object = this;
        // add close icon and handler if relevant
        if (elem.className.indexOf('closable') > -1) {
            var id_close = 'id_close_' + dragDrop.id_drag_drop;
            elem.innerHTML += dragDrop.closeHTML[0]+id_close+dragDrop.closeHTML[1]+index+dragDrop.closeHTML[2];
            this.close_elem = document.getElementById(id_close);
            this.close_elem.js_object = this;
        }
        // add handler with title
        var id_handler = 'id_handler_' + dragDrop.id_drag_drop;
        elem.innerHTML += dragDrop.handlerHTML[0]+id_handler+dragDrop.handlerHTML[1]+index+dragDrop.handlerHTML[2];
        this.handler_elem = document.getElementById(id_handler);
        this.handler_elem.innerHTML = '<p class="handler_title">'+(elem.getAttribute('windowTitle') || dragDrop.default_title+dragDrop.id_drag_drop)+'</p>';
        this.handler_elem.js_object = this;
        this.draggedObject = undefined;
        this.startDrag = dragDrop.startDrag;
        this.setPosition = dragDrop.setPosition;
        dragDrop.id_drag_drop++;
    },
    // applies on close_elem
    closeElement: function(index) {
        var obj = dragDrop.drag_drop_list[index];
        obj.elem.style['display'] = 'none';
        dragDrop.drag_drop_list[obj.index] = undefined;
    },
    // applies on handler_elem
    startDragMouse: function (e, index) {
        var evt = e || window.event;
        var obj = dragDrop.drag_drop_list[index];
        obj.startDrag();
        obj.initialMouseX = evt.clientX;
        obj.initialMouseY = evt.clientY;
        addEventSimple(obj.elem, 'mousemove', dragDrop.dragMouse);
        addEventSimple(obj.elem, 'mouseup', dragDrop.releaseElement);
        return false;
    },
    // applies on js_object
    startDrag: function () {
        obj = this.elem;
        if (this.draggedObject && obj.releaseElement)
            obj.releaseElement();
        this.startX = obj.offsetLeft;
        this.startY = obj.offsetTop;
        this.draggedObject = obj;
        obj.className += ' dragged';
    },
    // applies on elem
    dragMouse: function (e) {
        var evt = e || window.event;
        that = this.js_object;
        var dX = evt.clientX - that.initialMouseX;
        var dY = evt.clientY - that.initialMouseY;
        that.setPosition(dX, dY);
        return false;
    },
    // applies on js_object
    setPosition: function (dx,dy) {
        this.draggedObject.style.left = this.startX + dx + 'px';
        this.draggedObject.style.top = this.startY + dy + 'px';
    },
    // applies on elem
    releaseElement: function() {
        removeEventSimple(this, 'mousemove', dragDrop.dragMouse);
        removeEventSimple(this, 'mouseup', dragDrop.releaseElement);
        this.className = this.className.replace(/ dragged/g, '');
        this.js_object.draggedObject = null;
    }
};
