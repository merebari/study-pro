import type { SubjectDef } from "./types";

/** SS 1–3: English core + Arts & Humanities subjects. */
export const SSS_ARTS_SUBJECTS: SubjectDef[] = [
  {
    name: "English Language",
    icon: "BookOpen",
    color: "#DC5B45",
    band: "SSS",
    blurb:
      "The SS core subject for every candidate: lexis, structure, essays, summary and oral English for WAEC/NECO.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "Parts of Speech & Advanced Grammar", classes: ["S1", "S2", "S3"], focus: { S1: "Word classes in authentic sentences.", S2: "Phrasal verbs, determiners and conjunctions.", S3: "Grammar under exam conditions: error identification." } },
      { t: "Concord & Tense Mastery", classes: ["S1", "S2", "S3"], focus: { S1: "Rules of subject–verb agreement.", S2: "Tricky concord: collective nouns, proximity.", S3: "Sequence of tenses in reported sentences." } },
      { t: "Sentence Structure", classes: ["S1", "S2", "S3"], focus: { S1: "Simple, compound and complex sentences.", S2: "Clauses and their functions.", S3: "Transformation of sentences without changing meaning." } },
      { t: "Comprehension & Summary", classes: ["S1", "S2", "S3"], focus: { S1: "Reading for main and supporting ideas.", S2: "Vocabulary in context and inference.", S3: "WAEC summary skills: one sentence per answer." } },
      { t: "Lexis & Structure Drills", classes: ["S1", "S2", "S3"], focus: { S1: "Nouns, verbs and word formation.", S2: "Collocations and register.", S3: "Objective-test mastery: 40 questions under time." } },
      { t: "Essay Writing", classes: ["S1", "S2", "S3"], focus: { S1: "Narrative and descriptive techniques.", S2: "Expository and argumentative structures.", S3: "Full WAEC essays: plan, draft, polish in 45 minutes." } },
      { t: "Formal Letters & Reports", classes: ["S1", "S2", "S3"], focus: { S1: "Letters of application and complaint.", S2: "Reports for clubs, societies and principals.", S3: "Articles and speeches for publication." } },
      { t: "Oral English: Vowels & Consonants", classes: ["S1", "S2", "S3"], focus: { S1: "The 44 sounds and their symbols.", S2: "Diphthongs and consonant clusters.", S3: "Test-of-orals drills: sound discrimination." } },
      { t: "Stress, Emphasis & Intonation", classes: ["S2", "S3"], focus: { S2: "Word stress: shifting patterns (IMport vs imPORT).", S3: "Emphatic stress questions and intonation meanings." } },
      { t: "Idioms & Figures of Speech", classes: ["S1", "S2", "S3"], focus: { S1: "Common idioms in Nigerian English use.", S2: "Simile, metaphor, personification and hyperbole.", S3: "Interpret figurative language in passages." } },
      { t: "Registers of Different Fields", classes: ["S2", "S3"], focus: { S2: "Law, medicine, journalism and technology words.", S3: "Identify register from context in exams." } },
    ],
  },
  {
    name: "Literature-in-English",
    icon: "Feather",
    color: "#8B5A83",
    band: "SSS",
    blurb:
      "Drama, prose and poetry — African and non-African set texts with analysis frameworks that earn top marks.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "Genres of Literature", classes: ["S1", "S2"], focus: { S1: "Prose, drama and poetry distinguished.", S2: "Plot, setting, characterisation and theme." } },
      { t: "Elements of Drama", classes: ["S1", "S2", "S3"], focus: { S1: "Act, scene, dialogue and stage directions.", S2: "Tragedy and comedy conventions.", S3: "Dramatic irony, soliloquy and conflict." } },
      { t: "Prose: Studying the Novel", classes: ["S1", "S2", "S3"], focus: { S1: "Narrative techniques: point of view, flashback.", S2: "Character analysis with textual evidence.", S3: "Theme essays on African prose set texts." } },
      { t: "Poetry: Devices & Analysis", classes: ["S1", "S2", "S3"], focus: { S1: "Rhyme, rhythm and stanza forms.", S2: "Imagery, symbolism and sound devices.", S3: "Analyse unseen poems step by step." } },
      { t: "African Poetry", classes: ["S2", "S3"], focus: { S2: "Oral tradition into print: praise and dirge poetry.", S3: "Set poems: context, subject matter, language." } },
      { t: "Non-African Poetry & Drama", classes: ["S2", "S3"], focus: { S2: "Sonnet, ode and ballad traditions.", S3: "Shakespeare and modern drama: key scenes in depth." } },
      { t: "Literary Appreciation Workshop", classes: ["S2", "S3"], focus: { S2: "Respond to unseen passages: the APPRECIATION method.", S3: "Timed practice on WAEC Paper 3/4 patterns." } },
      { t: "Working with WAEC Set Texts", classes: ["S2", "S3"], focus: { S2: "Read actively: annotate, question, connect.", S3: "Context questions and essay planning for the current syllabus." } },
    ],
  },
  {
    name: "Government",
    icon: "Landmark",
    color: "#7A4E3E",
    band: "SSS",
    blurb:
      "Political ideas and Nigerian governance: constitutions, federalism, elections and international relations.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "Nature & Scope of Government", classes: ["S1"], focus: { S1: "Meaning, arms and levels of government; the state and its elements." } },
      { t: "Political Ideas & Ideologies", classes: ["S1", "S2"], focus: { S1: "Power, authority, legitimacy and sovereignty.", S2: "Capitalism, socialism and communalism compared." } },
      { t: "Constitutions & Constitutionalism", classes: ["S1", "S2", "S3"], focus: { S1: "Types, features and sources of constitutions.", S2: "Principles of constitutional government.", S3: "Supremacy and amendment processes." } },
      { t: "Organs of Government", classes: ["S1", "S2"], focus: { S1: "Legislature: structure and functions.", S2: "Executive and judiciary; checks and balances in Nigeria." } },
      { t: "Nigerian Constitutional Development", classes: ["S1", "S2", "S3"], focus: { S1: "Clifford (1922) to Macpherson (1951).", S2: "Lyttleton (1954) and independence constitutions.", S3: "The 1979, 1989 and 1999 constitutions." } },
      { t: "Federalism in Nigeria", classes: ["S1", "S2", "S3"], focus: { S1: "Meaning and features of federal systems.", S2: "Evolution of Nigerian federalism.", S3: "Problems: revenue allocation, state creation, restructuring debate." } },
      { t: "Political Parties & Electoral Systems", classes: ["S2", "S3"], focus: { S2: "Parties from 1923 to date; franchise.", S3: "Electoral commissions and reform (INEC)." } },
      { t: "Citizenship & Fundamental Rights", classes: ["S1", "S2"], focus: { S1: "Acquisition and loss of Nigerian citizenship.", S2: "Rights in the 1999 Constitution and their limits." } },
      { t: "The Public Service", classes: ["S2", "S3"], focus: { S2: "Civil service structure, functions and problems.", S3: "Local government: the 1976 reforms to date." } },
      { t: "Military Rule in Nigeria", classes: ["S2", "S3"], focus: { S2: "Causes of intervention; major regimes.", S3: "Transition programmes and lessons for democracy." } },
      { t: "International Organisations", classes: ["S2", "S3"], focus: { S2: "The UN and its agencies.", S3: "AU, ECOWAS, OPEC and the Commonwealth; Nigeria's foreign policy." } },
    ],
  },
  {
    name: "Christian Religious Studies",
    icon: "Church",
    color: "#8B7BC7",
    band: "SSS",
    blurb:
      "Old Testament themes, the Gospels and the early church — WAEC CRS with passage mastery.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "Old Testament Themes", classes: ["S1", "S2", "S3"], focus: { S1: "Creation and the covenant with Israel.", S2: "Leadership: Joseph, Moses, Joshua and the judges.", S3: "Prophets and Israel's kings: lessons for today." } },
      { t: "The Life & Ministry of Jesus", classes: ["S1", "S2", "S3"], focus: { S1: "Birth, baptism and temptation.", S2: "Teachings, parables and miracles.", S3: "Passion, death, resurrection and ascension." } },
      { t: "The Early Church & the Apostles", classes: ["S2", "S3"], focus: { S2: "Pentecost, fellowship and persecution.", S3: "Paul's conversion, missions and letters." } },
      { t: "Christian Ethics & Social Issues", classes: ["S1", "S2", "S3"], focus: { S1: "Love, forgiveness and obedience.", S2: "Christian views on marriage, work and wealth.", S3: "Applying faith to corruption, injustice and unity." } },
    ],
  },
  {
    name: "Islamic Religious Studies",
    icon: "MoonStar",
    color: "#3C9A78",
    band: "SSS",
    blurb:
      "Qur'an, hadith, fiqh and Islamic history — senior secondary IRS to certificate standard.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "Qur'an & Hadith Studies", classes: ["S1", "S2", "S3"], focus: { S1: "Revelation, preservation and sciences of the Qur'an.", S2: "Selected texts: reading with translation.", S3: "Hadith collections and authentication." } },
      { t: "Tawhid & Articles of Faith", classes: ["S1", "S2", "S3"], focus: { S1: "Meaning of tawhid; shirk and its forms.", S2: "Belief in prophets and scriptures.", S3: "Eschatology: the Hereafter in Qur'an and Sunnah." } },
      { t: "Islamic Law (Fiqh)", classes: ["S1", "S2", "S3"], focus: { S1: "Purification and prayer regulations.", S2: "Fasting, zakat and hajj jurisprudence.", S3: "Family law: marriage, divorce and inheritance basics." } },
      { t: "Sirah & Islamic History", classes: ["S1", "S2", "S3"], focus: { S1: "The Prophet ﷺ in Makkah.", S2: "The Madinan state and treaties.", S3: "The Rightly Guided Caliphs and early expansion." } },
      { t: "Islamic Morals & Society", classes: ["S1", "S2", "S3"], focus: { S1: "Character of the believer.", S2: "Family and neighbourly relations.", S3: "Islam on justice, work and wealth in modern Nigeria." } },
    ],
  },
  {
    name: "Nigerian Languages",
    icon: "Languages",
    color: "#B4612E",
    band: "SSS",
    blurb:
      "Yorùbá, Hausa and Igbo at certificate level: phonology, grammar, literature and culture.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "Phonology of the Language", classes: ["S1", "S2", "S3"], focus: { S1: "Vowel and consonant systems.", S2: "Tone system and syllable structure.", S3: "Sound processes and their effect on meaning." } },
      { t: "Grammar & Syntax", classes: ["S1", "S2", "S3"], focus: { S1: "Word classes and their features.", S2: "Phrase and clause structure.", S3: "Sentence types and transformations." } },
      { t: "Oral & Written Literature", classes: ["S1", "S2", "S3"], focus: { S1: "Folktales, myths and legends.", S2: "Proverbs, riddles and praise poetry.", S3: "Modern written literature: analysis of set texts." } },
      { t: "Culture & Traditional Institutions", classes: ["S1", "S2", "S3"], focus: { S1: "Marriage, naming and burial rites.", S2: "Festivals and traditional occupations.", S3: "Chieftaincy systems and modern relevance." } },
      { t: "Composition & Translation", classes: ["S1", "S2", "S3"], focus: { S1: "Letter and essay writing in the language.", S2: "Summary skills in the language.", S3: "Translation technique: English ↔ mother tongue." } },
    ],
  },
  {
    name: "Visual Arts",
    icon: "Palette",
    color: "#E8A12B",
    band: "SSS",
    blurb:
      "Art history, drawing, painting, sculpture and graphics — theory and studio for the creative specialist.",
    classes: ["S1", "S2", "S3"],
    topics: [
      { t: "History of Nigerian Art", classes: ["S1", "S2", "S3"], focus: { S1: "Prehistoric and Nok terracotta art.", S2: "Ife and Benin bronze traditions.", S3: "Modern masters: Aina Onabolu to Bruce Onobrakpeya." } },
      { t: "Drawing Fundamentals", classes: ["S1", "S2", "S3"], focus: { S1: "Line, tone and proportion.", S2: "Perspective and composition.", S3: "Life drawing and imaginative composition." } },
      { t: "Painting", classes: ["S2", "S3"], focus: { S2: "Media: watercolour, gouache, acrylic; colour mixing.", S3: "Develop original paintings from studies." } },
      { t: "Sculpture & Ceramics", classes: ["S2", "S3"], focus: { S2: "Modelling and construction techniques.", S3: "Pottery: throwing and hand-building at studio level." } },
      { t: "Graphics & Applied Art", classes: ["S2", "S3"], focus: { S2: "Lettering, poster and logo design.", S3: "Printmaking: linocut and screen printing." } },
      { t: "Art Appreciation & Criticism", classes: ["S1", "S2", "S3"], focus: { S1: "Describe, analyse, interpret, judge.", S2: "Compare African and Western art traditions.", S3: "Write critical reviews of artworks and exhibitions." } },
    ],
  },
  {
    name: "Civic Education",
    icon: "Users",
    color: "#2E8B8B",
    band: "SSS",
    blurb:
      "Rights, responsibilities and democratic participation — core values for senior secondary citizens.",
    classes: ["S1", "S2"],
    topics: [
      { t: "Citizenship & Civic Responsibility", classes: ["S1", "S2"], focus: { S1: "Modes of acquiring citizenship.", S2: "Duties of citizens to the nation." } },
      { t: "Human Rights & Democracy", classes: ["S1", "S2"], focus: { S1: "Seven core freedoms in UDHR & Nigerian law.", S2: "Pillars of democracy and popular participation." } },
      { t: "Rule of Law & National Development", classes: ["S2"], focus: { S2: "Due process, equity and citizen empowerment." } },
      { t: "National Service & Community Action", classes: ["S1", "S2"], focus: { S1: "NYSC and volunteerism.", S2: "Leading positive change in your community." } },
    ],
  },
];
