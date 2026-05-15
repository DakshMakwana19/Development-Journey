/**
 * dsa-sheet.ts — Curated DSA Problem Sheet with LeetCode Links
 * Organized by topic with difficulty ratings and direct problem URLs.
 */

export interface SheetProblem {
  id: string;
  name: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  link: string;
}

export const DSA_SHEET: SheetProblem[] = [
  // ── Arrays ──
  { id: 'a1', name: 'Two Sum', topic: 'Arrays', difficulty: 'easy', link: 'https://leetcode.com/problems/two-sum/' },
  { id: 'a2', name: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 'a3', name: 'Contains Duplicate', topic: 'Arrays', difficulty: 'easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
  { id: 'a4', name: 'Maximum Subarray', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 'a5', name: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 'a6', name: 'Sort Colors', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/sort-colors/' },
  { id: 'a7', name: 'Next Permutation', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/next-permutation/' },
  { id: 'a8', name: 'Merge Intervals', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 'a9', name: 'Set Matrix Zeroes', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { id: 'a10', name: '3Sum', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/3sum/' },
  { id: 'a11', name: '4Sum', topic: 'Arrays', difficulty: 'medium', link: 'https://leetcode.com/problems/4sum/' },
  { id: 'a12', name: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'hard', link: 'https://leetcode.com/problems/trapping-rain-water/' },

  // ── Strings ──
  { id: 's1', name: 'Valid Anagram', topic: 'Strings', difficulty: 'easy', link: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 's2', name: 'Valid Palindrome', topic: 'Strings', difficulty: 'easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
  { id: 's3', name: 'Longest Common Prefix', topic: 'Strings', difficulty: 'easy', link: 'https://leetcode.com/problems/longest-common-prefix/' },
  { id: 's4', name: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 's5', name: 'String to Integer (atoi)', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/string-to-integer-atoi/' },
  { id: 's6', name: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 's7', name: 'Group Anagrams', topic: 'Strings', difficulty: 'medium', link: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 's8', name: 'Minimum Window Substring', topic: 'Strings', difficulty: 'hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },

  // ── Linked Lists ──
  { id: 'l1', name: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 'l2', name: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 'l3', name: 'Linked List Cycle', topic: 'Linked Lists', difficulty: 'easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 'l4', name: 'Remove Nth Node From End of List', topic: 'Linked Lists', difficulty: 'medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 'l5', name: 'Add Two Numbers', topic: 'Linked Lists', difficulty: 'medium', link: 'https://leetcode.com/problems/add-two-numbers/' },
  { id: 'l6', name: 'Copy List with Random Pointer', topic: 'Linked Lists', difficulty: 'medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  { id: 'l7', name: 'Flatten a Multilevel Doubly Linked List', topic: 'Linked Lists', difficulty: 'medium', link: 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/' },
  { id: 'l8', name: 'Merge k Sorted Lists', topic: 'Linked Lists', difficulty: 'hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },

  // ── Stacks & Queues ──
  { id: 'sq1', name: 'Valid Parentheses', topic: 'Stacks & Queues', difficulty: 'easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 'sq2', name: 'Min Stack', topic: 'Stacks & Queues', difficulty: 'medium', link: 'https://leetcode.com/problems/min-stack/' },
  { id: 'sq3', name: 'Next Greater Element I', topic: 'Stacks & Queues', difficulty: 'easy', link: 'https://leetcode.com/problems/next-greater-element-i/' },
  { id: 'sq4', name: 'Daily Temperatures', topic: 'Stacks & Queues', difficulty: 'medium', link: 'https://leetcode.com/problems/daily-temperatures/' },
  { id: 'sq5', name: 'Implement Queue using Stacks', topic: 'Stacks & Queues', difficulty: 'easy', link: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
  { id: 'sq6', name: 'Largest Rectangle in Histogram', topic: 'Stacks & Queues', difficulty: 'hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
  { id: 'sq7', name: 'Sliding Window Maximum', topic: 'Stacks & Queues', difficulty: 'hard', link: 'https://leetcode.com/problems/sliding-window-maximum/' },

  // ── Trees ──
  { id: 't1', name: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 't2', name: 'Invert Binary Tree', topic: 'Trees', difficulty: 'easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 't3', name: 'Same Tree', topic: 'Trees', difficulty: 'easy', link: 'https://leetcode.com/problems/same-tree/' },
  { id: 't4', name: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 't5', name: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id: 't6', name: 'Lowest Common Ancestor of a BST', topic: 'Trees', difficulty: 'medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
  { id: 't7', name: 'Construct Binary Tree from Preorder and Inorder', topic: 'Trees', difficulty: 'medium', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { id: 't8', name: 'Binary Tree Maximum Path Sum', topic: 'Trees', difficulty: 'hard', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { id: 't9', name: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'hard', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },

  // ── Graphs ──
  { id: 'g1', name: 'Number of Islands', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 'g2', name: 'Clone Graph', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/clone-graph/' },
  { id: 'g3', name: 'Course Schedule', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/course-schedule/' },
  { id: 'g4', name: 'Pacific Atlantic Water Flow', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { id: 'g5', name: 'Graph Valid Tree', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/graph-valid-tree/' },
  { id: 'g6', name: 'Rotting Oranges', topic: 'Graphs', difficulty: 'medium', link: 'https://leetcode.com/problems/rotting-oranges/' },
  { id: 'g7', name: 'Word Ladder', topic: 'Graphs', difficulty: 'hard', link: 'https://leetcode.com/problems/word-ladder/' },
  { id: 'g8', name: 'Alien Dictionary', topic: 'Graphs', difficulty: 'hard', link: 'https://leetcode.com/problems/alien-dictionary/' },

  // ── Binary Search ──
  { id: 'bs1', name: 'Binary Search', topic: 'Binary Search', difficulty: 'easy', link: 'https://leetcode.com/problems/binary-search/' },
  { id: 'bs2', name: 'Search Insert Position', topic: 'Binary Search', difficulty: 'easy', link: 'https://leetcode.com/problems/search-insert-position/' },
  { id: 'bs3', name: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 'bs4', name: 'Find Minimum in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { id: 'bs5', name: 'Koko Eating Bananas', topic: 'Binary Search', difficulty: 'medium', link: 'https://leetcode.com/problems/koko-eating-bananas/' },
  { id: 'bs6', name: 'Median of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },

  // ── DP ──
  { id: 'd1', name: 'Climbing Stairs', topic: 'DP', difficulty: 'easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 'd2', name: 'House Robber', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/house-robber/' },
  { id: 'd3', name: 'Coin Change', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/coin-change/' },
  { id: 'd4', name: 'Longest Increasing Subsequence', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 'd5', name: 'Unique Paths', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/unique-paths/' },
  { id: 'd6', name: 'Word Break', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/word-break/' },
  { id: 'd7', name: 'Longest Common Subsequence', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { id: 'd8', name: '0/1 Knapsack (Partition Equal Subset Sum)', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
  { id: 'd9', name: 'Edit Distance', topic: 'DP', difficulty: 'medium', link: 'https://leetcode.com/problems/edit-distance/' },
  { id: 'd10', name: 'Burst Balloons', topic: 'DP', difficulty: 'hard', link: 'https://leetcode.com/problems/burst-balloons/' },

  // ── Greedy ──
  { id: 'gr1', name: 'Jump Game', topic: 'Greedy', difficulty: 'medium', link: 'https://leetcode.com/problems/jump-game/' },
  { id: 'gr2', name: 'Jump Game II', topic: 'Greedy', difficulty: 'medium', link: 'https://leetcode.com/problems/jump-game-ii/' },
  { id: 'gr3', name: 'Gas Station', topic: 'Greedy', difficulty: 'medium', link: 'https://leetcode.com/problems/gas-station/' },
  { id: 'gr4', name: 'Task Scheduler', topic: 'Greedy', difficulty: 'medium', link: 'https://leetcode.com/problems/task-scheduler/' },
  { id: 'gr5', name: 'Non-overlapping Intervals', topic: 'Greedy', difficulty: 'medium', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },

  // ── Backtracking ──
  { id: 'bt1', name: 'Subsets', topic: 'Backtracking', difficulty: 'medium', link: 'https://leetcode.com/problems/subsets/' },
  { id: 'bt2', name: 'Permutations', topic: 'Backtracking', difficulty: 'medium', link: 'https://leetcode.com/problems/permutations/' },
  { id: 'bt3', name: 'Combination Sum', topic: 'Backtracking', difficulty: 'medium', link: 'https://leetcode.com/problems/combination-sum/' },
  { id: 'bt4', name: 'Word Search', topic: 'Backtracking', difficulty: 'medium', link: 'https://leetcode.com/problems/word-search/' },
  { id: 'bt5', name: 'Palindrome Partitioning', topic: 'Backtracking', difficulty: 'medium', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
  { id: 'bt6', name: 'N-Queens', topic: 'Backtracking', difficulty: 'hard', link: 'https://leetcode.com/problems/n-queens/' },

  // ── Hashing ──
  { id: 'h1', name: 'Longest Consecutive Sequence', topic: 'Hashing', difficulty: 'medium', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
  { id: 'h2', name: 'Top K Frequent Elements', topic: 'Hashing', difficulty: 'medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 'h3', name: 'Subarray Sum Equals K', topic: 'Hashing', difficulty: 'medium', link: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
  { id: 'h4', name: 'LRU Cache', topic: 'Hashing', difficulty: 'medium', link: 'https://leetcode.com/problems/lru-cache/' },
];

/** All unique topics in the sheet */
export const SHEET_TOPICS = [...new Set(DSA_SHEET.map(p => p.topic))];

/** localStorage key for tracking solved sheet problems */
const SHEET_KEY = 'aiml_dsa_sheet_solved';

export function getSheetSolved(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SHEET_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveSheetSolved(solved: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHEET_KEY, JSON.stringify(solved));
}

export function toggleSheetProblem(id: string): Record<string, boolean> {
  const solved = getSheetSolved();
  solved[id] = !solved[id];
  saveSheetSolved(solved);
  return solved;
}
