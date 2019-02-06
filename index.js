// TODO
// - navigate tree from array of indices -> test some more
// - delete child with subtree
// - remove node -> decide how to manage children
class Dendro {
	constructor(data = null) {
		this.root = new TreeNode(data);
	}
	createNode(data = null) {
		return new TreeNode(data)
	}

	static createFromJSON(json, childrenAttrName) {
		// json = { nodes: [], question:"a", label:"b"}
		// childrenAttrName = "nodes"
		// with this row I get:
		// children = json.nodes
		// clearedJSON = { question:"a", label:"b" } nodes is removed.
		let { [childrenAttrName]: children, ...clearedJSON } = json;
		var tmpNode = new TreeNode(clearedJSON);
		for (var j in children) {
			if (children[j]) {
				tmpNode.appendChild(Dendro.createFromJSON(children[j], childrenAttrName))
			}
		}
		return tmpNode;
	}

}

class TreeNode {
	constructor(data = null) {
		this.data = data;
		this.parent = null;
		this.left_child = null;
		this.right_sibling = null;
	}

	appendChild(child) {
		if ((typeof child === 'undefined') || (child === null)) {
			throw "Cannot add undefined child to tree node";
		}

		if (this.left_child === null) {
			this.left_child = child;
			child.parent = this;
		} else {
			try {
				this.left_child.findLastSibling().right_sibling = child;
				child.parent = this;
			} catch (e) {
				console.error(e);
				return false;
			}
		}
	}

	appendSibling(sibling) {
		if ((typeof sibling === 'undefined') || (sibling === null)) {
			throw "Cannot add undefined sibling to tree node";
		}

		try {
			let i = this.findLastSibling();
			i.right_sibling = sibling;
			sibling.parent = i.parent;
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	// 0 is the node itself, 1 is the first sibling etc
	findNthSibling(n) {
		if (n < 0) {
			throw "Can't have negative index in findNthSibling()";
		}

		let i = this;
		let idx = 0;

		while (idx < n) {
			if ((i.right_sibling === null) || (typeof i.right_sibling === 'undefined')) {
				throw "Node has less than " + (n - 1) + " siblings";
			}

			i = i.right_sibling;
			idx++;
		}

		return i;
	}

	// 0 is the first child
	findNthChild(n) {
		if (n < 0) {
			throw "Can't have negative index in findNthChild()";
		}

		if (this.isLeaf()) {
			throw "Can't find children of a leaf";
		}

		try {
			return this.left_child.findNthSibling(n);
		} catch (e) {
			console.error(e);
		}
	}

	findLastSibling() {
		let i = this;

		while (i.right_sibling !== null) {
			i = i.right_sibling;
		}

		if ((i === null) || (typeof i === 'undefined')) {
			throw "Cannot find siblings of tree node";
		}

		return i;
	}

	// test function
	// could be made more efficient with iteration, too complex for a simple prototype at the moment
	// should always be called with true or no args from outside
	// could be rewritten for breadth first traversal
	printTree(root = true) {
		console.log(this.data);

		if (this.right_sibling !== null && !root) {
			this.right_sibling.printTree(false);
		}

		if (this.left_child !== null) {
			this.left_child.printTree(false);
		}
	}

	// could be made more efficient with iteration, too complex for a simple prototype at the moment
	// finds the first node with data, first as in upper levels
	findNode(data) {
		if (this.data === data) {
			return this;
		}

		if ((this.right_sibling !== null) && (typeof this.right_sibling !== 'undefined')) {
			return this.right_sibling.findNode(data);
		}

		if ((this.left_child !== null) && (typeof this.left_child !== 'undefined')) {
			return this.left_child.findNode(data);
		}

		return null;
	}

	// could be made more efficient with iteration, too complex for a simple prototype at the moment
	// arr should be array of indices, each one indicates nth child of node
	// ex: [0,1,1] root->0th child->1st child->1st child
    /**
     * 
     * @param {*} arr 
     * @returns TreeNode
     */
	findNodeFromIndices(arr) {
		if (arr.length === 0) {
			return this;
		}

		if (this.isLeaf()) {
			throw "Can't find children of leaf in findNodeFromIndices()";
		}

		try {
			let tmp = this.findNthChild(arr[0]);
			return tmp.findNodeFromIndices(arr.splice(1));
		} catch (e) {
			console.error(e);
		}
	}

	// helper functions
	isLeaf() {
		if ((this.left_child === null) || (typeof this.left_child === 'undefined')) {
			return true;
		}
		return false;
	}

	hasSiblings() {
		if ((this.right_sibling === null) || (typeof this.right_sibling === 'undefined')) {
			return false;
		}
		return true;
	}

	isRoot() {
		if ((this.parent === null) || (typeof this.parent === 'undefined')) {
			return true;
		}

		return false;
	}

	// could be made more efficient with iteration, too complex for a simple prototype at the moment
	getRoot() {
		if (this.isRoot()) {
			return this;
		}

		return this.parent.getRoot();
	}
}

// let test = new TreeNode(0);
// test.appendChild(new TreeNode(1));
// test.appendChild(new TreeNode(2));
// test.appendChild(new TreeNode(10));
// test.left_child.appendChild(new TreeNode(4));
// test.left_child.appendChild(new TreeNode(3));
// test = test.findNode(2);

// test.appendChild(new TreeNode(11));
// test.appendChild(new TreeNode(12));
// test.appendChild(new TreeNode(13));
// test = test.getRoot();
// // test.printTree();

// test = test.findNodeFromIndices([0, 1]);
// test.printTree();


// first simple tests
/*
let p = test.findNode(3)
if (p !== null) {
	p.printTree();
}

console.log("subtree:");
test.findNode(1).printTree();
console.log("full:");
test.printTree();
console.log("last child:");
test.findNthChild(0).printTree();
*/

module.exports = Dendro;