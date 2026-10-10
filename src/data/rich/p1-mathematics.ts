import type { RichBatch } from "@/data/curriculum/types";

/**
 * CONTENT BATCH 01 — Primary 1 Mathematics (First, Second & Third Terms).
 * Language level: ages 6–7. Read it aloud and it sounds like a patient teacher.
 * Nigerian setting: naira, mangoes, Onitsha market, familiar names.
 */
export const P1_MATHEMATICS: RichBatch = {
  subject: "Mathematics",
  band: "PRI",
  additions: [
    {
      t: "Sorting & Matching Objects",
      classes: ["P1"],
      term: 1,
      focus: { P1: "Put things that are the same together — the start of all maths!" },
    },
    {
      t: "More, Less and the Same",
      classes: ["P1"],
      term: 1,
      focus: { P1: "Which group has more? Which has less? Comparing small groups." },
    },
    {
      t: "Number Bonds to 10",
      classes: ["P1"],
      term: 2,
      focus: { P1: "Pairs of numbers that make 10 — like 6 and 4." },
    },
    {
      t: "Before, After & Between Numbers",
      classes: ["P1"],
      term: 2,
      focus: { P1: "What comes before 7? After 12? Ordering numbers to 50." },
    },
    {
      t: "Ordinal Numbers: 1st to 5th",
      classes: ["P1"],
      term: 2,
      focus: { P1: "First, second, third — who won the race?" },
    },
    {
      t: "2D Shapes Around Us",
      classes: ["P1"],
      term: 3,
      focus: { P1: "Circles, squares, triangles and rectangles in real life." },
    },
    {
      t: "Comparing Sizes: Tall, Short, Long",
      classes: ["P1"],
      term: 3,
      focus: { P1: "Simple measuring words and comparing objects by size." },
    },
  ],
  notes: {
    "Sorting & Matching Objects": {
      term: 1,
      explain: [
        "Before we count, we learn to sort! Sorting means putting things that are the same in one group. If Emeka pours out ALL his crayons, he can put the red ones on one side and the blue ones on the other side. Those are two groups!",
        "Look around your classroom. The teacher's table is in one place. The pupils' chairs are in another place. Even at home, mummy keeps the spoons with the spoons and the cups with the cups. That is sorting!",
        "We can sort by colour, by size, or by shape. We can sort by what the things DO — spoons, forks and knives are all for eating, so they can live in one group.",
      ],
      keyTerms: [
        { term: "Sort", def: "To put things that are the same together in a group." },
        { term: "Match", def: "To find the thing that is the same as another thing." },
        { term: "Group", def: "Things that have been put together because they are alike." },
        { term: "Same", def: "Things that look alike or do the same work." },
        { term: "Different", def: "Things that are not alike." },
      ],
      examples: [
        {
          q: "Adaeze has 3 red biros, 2 blue biros and 1 eraser on her table. How many GROUPS of writing things can she make if she sorts by colour?",
          steps: [
            "First, look at the colours: red and blue.",
            "Put the 3 red biros together — that is group 1.",
            "Put the 2 blue biros together — that is group 2.",
            "The eraser is not a biro, so it is its own group.",
          ],
          answer: "She can make 3 groups: red biros, blue biros, and the eraser.",
        },
        {
          q: "Circle the one that does NOT belong: spoon, fork, plate, sandal.",
          steps: [
            "Spoon, fork and plate are all things we use at the table for eating.",
            "A sandal is something we wear on our feet.",
          ],
          answer: "Sandal — it does not belong with the eating things.",
        },
      ],
      summary: [
        "Sorting means putting alike things together.",
        "We can sort by colour, size, shape or use.",
        "Matching means finding two things that are the same.",
        "Sorting helps us count later — groups are easier to count than scattered things!",
      ],
    },
    "More, Less and the Same": {
      term: 1,
      explain: [
        "Odinaka has 4 biscuits. Her brother Obiora has 2 biscuits. Who has MORE? Odinaka does! Four is bigger than two. When two groups do not have the same number of things, one group has MORE and one group has LESS.",
        "To know which group has more, we can count both groups. We can also match them: put one biscuit from Odinaka next to one from Obiora. When Obiora's biscuits are finished and Odinaka still has some left, we know Odinaka has more.",
        "When two groups have EXACTLY the same number, we say they are the SAME or EQUAL. If both children have 3 sweets each, nobody has more. It is fair!",
      ],
      keyTerms: [
        { term: "More", def: "A bigger number of things than another group." },
        { term: "Less", def: "A smaller number of things than another group." },
        { term: "The same / Equal", def: "Both groups have exactly the same number." },
        { term: "Compare", def: "To look at two groups and say which is more, less or the same." },
      ],
      examples: [
        {
          q: "Basket A has 7 mangoes. Basket B has 5 mangoes. Which basket has MORE mangoes?",
          steps: ["Count basket A: 7.", "Count basket B: 5.", "7 is bigger than 5."],
          answer: "Basket A has more mangoes.",
        },
        {
          q: "Draw lines to make both groups the SAME: Group 1 has 3 cups, Group 2 has 3 plates.",
          steps: ["Count the cups: 3.", "Count the plates: 3.", "3 is the same as 3."],
          answer: "They already have the same number — 3 each. Nothing to add!",
        },
      ],
      summary: [
        "Count both groups before you compare.",
        "The bigger number means MORE; the smaller number means LESS.",
        "When both groups have the same number, they are equal.",
      ],
    },
    "Number Recognition & Counting": {
      term: 1,
      explain: [
        "Numbers are everywhere! The number on your school bus, the number on mummy's phone, the ₦10 note in daddy's wallet — they all use numbers. This term we learn to read, write and count numbers 1 to 100.",
        "Counting means saying the numbers in order: 1, 2, 3, 4, 5 … Each number tells us HOW MANY. If you point at your pencils while counting — 1 (touch), 2 (touch), 3 (touch) — the last number you say is how many pencils you have. That is the magic of counting: the LAST number is the answer!",
        "We also learn to WRITE the numbers. Zero looks like an egg: 0. One is a straight line down: 1. Practice on your slate or in your book — slow and steady. After 9 comes 10: a one and a zero holding hands. It means 'one ten and no ones'.",
      ],
      keyTerms: [
        { term: "Number", def: "A word or figure that tells us how many, like 'five' or 5." },
        { term: "Count", def: "To say numbers in order while pointing at things." },
        { term: "Zero", def: "The number 0 — it means nothing at all, an empty group." },
        { term: "Digit", def: "One of the figures 0,1,2,3,4,5,6,7,8,9 used to write numbers." },
        { term: "How many", def: "The question that counting answers." },
      ],
      examples: [
        {
          q: "Count the oranges: 🍊 🍊 🍊 🍊 🍊 🍊. How many are there?",
          steps: [
            "Touch each orange as you count: 1, 2, 3, 4, 5, 6.",
            "The last number we said is 6.",
          ],
          answer: "There are 6 oranges.",
        },
        {
          q: "Write the number that comes between 13 and 15.",
          steps: ["Say the numbers in order: 13, …, 15.", "The number hiding between them is 14."],
          answer: "14 — because 13, 14, 15.",
        },
        {
          q: "Mummy gave Kelechi ₦10 notes for his money box. He has one ₦10 note. How much is that in naira?",
          steps: ["One ₦10 note is ten naira.", "Write it as 10."],
          answer: "₦10 — ten naira.",
        },
      ],
      summary: [
        "Numbers tell us HOW MANY things there are.",
        "When counting, touch one thing for each number — the last number is the answer.",
        "0 means nothing; after 9 comes 10.",
        "We practise counting to 100 and writing every number neatly.",
      ],
    },
    "Number Bonds to 10": {
      term: 2,
      explain: [
        "Number bonds are best-friend pairs of numbers. Two numbers are 'bonded' when you add them and the answer is 10. Like 6 and 4 — because 6 + 4 = 10. Every number has a friend that makes 10 with it!",
        "Here is a fun way to see it: hold up all 10 fingers. Now fold down 3 fingers. How many are standing? 7! So 3 and 7 are a bond pair: 3 + 7 = 10. Your own hands are a number-bonds machine!",
        "The bond pairs of 10 are: 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5 — and the same backwards. If you know your bonds to 10, adding bigger numbers becomes so much easier later in Primary 2 and 3.",
      ],
      keyTerms: [
        { term: "Bond pair", def: "Two numbers that add up to make 10." },
        { term: "Add", def: "To put groups together and find the total." },
        { term: "Total", def: "The whole amount when groups are joined." },
        { term: "Plus sign (+)", def: "The symbol that means add." },
      ],
      examples: [
        {
          q: "Tunde has 4 eggs. How many MORE eggs does he need to have 10 eggs?",
          steps: [
            "Think of the bond pair for 4: 4 + ? = 10.",
            "Count up from 4 to 10: 5, 6, 7, 8, 9, 10 — that is 6 steps.",
          ],
          answer: "He needs 6 more eggs, because 4 + 6 = 10.",
        },
        {
          q: "Complete the bond: 7 + __ = 10",
          steps: ["7's best friend in bonds to 10 is 3.", "Check: 7 + 3 = 10. ✔"],
          answer: "3",
        },
      ],
      summary: [
        "Number bonds to 10 are pairs that add up to 10.",
        "Use your 10 fingers to find any pair — fold some, count the rest.",
        "Remembering bonds makes adding and subtracting fast.",
      ],
    },
    "Before, After & Between Numbers": {
      term: 2,
      explain: [
        "Numbers stand in a line, just like pupils at morning assembly. Every number has somebody in front of it (BEFORE) and somebody behind it (AFTER). The number AFTER is always 1 more. The number BEFORE is always 1 less.",
        "To find the number AFTER 24, count one step forward: 25. To find the number BEFORE 24, count one step back: 23. Easy!",
        "A number BETWEEN two numbers is the one squeezed in the middle. Between 10 and 12 is 11, like 10, 11, 12. Practice with your number chart on the classroom wall!",
      ],
      keyTerms: [
        { term: "Before", def: "The number that comes one step back (1 less)." },
        { term: "After", def: "The number that comes one step forward (1 more)." },
        { term: "Between", def: "The number squeezed in the middle of two numbers." },
        { term: "Number line", def: "A drawn line with numbers in order — it helps us see before and after." },
      ],
      examples: [
        {
          q: "What number comes AFTER 39?",
          steps: ["After means one step forward.", "39, then 40."],
          answer: "40 — watch how 39 jumps to a new ten: 40!",
        },
        {
          q: "Write the number BETWEEN 17 and 19.",
          steps: ["Say them in order: 17, …, 19.", "The middle number is 18."],
          answer: "18",
        },
      ],
      summary: [
        "After = add 1 more. Before = take 1 away.",
        "Between means the middle number of two given numbers.",
        "Crossing to a new ten (39 → 40) needs extra care!",
      ],
    },
    "Ordinal Numbers: 1st to 5th": {
      term: 2,
      explain: [
        "When we count things we say 1, 2, 3, 4 — those are counting numbers. But when we show POSITION, like who came first in the race, we use ordinal numbers: 1st, 2nd, 3rd, 4th, 5th. We say them as first, second, third, fourth, fifth.",
        "Imagine the school inter-house sports. Chiamaka crosses the finish line before everyone else — she is FIRST (1st)! Ahmed is just behind her — SECOND (2nd). Positions tell us where somebody stands in a line or a race.",
        "Look at your class line. The pupil at the very front is in the 1st position. The one behind is 2nd. Ordinal numbers are counting with jobs — they answer 'which position?', not 'how many?'.",
      ],
      keyTerms: [
        { term: "Ordinal number", def: "A number that shows position: 1st, 2nd, 3rd…" },
        { term: "Position", def: "Where somebody or something stands in a line." },
        { term: "First (1st)", def: "The number one position — before everybody." },
      ],
      examples: [
        {
          q: "In a race, Kemi finished 3rd. How many runners finished BEFORE her?",
          steps: ["3rd means there are 2 positions ahead: 1st and 2nd.", "So 2 runners finished before Kemi."],
          answer: "2 runners.",
        },
        {
          q: "Write the ordinal word for 5th.",
          steps: ["Counting: 1, 2, 3, 4, 5.", "Positions: 1st first, 2nd second, 3rd third, 4th fourth, 5th fifth."],
          answer: "Fifth.",
        },
      ],
      summary: [
        "Ordinal numbers show position, not quantity.",
        "1st = first, 2nd = second, 3rd = third, 4th = fourth, 5th = fifth.",
        "The person at the front of the line is in the 1st position.",
      ],
    },
    "Addition & Subtraction": {
      term: 1,
      explain: [
        "Addition means PUTTING TOGETHER. Mother bought 3 loaves of bread at Bodija market and aunty gave you 2 more. To know how many loaves you have now, you ADD: 3 + 2 = 5. The + sign means 'and'; the = sign means 'is the same as'.",
        "Subtraction is the opposite: TAKING AWAY. You had 5 sweets and you ate 2. How many are left? Count backward: 5, take away 2 … 3! We write 5 − 2 = 3. The − sign means 'take away'.",
        "You can use anything to help you: fingers, bottle tops, sticks, or drawing circles and crossing some out. In Primary 1 we add and subtract numbers up to 20 — always slowly, always checking our answer with real objects.",
      ],
      keyTerms: [
        { term: "Add", def: "Put groups together to find the total." },
        { term: "Subtract", def: "Take some away to find what is left." },
        { term: "Plus (+)", def: "The sign for adding." },
        { term: "Minus (−)", def: "The sign for taking away." },
        { term: "Equals (=)", def: "The sign that says both sides are the same." },
        { term: "Left", def: "What remains after we take some away." },
      ],
      examples: [
        {
          q: "There were 6 birds on a wire. 4 more birds came and joined them. How many birds are on the wire now?",
          steps: [
            "This is a putting-together story, so we ADD.",
            "Start at 6 and count 4 forward: 7, 8, 9, 10.",
            "So 6 + 4 = 10.",
          ],
          answer: "10 birds are on the wire now.",
        },
        {
          q: "Ify had ₦20. She bought a pencil for ₦5. How much money is left?",
          steps: [
            "Spending money means taking away, so we SUBTRACT.",
            "20 − 5: count 5 steps back from 20: 19, 18, 17, 16, 15.",
            "So 20 − 5 = 15.",
          ],
          answer: "₦15 is left.",
        },
        {
          q: "Fill the gap: 8 + __ = 12",
          steps: ["Count from 8 up to 12: 9, 10, 11, 12 — that is 4 steps.", "8 + 4 = 12."],
          answer: "4",
        },
      ],
      summary: [
        "Addition puts groups together (+); subtraction takes away (−).",
        "Stories about 'getting more' are addition; 'spending, eating, losing' are subtraction.",
        "Use fingers or objects and always check your answer.",
        "In P1 we work with numbers up to 20.",
      ],
    },
    "2D Shapes Around Us": {
      term: 3,
      explain: [
        "Look around you — shapes are everywhere! The clock in the parlour is a CIRCLE: round with no corners. Your exercise book is a RECTANGLE: 4 straight sides and 4 corners, with two sides longer. A perfect box face or a floor tile is a SQUARE: all 4 sides equal. And a slice of akara-fry? No — that is round too! But the top of a roof or a party hat looks like a TRIANGLE: 3 sides, 3 corners.",
        "We call them 2D (flat) shapes because they lie flat on a page — you can draw them but you cannot hold them like a ball. Corners have a special name too: VERTICES (one corner is a vertex).",
        "A sweet game: close your eyes while your friend describes a shape — 'I have 3 sides and 3 corners!' — then you shout its name. Shapes make drawing houses, cars and even people much easier.",
      ],
      keyTerms: [
        { term: "Circle", def: "A round flat shape with no corners — like a coin." },
        { term: "Square", def: "A flat shape with 4 equal sides and 4 corners — like a floor tile." },
        { term: "Rectangle", def: "A flat shape with 4 sides; 2 long and 2 short — like a book." },
        { term: "Triangle", def: "A flat shape with 3 sides and 3 corners — like a party hat." },
        { term: "Corner / Vertex", def: "The point where two sides of a shape meet." },
        { term: "Side", def: "One straight edge of a shape." },
      ],
      examples: [
        {
          q: "Name the shape: it has 4 sides and 4 corners, but opposite sides are equal. Your bedroom door has this shape.",
          steps: ["4 sides and 4 corners means square or rectangle.", " Opposite sides equal but not all equal → rectangle.", "A door is longer than it is wide."],
          answer: "A rectangle.",
        },
        {
          q: "Count the corners of a triangle.",
          steps: ["A triangle has 3 sides.", "Each side meets the next at a corner."],
          answer: "3 corners (vertices).",
        },
      ],
      summary: [
        "The four main flat shapes are circle, square, rectangle and triangle.",
        "Count sides and corners to name any shape.",
        "Real things have shapes: coin = circle, book = rectangle, tile = square.",
      ],
    },
    "Comparing Sizes: Tall, Short, Long": {
      term: 3,
      explain: [
        "Before we use rulers in Primary 2, we compare sizes with our eyes and body. Daddy is TALLER than you. A pencil is SHORTER than a broom. The Third Mainland Bridge in Lagos is LONGER than the small bridge across your village stream!",
        "To compare two things fairly, stand them side by side and START them at the same place — like two pupils standing with their backs at the same wall. The one that reaches higher or goes further is the taller or longer one.",
        "We also order things: shortest, short, tall, tallest. During assembly, your class lines up from the shortest at the front to the tallest at the back — that is ordering by height!",
      ],
      keyTerms: [
        { term: "Tall / Taller", def: "Having a big height; comparing heights of two things." },
        { term: "Short / Shorter", def: "Having a small height or length." },
        { term: "Long / Longer", def: "Reaching far from end to end." },
        { term: "Compare", def: "Check two things to see which is bigger, longer or taller." },
        { term: "Order", def: "Arrange things from small to big or short to tall." },
      ],
      examples: [
        {
          q: "Emeka's ruler is shorter than the teacher's cane. Put them in order from shortest to longest: teacher's cane, Emeka's ruler, a piece of chalk.",
          steps: ["Chalk is the smallest of the three.", "Then the ruler.", "The teacher's cane is the longest."],
          answer: "Chalk → ruler → cane.",
        },
        {
          q: "Who is taller — you or your classroom wall?",
          steps: ["Stand beside the wall.", "The wall reaches far above your head."],
          answer: "The classroom wall is taller.",
        },
      ],
      summary: [
        "We compare sizes with words like tall, short, long, bigger, smaller.",
        "Always line things up at the same starting point before comparing.",
        "Ordering means arranging from shortest to tallest or smallest to biggest.",
      ],
    },
  },
};
