class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
      this.val = (val===undefined ? 0 : val)
      this.left = (left===undefined ? null : left)
      this.right = (right===undefined ? null : right)
  }
}


function levelOrder(root: TreeNode | null): number[] {
  //如果不为null，将root加入到队列中
  if(!root) return []
  let queue: TreeNode[] = [root]
  let res: number[][] = []
  while(queue.length) {
      //记录队列的长度，记录当前层节点的个数
      let len: number = queue.length
      let level: number[] = []
      while(len--) {
          //先弹出队列里面的第一个元素
          let node = queue.shift()!
          //用数组将本层的结果记录，将每一层的节点放入到一维数组中，最后放入二维数组中
          level.push(node.val)
          //如果左右节点的孩子不为空，将节点的左右孩子加入到队列中
          if(node.left) {
              queue.push(node.left)
          }
          if(node.right) {
              queue.push(node.right)
          }
        }
        res.push(level)
    }
    return res.flat()
};

// class TreeNode<T> {
//   val: T;
//   left: TreeNode<T> | null;
//   right: TreeNode<T> | null;
//   constructor(val: T) {
//     this.val = val;
//     this.left = null;
//     this.right = null;
//   }
// }

// function levelOrderTraversal<T>(root: TreeNode<T> | null): T[][] {
//   const result: T[][] = [];
//   if (!root) {
//     return result;
//   }
//   const queue: TreeNode<T>[] = [root];
//   while (queue.length) {
//     const levelSize = queue.length;
//     const level: T[] = [];
//     for (let i = 0; i < levelSize; i++) {
//       const node = queue.shift()!;
//       level.push(node.val);
//       if (node.left) {
//         queue.push(node.left);
//       }
//       if (node.right) {
//         queue.push(node.right);
//       }
//     }
//     result.push(level);
//   }
//   return result;
// }
