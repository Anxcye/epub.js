[marks-pane](./node_modules/marks-pane/src/marks.js)
```js
export class Underline extends Highlight {
    constructor(range, className, data, attributes) {
        super(range, className, data,  attributes);
    }

    render() {
        // Empty element
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        var docFrag = this.element.ownerDocument.createDocumentFragment();
        var filtered = this.filteredRanges();
        var offset = this.element.getBoundingClientRect();
        var container = this.container.getBoundingClientRect();

        for (var i = 0, len = filtered.length; i < len; i++) {
            var r = filtered[i];

            var rect = svg.createElement('rect');
            rect.setAttribute('x', r.left - offset.left + container.left);
            rect.setAttribute('y', r.top - offset.top + container.top);
            rect.setAttribute('height', r.height);
            rect.setAttribute('width', r.width);
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', 'transparent');

            var line = svg.createElement('line');
            line.setAttribute('x1', r.left - offset.left + container.left);
            line.setAttribute('x2', r.left - offset.left + container.left + r.width);
            line.setAttribute('y1', r.top - offset.top + container.top + r.height - 1);
            line.setAttribute('y2', r.top - offset.top + container.top + r.height - 1);

            // line.setAttribute('stroke-width', 1);
            // line.setAttribute('stroke', 'black'); //TODO: match text color?
            line.setAttribute('stroke-linecap', 'square');

            docFrag.appendChild(rect);

            docFrag.appendChild(line);
        }

        this.element.appendChild(docFrag);

    }
}
```