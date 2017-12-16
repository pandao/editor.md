function parseList(text) {
    var items = { 'label': 'ROOT', 'children': [], 'depth': -1 };
    var lines = text.split("\n");
    lines = lines.filter(c => !c.match(/^\s*$/)); // Remove blank lines

    var currentParent = items;
    var currentParentDepth = -1;

    var currentItemLabel = "";
    var currentItemDepth;

    for (var line of lines) {
        var itemMatch = line.match(/^( *)-\s*(.*)$/);

        // New item
        if (itemMatch) {
            // Store previous item (if any)
            if (currentItemLabel != "") {

                // Build the node for the previously read node
                var node = {
                    'label': currentItemLabel,
                    'children': [],
                    'parent': currentParent,
                    'depth': currentItemDepth
                };

                // Store the node within its parent
                currentParent['children'].push(node);

                // Set the new "parent" to the previous item
                currentParent = node;
                currentParentDepth = node.depth;
            }

            // Fetch the data from the newly-read item
            currentItemDepth = itemMatch[1].length;
            currentItemLabel = itemMatch[2];

            // If the parent is deeper than the new item, switch the parent
            // to one with lower depth than current item
            while (currentItemDepth <= currentParentDepth) {
                currentParent = currentParent['parent'];
                currentParentDepth = currentParent['depth'];
            }

        }
        // Continued string from previous item
        else {
            currentItemLabel += "\n" + line;
        }
    }

    // Force insert last item
    if (currentItemLabel) {
        var node = {
            'label': currentItemLabel,
            'children': [],
            'parent': currentParent,
            'depth': currentParentDepth + 1
        };
        currentParent['children'].push(node);
    }

    return items;
}
