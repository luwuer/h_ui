import {findInx} from '../../util/tools';
export default {
    methods: {
        alignCls (column, row = {}) {
            let cellClassName = '';
            if (row.cellClassName && column.key && row.cellClassName[column.key]) {
                cellClassName = row.cellClassName[column.key];
            }
            return [
                // `${column.key}`,
                {
                    [`${cellClassName}`]: cellClassName,    // cell className
                    [`${column.className}`]: column.className,    // column className
                    [`${this.prefixCls}-column-${column.align}`]: column.align,
                    [`${this.prefixCls}-hidden`]: (this.fixed === 'left' && column.fixed !== 'left') || (this.fixed === 'right' && column.fixed !== 'right') || (!this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'))
                }
            ];
        },
        isPopperShow (column) {
            return column.filters && ((!this.fixed && !column.fixed) || (this.fixed === 'left' && column.fixed === 'left') || (this.fixed === 'right' && column.fixed === 'right'));
        },
        setCellWidth (column, index, top) {
            let width = '';
            if (column.width) {
                width = column.width;
            } else if (this.columnsWidth[column._index]) {
                width = this.columnsWidth[column._index].width;
            }
            // when browser has scrollBar,set a width to resolve scroll position bug
            if (this.columns.length === index + 1 && top && this.$parent.bodyHeight !== 0&&this.$parent.data.length>0) {
                width += this.$parent.scrollBarWidth;
            }
            // when fixed type,reset first right fixed column's width
            if (this.fixed === 'right') {
                // const firstFixedIndex = this.columns.findIndex((col) => col.fixed === 'right');
                const firstFixedIndex = findInx(this.columns,(col) => col.fixed === 'right');
                if (firstFixedIndex === index) width += this.$parent.scrollBarWidth;
            }
            if (width === '0') width = '';
            return width;
        },
        convertTreeData(rows, attributes) {
            var keyNodes = {}, parentKeyNodes = {};
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    row.id = row[attributes.keyField];
                    row.parentId = row[attributes.parentKeyField];
                    // row.text = row[attributes.textField];
                    row.expanded = row[attributes.expanded]?true:false
                    row.checked = row[attributes.checked]?true:false
                    row.indeterminate = row[attributes.indeterminate]?true:false
                    row.children = [];

                    keyNodes[row.id] = row;

                    if (parentKeyNodes[row.parentId]) { parentKeyNodes[row.parentId].push(row); }
                    else { parentKeyNodes[row.parentId] = [row]; }

                    var children = parentKeyNodes[row.id];
                    if (children) { row.children = children; }

                    var pNode = keyNodes[row.parentId];
                    if (pNode) { pNode.children.push(row); }
                }
            return parentKeyNodes[attributes.rootParentId];
        }
    }
};
