html5_helpers
=============

This is a set of html, css3 and javascript utilities


drag_and_drop
-------------

This is a drag and drop window manager, written in pure JS (no dependency).

An element with class="draggable" will become a draggable window with a top handler.
The top handler shows a 'move' cursor when hovered and the window can be moved around
when the handler is clicked down. The handler holds a title copied from the 'windowTitle'
attribute of the draggable element if given.
If the element also has class="closable", a close x-mark will show on top right of the window,
allowing to close the window.
If element has position="fixed", the window will not scroll with the whole body (stay at fixed
position on screen).
