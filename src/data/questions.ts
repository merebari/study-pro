/** Curated practice questions, keyed to subjects/topics in the curriculum data. */

export interface QuestionDef {
  subject: string;
  band: "PRI" | "JSS" | "SSS";
  classCode?: string;
  topic?: string;
  q: string;
  options: [string, string, string, string];
  answer: number; // 0-based index into options
  explain: string;
  level: 1 | 2 | 3; // difficulty
  /** Past-question source exam, e.g. "WAEC 2022" (omit for regular practice) */
  exam?: "WAEC" | "NECO" | "JAMB" | "BECE" | "Common Entrance";
  year?: number;
}

export const QUESTIONS: QuestionDef[] = [
  // ── PRIMARY · ENGLISH ────────────────────────────────────────────
  { subject: "English Studies", band: "PRI", classCode: "P3", topic: "Nouns", q: "Which of these is a PROPER noun?", options: ["city", "Lagos", "boy", "market"], answer: 1, explain: "A proper noun names one particular person, place or thing and starts with a capital letter — Lagos.", level: 1 },
  { subject: "English Studies", band: "PRI", classCode: "P4", topic: "Verbs & Tenses", q: "Choose the past tense form: Yesterday, I ___ my breakfast before school.", options: ["eat", "eaten", "ate", "eats"], answer: 2, explain: "The past tense of 'eat' is 'ate'.", level: 1 },
  { subject: "English Studies", band: "PRI", classCode: "P2", topic: "Punctuation & Capitalisation", q: "Which punctuation mark ends this sentence: 'What is your name ___'", options: ["full stop (.)", "comma (,)", "question mark (?)", "apostrophe (')"], answer: 2, explain: "Direct questions end with a question mark.", level: 1 },
  { subject: "English Studies", band: "PRI", classCode: "P5", topic: "Vocabulary, Synonyms & Antonyms", q: "Which word is a synonym of 'brave'?", options: ["fearful", "courageous", "careful", "silent"], answer: 1, explain: "A synonym has nearly the same meaning: brave = courageous.", level: 2 },
  { subject: "English Studies", band: "PRI", classCode: "P5", topic: "Prepositions & Conjunctions", q: "Complete: We stayed at home ___ it was raining heavily.", options: ["but", "because", "or", "until"], answer: 1, explain: "'Because' gives the reason for staying at home.", level: 2 },

  // ── PRIMARY · MATHEMATICS ────────────────────────────────────────
  { subject: "Mathematics", band: "PRI", classCode: "P3", topic: "Multiplication", q: "What is 7 × 8?", options: ["54", "56", "63", "48"], answer: 1, explain: "7 × 8 = 56 — a key times-table fact.", level: 1 },
  { subject: "Mathematics", band: "PRI", classCode: "P4", topic: "Fractions", q: "Which is the LARGEST fraction?", options: ["1/2", "1/4", "1/8", "1/10"], answer: 0, explain: "When numerators are the same, the smaller denominator gives the larger share: half is the biggest.", level: 2 },
  { subject: "Mathematics", band: "PRI", classCode: "P5", topic: "Division", q: "What is 144 ÷ 12?", options: ["10", "11", "12", "14"], answer: 2, explain: "12 × 12 = 144, so 144 ÷ 12 = 12.", level: 1 },
  { subject: "Mathematics", band: "PRI", classCode: "P4", topic: "Place Value", q: "What is the value of the digit 5 in 3,542?", options: ["5", "50", "500", "5,000"], answer: 2, explain: "The 5 sits in the hundreds column, so its value is 500.", level: 2 },
  { subject: "Mathematics", band: "PRI", classCode: "P4", topic: "Money", q: "Two pencils at ₦150 each and an eraser at ₦100. How much change from ₦500?", options: ["₦200", "₦150", "₦100", "₦50"], answer: 2, explain: "Total = 150 + 150 + 100 = ₦400. Change = 500 − 400 = ₦100.", level: 2 },
  { subject: "Mathematics", band: "PRI", classCode: "P6", topic: "Fractions", q: "What is 3/5 of ₦100?", options: ["₦30", "₦60", "₦50", "₦75"], answer: 1, explain: "100 ÷ 5 = 20; 20 × 3 = ₦60.", level: 2 },
  { subject: "Mathematics", band: "PRI", classCode: "P3", topic: "Time", q: "How many minutes are in 2½ hours?", options: ["120", "150", "130", "150"], answer: 1, explain: "2 hours = 120 minutes, plus half an hour (30) = 150 minutes.", level: 2 },

  // ── PRIMARY · BASIC SCIENCE & TECHNOLOGY ─────────────────────────
  { subject: "Basic Science & Technology", band: "PRI", classCode: "P3", topic: "Plants Around Us", q: "Which of these do plants NOT need to grow?", options: ["water", "sunlight", "sweets", "air"], answer: 2, explain: "Plants need water, light and air — sweets are for birthday parties!", level: 1 },
  { subject: "Basic Science & Technology", band: "PRI", classCode: "P5", topic: "The Earth, Sun, Moon & Stars", q: "The sun is actually a ___.", options: ["planet", "moon", "star", "comet"], answer: 2, explain: "The sun is our nearest star — a huge ball of hot gas.", level: 1 },
  { subject: "Basic Science & Technology", band: "PRI", classCode: "P5", topic: "Health, Hygiene & Common Illnesses", q: "Malaria is spread to people through the bite of the ___.", options: ["housefly", "female Anopheles mosquito", "tsetse fly", "cockroach"], answer: 1, explain: "The female Anopheles mosquito carries the malaria parasite.", level: 2 },
  { subject: "Basic Science & Technology", band: "PRI", classCode: "P4", topic: "Matter: Solids, Liquids & Gases", q: "Water vapour (steam) is an example of a ___.", options: ["solid", "liquid", "gas", "metal"], answer: 2, explain: "When water boils it changes to steam, which is a gas.", level: 1 },
  { subject: "Basic Science & Technology", band: "PRI", classCode: "P6", topic: "Electricity Around Us", q: "A simple electric circuit must contain all of these EXCEPT a ___.", options: ["cell (battery)", "connecting wire", "bulb", "magnet"], answer: 3, explain: "A circuit needs a power source, wires and a load (the bulb) — no magnet required.", level: 2 },

  // ── JSS · ENGLISH ────────────────────────────────────────────────
  { subject: "English Language", band: "JSS", classCode: "J1", topic: "Parts of Speech", q: "In 'She danced gracefully', the word 'gracefully' is a/an ___.", options: ["adjective", "adverb", "preposition", "conjunction"], answer: 1, explain: "It describes HOW she danced — an adverb of manner.", level: 1 },
  { subject: "English Language", band: "JSS", classCode: "J3", topic: "Tenses & Concord", q: "Neither of the boys ___ present.", options: ["are", "were", "is", "have been"], answer: 2, explain: "'Neither' takes a singular verb: neither … is.", level: 2 },
  { subject: "English Language", band: "JSS", classCode: "J1", topic: "Letter Writing", q: "Which salutation is correct for an INFORMAL letter?", options: ["Dear Sir,", "Dear Father,", "Yours faithfully,", "The Principal,"], answer: 1, explain: "Informal letters go to people we know personally: 'Dear Father,' fits.", level: 1 },

  // ── JSS · MATHEMATICS ────────────────────────────────────────────
  { subject: "Mathematics", band: "JSS", classCode: "J1", topic: "Algebraic Expressions", q: "Simplify: 3x + 4x − 2x", options: ["9x", "5x", "7x", "x"], answer: 1, explain: "Add and subtract the coefficients: 3 + 4 − 2 = 5, so 5x.", level: 1 },
  { subject: "Mathematics", band: "JSS", classCode: "J1", topic: "Ratio, Rate & Proportion", q: "Share ₦600 between Ada and Bola in the ratio 1 : 2. Bola receives ___.", options: ["₦200", "₦300", "₦400", "₦500"], answer: 2, explain: "Total parts = 3. Bola gets 2/3 × 600 = ₦400.", level: 2 },
  { subject: "Mathematics", band: "JSS", classCode: "J2", topic: "Percentages & Profit/Loss", q: "What is 25% of 480?", options: ["100", "120", "140", "96"], answer: 1, explain: "25% = ¼, and ¼ of 480 = 120.", level: 1 },
  { subject: "Mathematics", band: "JSS", classCode: "J2", topic: "Simple & Linear Equations", q: "Solve for x: 2x + 6 = 14", options: ["x = 3", "x = 4", "x = 5", "x = 10"], answer: 1, explain: "2x = 14 − 6 = 8, so x = 4.", level: 1 },
  { subject: "Mathematics", band: "JSS", classCode: "J1", topic: "Angles, Lines & Triangles", q: "Angles on a straight line add up to ___.", options: ["90°", "180°", "270°", "360°"], answer: 1, explain: "A straight line forms a straight angle of 180°.", level: 1 },
  { subject: "Mathematics", band: "JSS", classCode: "J3", topic: "Statistics & Data Presentation", q: "Find the mean of 4, 8, 10, 6, 12.", options: ["7", "8", "9", "10"], answer: 1, explain: "Sum = 40; 40 ÷ 5 numbers = 8.", level: 2 },
  { subject: "Mathematics", band: "JSS", classCode: "J2", topic: "Number Bases", q: "Convert 101 (base 2) to base 10.", options: ["3", "4", "5", "6"], answer: 2, explain: "1×4 + 0×2 + 1×1 = 5.", level: 2 },

  // ── JSS · BASIC SCIENCE ──────────────────────────────────────────
  { subject: "Basic Science", band: "JSS", classCode: "J2", topic: "Living Things & the Cell", q: "Which cell organelle is known as the 'powerhouse of the cell'?", options: ["nucleus", "ribosome", "mitochondrion", "cell wall"], answer: 2, explain: "Mitochondria release energy from food through respiration.", level: 2 },
  { subject: "Basic Science", band: "JSS", classCode: "J1", topic: "Habitats & Adaptation", q: "Which feature adapts a fish to life in water?", options: ["wings", "gills", "fur", "long legs"], answer: 1, explain: "Gills extract oxygen dissolved in the water.", level: 1 },
  { subject: "Basic Science", band: "JSS", classCode: "J1", topic: "Energy: Forms & Transformations", q: "The energy a body possesses because of its motion is called ___.", options: ["potential energy", "chemical energy", "kinetic energy", "sound energy"], answer: 2, explain: "Kinetic energy = energy of movement.", level: 1 },
  { subject: "Basic Science", band: "JSS", classCode: "J2", topic: "Electricity & Circuits", q: "In a SERIES circuit, electric current has ___.", options: ["many different paths", "only one path", "no path", "two equal paths"], answer: 1, explain: "Series means one single loop — break it anywhere and everything goes off.", level: 2 },
  { subject: "Basic Science", band: "JSS", classCode: "J1", topic: "Food Chains & Energy Flow", q: "In a food chain, green plants are called ___.", options: ["consumers", "producers", "decomposers", "predators"], answer: 1, explain: "Plants PRODUCE their own food by photosynthesis.", level: 1 },
  { subject: "Basic Science", band: "JSS", classCode: "J1", topic: "Force & Motion", q: "Which of these REDUCES friction between two surfaces?", options: ["roughening the surfaces", "applying oil or grease", "increasing the weight", "using rubber tyres"], answer: 1, explain: "Lubricants like oil separate the surfaces so they slide smoothly.", level: 2 },

  // ── JSS · OTHERS ─────────────────────────────────────────────────
  { subject: "Computer Studies", band: "JSS", classCode: "J2", topic: "Computer Hardware", q: "How many bytes make one kilobyte (approximately)?", options: ["100", "1,000", "1,024", "10,000"], answer: 2, explain: "1 KB = 2¹⁰ = 1,024 bytes.", level: 2 },
  { subject: "Civic & Security Education", band: "JSS", classCode: "J2", topic: "Elections & Choosing Leaders", q: "Which body conducts national elections in Nigeria?", options: ["EFCC", "INEC", "NDLEA", "FRSC"], answer: 1, explain: "The Independent National Electoral Commission (INEC) organises and conducts elections.", level: 1 },
  { subject: "Business Studies", band: "JSS", classCode: "J2", topic: "Banking & Saving", q: "Which account is BEST for saving and earning interest?", options: ["current account", "savings account", "fixed floats", "suspense account"], answer: 1, explain: "Savings accounts pay interest and encourage regular saving.", level: 1 },

  // ── SSS · MATHEMATICS ────────────────────────────────────────────
  { subject: "Mathematics", band: "SSS", classCode: "S1", topic: "Indices & Logarithms", q: "Evaluate log₁₀ 1000.", options: ["2", "3", "10", "100"], answer: 1, explain: "1000 = 10³, so the logarithm is 3.", level: 1 },
  { subject: "Mathematics", band: "SSS", classCode: "S1", topic: "Sequences: AP & GP", q: "Find the 10th term of the AP: 5, 8, 11, …", options: ["29", "30", "32", "35"], answer: 2, explain: "T₁₀ = a + 9d = 5 + 9(3) = 32.", level: 2 },
  { subject: "Mathematics", band: "SSS", classCode: "S2", topic: "Linear & Quadratic Equations", q: "The roots of x² − 5x + 6 = 0 are ___.", options: ["1 and 6", "−2 and −3", "2 and 3", "5 and 1"], answer: 2, explain: "Factorise: (x − 2)(x − 3) = 0 → x = 2 or 3.", level: 2 },
  { subject: "Mathematics", band: "SSS", classCode: "S1", topic: "Trigonometry", q: "sin 30° = ?", options: ["√3/2", "1/2", "1", "√2/2"], answer: 1, explain: "From the special 30-60-90 triangle, sin 30° = ½.", level: 1 },
  { subject: "Mathematics", band: "SSS", classCode: "S2", topic: "Probability", q: "A fair die is thrown once. What is the probability of an even number?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 2, explain: "Even outcomes are 2, 4, 6 — three of six equally likely outcomes: 3/6 = ½.", level: 1 },
  { subject: "Mathematics", band: "SSS", classCode: "S3", topic: "Matrices & Determinants", q: "Find the determinant of the matrix ⎡2 1⎤ / ⎣3 4⎦.", options: ["5", "11", "8", "−5"], answer: 0, explain: "det = (2×4) − (1×3) = 8 − 3 = 5.", level: 2 },

  // ── SSS · BIOLOGY ────────────────────────────────────────────────
  { subject: "Biology", band: "SSS", classCode: "S1", topic: "The Cell: Structure & Function", q: "The basic structural and functional unit of all living things is the ___.", options: ["tissue", "organ", "cell", "system"], answer: 2, explain: "Every organism — from Amoeba to humans — is built from cells.", level: 1 },
  { subject: "Biology", band: "SSS", classCode: "S1", topic: "Photosynthesis & Plant Nutrition", q: "Which gas is RELEASED during photosynthesis?", options: ["carbon dioxide", "nitrogen", "oxygen", "hydrogen"], answer: 2, explain: "Plants release oxygen as a by-product of making glucose.", level: 1 },
  { subject: "Biology", band: "SSS", classCode: "S2", topic: "Genetics & Variation", q: "A cross between two heterozygotes (Rr × Rr) gives a phenotypic ratio of ___.", options: ["1 : 1", "1 : 2 : 1", "3 : 1", "9 : 3 : 3 : 1"], answer: 2, explain: "Offspring: 1 RR : 2 Rr : 1 rr — the first three show the dominant trait, giving 3 : 1.", level: 3 },
  { subject: "Biology", band: "SSS", classCode: "S1", topic: "Ecology: Ecosystems & Nutrient Cycles", q: "Nitrogen-fixing bacteria in legumes live in the ___.", options: ["stem cells", "root nodules", "leaf veins", "flower petals"], answer: 1, explain: "Rhizobium bacteria live in root nodules and convert atmospheric nitrogen into nitrates.", level: 2 },
  { subject: "Biology", band: "SSS", classCode: "S2", topic: "Transport Systems", q: "How many chambers does the human heart have?", options: ["two", "three", "four", "five"], answer: 2, explain: "Two atria + two ventricles = four chambers.", level: 1 },

  // ── SSS · CHEMISTRY ──────────────────────────────────────────────
  { subject: "Chemistry", band: "SSS", classCode: "S1", topic: "Atomic Structure & the Periodic Table", q: "The atomic number of an element is the number of ___ in its atom.", options: ["neutrons", "electrons plus neutrons", "protons", "nucleons"], answer: 2, explain: "Atomic number Z = number of protons in the nucleus.", level: 1 },
  { subject: "Chemistry", band: "SSS", classCode: "S1", topic: "Stoichiometry & the Mole Concept", q: "How many moles are in 18 g of water? (H₂O = 18 g/mol)", options: ["0.5 mol", "1 mol", "2 mol", "18 mol"], answer: 1, explain: "n = mass ÷ molar mass = 18 ÷ 18 = 1 mole.", level: 2 },
  { subject: "Chemistry", band: "SSS", classCode: "S1", topic: "Acids, Bases & Salts", q: "A neutral solution has a pH of ___.", options: ["0", "3", "7", "14"], answer: 2, explain: "pH 7 is neutral — neither acidic nor alkaline.", level: 1 },
  { subject: "Chemistry", band: "SSS", classCode: "S2", topic: "Gas Laws", q: "Boyle's law states that at constant temperature ___.", options: ["V ∝ T", "P₁V₁ = P₂V₂", "PV = nRT", "V₁/T₁ = V₂/T₂"], answer: 1, explain: "Boyle: pressure × volume is constant at constant temperature.", level: 2 },
  { subject: "Chemistry", band: "SSS", classCode: "S1", topic: "Chemical Bonding", q: "The bond in sodium chloride (NaCl) is best described as ___.", options: ["covalent", "metallic", "ionic", "hydrogen"], answer: 2, explain: "Sodium transfers an electron to chlorine — a classic ionic (electrovalent) bond.", level: 1 },

  // ── SSS · PHYSICS ────────────────────────────────────────────────
  { subject: "Physics", band: "SSS", classCode: "S1", topic: "Motion & Kinematics", q: "Which equation of motion is correct?", options: ["v = u − at", "s = vt + ½at²", "v = u + at", "v² = u² − 2as"], answer: 2, explain: "v = u + at relates final velocity to initial velocity, acceleration and time.", level: 1 },
  { subject: "Physics", band: "SSS", classCode: "S1", topic: "Forces & Newton's Laws", q: "A force acts on a 2 kg mass producing acceleration 3 m/s². The force is ___.", options: ["1.5 N", "5 N", "6 N", "0.67 N"], answer: 2, explain: "F = ma = 2 × 3 = 6 newtons.", level: 2 },
  { subject: "Physics", band: "SSS", classCode: "S2", topic: "Waves", q: "A wave has frequency 50 Hz and wavelength 0.4 m. Its speed is ___.", options: ["12.5 m/s", "20 m/s", "45 m/s", "125 m/s"], answer: 1, explain: "v = fλ = 50 × 0.4 = 20 m/s.", level: 2 },
  { subject: "Physics", band: "SSS", classCode: "S2", topic: "Light & Optics", q: "The image formed by a plane mirror is ___.", options: ["real and inverted", "virtual and upright", "real and magnified", "virtual and inverted"], answer: 1, explain: "Plane mirrors form virtual, upright, same-size images behind the mirror.", level: 1 },
  { subject: "Physics", band: "SSS", classCode: "S2", topic: "Static & Current Electricity", q: "A current of 2 A flows through a 10 Ω resistor. The voltage across it is ___.", options: ["5 V", "12 V", "20 V", "8 V"], answer: 2, explain: "V = IR = 2 × 10 = 20 volts.", level: 1 },
  { subject: "Physics", band: "SSS", classCode: "S1", topic: "Measurement & Units", q: "Which instrument is MOST accurate for measuring the diameter of a thin wire?", options: ["metre rule", "tape measure", "vernier caliper", "micrometer screw gauge"], answer: 3, explain: "The micrometer screw gauge measures to 0.01 mm — the most precise choice.", level: 2 },

  // ── SSS · ENGLISH ────────────────────────────────────────────────
  { subject: "English Language", band: "SSS", classCode: "S2", topic: "Concord & Tense Mastery", q: "The news ___ very encouraging.", options: ["are", "were", "is", "have been"], answer: 2, explain: "'News' is an uncountable noun and takes a singular verb.", level: 2 },
  { subject: "English Language", band: "SSS", classCode: "S1", topic: "Idioms & Figures of Speech", q: "To 'let the cat out of the bag' means to ___.", options: ["free a trapped animal", "reveal a secret", "start an argument", "waste money"], answer: 1, explain: "The idiom means to disclose a secret, usually accidentally.", level: 1 },
  { subject: "English Language", band: "SSS", classCode: "S3", topic: "Stress, Emphasis & Intonation", q: "In English word stress, 'IMport' (noun) differs from 'imPORT' (verb) mainly by ___.", options: ["spelling", "which syllable is stressed", "vowel length only", "intonation pattern"], answer: 1, explain: "Nouns stress the first syllable (IMport); verbs stress the second (imPORT).", level: 3 },

  // ── SSS · ECONOMICS / GOVERNMENT / COMMERCE ─────────────────────
  { subject: "Economics", band: "SSS", classCode: "S1", topic: "Introduction: Scarcity & Choice", q: "Opportunity cost is best defined as ___.", options: ["the money price of a good", "the next best alternative forgone", "the total cost of production", "the profit from a choice"], answer: 1, explain: "Choosing one thing means giving up the best alternative — that is the opportunity cost.", level: 1 },
  { subject: "Economics", band: "SSS", classCode: "S1", topic: "Demand & Supply", q: "According to the law of demand, other things being equal, as price rises ___.", options: ["demand rises", "quantity demanded falls", "supply falls", "income rises"], answer: 1, explain: "Higher price → lower quantity demanded — a movement along the demand curve.", level: 1 },
  { subject: "Economics", band: "SSS", classCode: "S3", topic: "Money & Banking", q: "The apex bank of Nigeria is the ___.", options: ["World Bank", "Central Bank of Nigeria", "Bank of Industry", "African Development Bank"], answer: 1, explain: "The CBN regulates the financial system and controls monetary policy.", level: 1 },
  { subject: "Government", band: "SSS", classCode: "S1", topic: "Organs of Government", q: "The primary function of the legislature is ___.", options: ["interpreting laws", "punishing offenders", "making laws", "commanding the army"], answer: 2, explain: "Lawmaking is the legislature's core duty; the judiciary interprets and the executive implements.", level: 1 },
  { subject: "Government", band: "SSS", classCode: "S2", topic: "Federalism in Nigeria", q: "How many states does Nigeria currently have?", options: ["30 states", "34 states", "36 states", "40 states"], answer: 2, explain: "Nigeria has 36 states plus the Federal Capital Territory, Abuja.", level: 1 },
  { subject: "Government", band: "SSS", classCode: "S3", topic: "International Organisations", q: "The headquarters of ECOWAS is located in ___.", options: ["Lagos", "Accra", "Abuja", "Dakar"], answer: 2, explain: "The Economic Community of West African States is headquartered in Abuja, Nigeria.", level: 1 },
  { subject: "Commerce", band: "SSS", classCode: "S2", topic: "Insurance", q: "The insurance principle that restores the insured to their former position without profit is ___.", options: ["subrogation", "contribution", "indemnity", "utmost good faith"], answer: 2, explain: "Indemnity means exact compensation — no more, no less.", level: 2 },
  { subject: "Financial Accounting", band: "SSS", classCode: "S1", topic: "The Ledger & Double Entry", q: "Which accounting equation is correct?", options: ["Assets = Capital − Liabilities", "Capital = Assets + Liabilities", "Assets = Capital + Liabilities", "Liabilities = Assets + Capital"], answer: 2, explain: "The fundamental equation: everything the business owns is financed by owners' capital plus what it owes.", level: 1 },
  { subject: "Computer Science", band: "SSS", classCode: "S2", topic: "Data Representation", q: "The hexadecimal digit F is equivalent to which denary value?", options: ["10", "14", "15", "16"], answer: 2, explain: "A=10, B=11 … F=15 in hexadecimal notation.", level: 2 },
  { subject: "Further Mathematics", band: "SSS", classCode: "S1", topic: "Differentiation", q: "If y = x³, then dy/dx = ?", options: ["x²", "3x²", "3x³", "x³/3"], answer: 1, explain: "By the power rule: bring down the 3 and reduce the power by one → 3x².", level: 2 },

  // ── SSS · CIVIC & OTHERS ─────────────────────────────────────────
  { subject: "Civic Education", band: "SSS", classCode: "S1", topic: "Human Rights & Democracy", q: "The UDHR was proclaimed by the United Nations in ___.", options: ["1935", "1945", "1948", "1960"], answer: 2, explain: "The Universal Declaration of Human Rights was adopted on 10 December 1948.", level: 2 },
  { subject: "Literature-in-English", band: "SSS", classCode: "S1", topic: "Genres of Literature", q: "A long fictional narrative written in prose is a ___.", options: ["poem", "novel", "play", "epigram"], answer: 1, explain: "The novel is prose fiction of extended length — drama is written for performance.", level: 1 },
  { subject: "Geography", band: "SSS", classCode: "S1", topic: "Map Reading & Interpretation", q: "On a map with scale 1 : 50,000, 4 cm on the map represents ___ on the ground.", options: ["200 m", "2 km", "20 km", "0.2 km"], answer: 1, explain: "4 cm × 50,000 = 200,000 cm = 2,000 m = 2 km.", level: 2 },
];
