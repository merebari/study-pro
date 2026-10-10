/** Periodic table data: [atomicNumber, symbol, name, atomic mass, column(1-18), row(1-10), category] */
export type ElementCategory =
  | "nonmetal"
  | "halogen"
  | "noble"
  | "alkali"
  | "alkaline"
  | "metalloid"
  | "post"
  | "transition"
  | "lanthanide"
  | "actinide";

export type ElementInfo = {
  z: number;
  sym: string;
  name: string;
  mass: number;
  col: number;
  row: number;
  cat: ElementCategory;
};

export const CATEGORY_META: Record<ElementCategory, { label: string; color: string }> = {
  nonmetal: { label: "Non-metals", color: "#2f9c68" },
  halogen: { label: "Halogens", color: "#c24d6d" },
  noble: { label: "Noble gases", color: "#5ab3e8" },
  alkali: { label: "Alkali metals", color: "#e45b3d" },
  alkaline: { label: "Alkaline earth metals", color: "#f2b33d" },
  metalloid: { label: "Metalloids", color: "#3e8e7e" },
  post: { label: "Post-transition metals", color: "#3e92cc" },
  transition: { label: "Transition metals", color: "#8b5cf6" },
  lanthanide: { label: "Lanthanides", color: "#d96c9e" },
  actinide: { label: "Actinides", color: "#b4742e" },
};

const E = (
  z: number, sym: string, name: string, mass: number, col: number, row: number, cat: ElementCategory
): ElementInfo => ({ z, sym, name, mass, col, row, cat });

export const ELEMENTS: ElementInfo[] = [
  E(1, "H", "Hydrogen", 1.008, 1, 1, "nonmetal"), E(2, "He", "Helium", 4.003, 18, 1, "noble"),
  E(3, "Li", "Lithium", 6.94, 1, 2, "alkali"), E(4, "Be", "Beryllium", 9.012, 2, 2, "alkaline"),
  E(5, "B", "Boron", 10.81, 13, 2, "metalloid"), E(6, "C", "Carbon", 12.011, 14, 2, "nonmetal"),
  E(7, "N", "Nitrogen", 14.007, 15, 2, "nonmetal"), E(8, "O", "Oxygen", 15.999, 16, 2, "nonmetal"),
  E(9, "F", "Fluorine", 18.998, 17, 2, "halogen"), E(10, "Ne", "Neon", 20.18, 18, 2, "noble"),
  E(11, "Na", "Sodium", 22.99, 1, 3, "alkali"), E(12, "Mg", "Magnesium", 24.305, 2, 3, "alkaline"),
  E(13, "Al", "Aluminium", 26.982, 13, 3, "post"), E(14, "Si", "Silicon", 28.085, 14, 3, "metalloid"),
  E(15, "P", "Phosphorus", 30.974, 15, 3, "nonmetal"), E(16, "S", "Sulphur", 32.06, 16, 3, "nonmetal"),
  E(17, "Cl", "Chlorine", 35.45, 17, 3, "halogen"), E(18, "Ar", "Argon", 39.948, 18, 3, "noble"),
  E(19, "K", "Potassium", 39.098, 1, 4, "alkali"), E(20, "Ca", "Calcium", 40.078, 2, 4, "alkaline"),
  E(21, "Sc", "Scandium", 44.956, 3, 4, "transition"), E(22, "Ti", "Titanium", 47.867, 4, 4, "transition"),
  E(23, "V", "Vanadium", 50.942, 5, 4, "transition"), E(24, "Cr", "Chromium", 51.996, 6, 4, "transition"),
  E(25, "Mn", "Manganese", 54.938, 7, 4, "transition"), E(26, "Fe", "Iron", 55.845, 8, 4, "transition"),
  E(27, "Co", "Cobalt", 58.933, 9, 4, "transition"), E(28, "Ni", "Nickel", 58.693, 10, 4, "transition"),
  E(29, "Cu", "Copper", 63.546, 11, 4, "transition"), E(30, "Zn", "Zinc", 65.38, 12, 4, "transition"),
  E(31, "Ga", "Gallium", 69.723, 13, 4, "post"), E(32, "Ge", "Germanium", 72.63, 14, 4, "metalloid"),
  E(33, "As", "Arsenic", 74.922, 15, 4, "metalloid"), E(34, "Se", "Selenium", 78.971, 16, 4, "nonmetal"),
  E(35, "Br", "Bromine", 79.904, 17, 4, "halogen"), E(36, "Kr", "Krypton", 83.798, 18, 4, "noble"),
  E(37, "Rb", "Rubidium", 85.468, 1, 5, "alkali"), E(38, "Sr", "Strontium", 87.62, 2, 5, "alkaline"),
  E(39, "Y", "Yttrium", 88.906, 3, 5, "transition"), E(40, "Zr", "Zirconium", 91.224, 4, 5, "transition"),
  E(41, "Nb", "Niobium", 92.906, 5, 5, "transition"), E(42, "Mo", "Molybdenum", 95.95, 6, 5, "transition"),
  E(43, "Tc", "Technetium", 98, 7, 5, "transition"), E(44, "Ru", "Ruthenium", 101.07, 8, 5, "transition"),
  E(45, "Rh", "Rhodium", 102.91, 9, 5, "transition"), E(46, "Pd", "Palladium", 106.42, 10, 5, "transition"),
  E(47, "Ag", "Silver", 107.87, 11, 5, "transition"), E(48, "Cd", "Cadmium", 112.41, 12, 5, "transition"),
  E(49, "In", "Indium", 114.82, 13, 5, "post"), E(50, "Sn", "Tin", 118.71, 14, 5, "post"),
  E(51, "Sb", "Antimony", 121.76, 15, 5, "metalloid"), E(52, "Te", "Tellurium", 127.6, 16, 5, "metalloid"),
  E(53, "I", "Iodine", 126.9, 17, 5, "halogen"), E(54, "Xe", "Xenon", 131.29, 18, 5, "noble"),
  E(55, "Cs", "Caesium", 132.91, 1, 6, "alkali"), E(56, "Ba", "Barium", 137.33, 2, 6, "alkaline"),
  E(72, "Hf", "Hafnium", 178.49, 4, 6, "transition"), E(73, "Ta", "Tantalum", 180.95, 5, 6, "transition"),
  E(74, "W", "Tungsten", 183.84, 6, 6, "transition"), E(75, "Re", "Rhenium", 186.21, 7, 6, "transition"),
  E(76, "Os", "Osmium", 190.23, 8, 6, "transition"), E(77, "Ir", "Iridium", 192.22, 9, 6, "transition"),
  E(78, "Pt", "Platinum", 195.08, 10, 6, "transition"), E(79, "Au", "Gold", 196.97, 11, 6, "transition"),
  E(80, "Hg", "Mercury", 200.59, 12, 6, "transition"), E(81, "Tl", "Thallium", 204.38, 13, 6, "post"),
  E(82, "Pb", "Lead", 207.2, 14, 6, "post"), E(83, "Bi", "Bismuth", 208.98, 15, 6, "post"),
  E(84, "Po", "Polonium", 209, 16, 6, "metalloid"), E(85, "At", "Astatine", 210, 17, 6, "halogen"),
  E(86, "Rn", "Radon", 222, 18, 6, "noble"),
  E(87, "Fr", "Francium", 223, 1, 7, "alkali"), E(88, "Ra", "Radium", 226, 2, 7, "alkaline"),
  E(104, "Rf", "Rutherfordium", 267, 4, 7, "transition"), E(105, "Db", "Dubnium", 268, 5, 7, "transition"),
  E(106, "Sg", "Seaborgium", 269, 6, 7, "transition"), E(107, "Bh", "Bohrium", 270, 7, 7, "transition"),
  E(108, "Hs", "Hassium", 277, 8, 7, "transition"), E(109, "Mt", "Meitnerium", 278, 9, 7, "transition"),
  E(110, "Ds", "Darmstadtium", 281, 10, 7, "transition"), E(111, "Rg", "Roentgenium", 282, 11, 7, "transition"),
  E(112, "Cn", "Copernicium", 285, 12, 7, "transition"), E(113, "Nh", "Nihonium", 286, 13, 7, "post"),
  E(114, "Fl", "Flerovium", 289, 14, 7, "post"), E(115, "Mc", "Moscovium", 290, 15, 7, "post"),
  E(116, "Lv", "Livermorium", 293, 16, 7, "post"), E(117, "Ts", "Tennessine", 294, 17, 7, "halogen"),
  E(118, "Og", "Oganesson", 294, 18, 7, "noble"),
  // Lanthanides (row 9, cols 4–18)
  E(57, "La", "Lanthanum", 138.91, 4, 9, "lanthanide"), E(58, "Ce", "Cerium", 140.12, 5, 9, "lanthanide"),
  E(59, "Pr", "Praseodymium", 140.91, 6, 9, "lanthanide"), E(60, "Nd", "Neodymium", 144.24, 7, 9, "lanthanide"),
  E(61, "Pm", "Promethium", 145, 8, 9, "lanthanide"), E(62, "Sm", "Samarium", 150.36, 9, 9, "lanthanide"),
  E(63, "Eu", "Europium", 151.96, 10, 9, "lanthanide"), E(64, "Gd", "Gadolinium", 157.25, 11, 9, "lanthanide"),
  E(65, "Tb", "Terbium", 158.93, 12, 9, "lanthanide"), E(66, "Dy", "Dysprosium", 162.5, 13, 9, "lanthanide"),
  E(67, "Ho", "Holmium", 164.93, 14, 9, "lanthanide"), E(68, "Er", "Erbium", 167.26, 15, 9, "lanthanide"),
  E(69, "Tm", "Thulium", 168.93, 16, 9, "lanthanide"), E(70, "Yb", "Ytterbium", 173.05, 17, 9, "lanthanide"),
  E(71, "Lu", "Lutetium", 174.97, 18, 9, "lanthanide"),
  // Actinides (row 10, cols 4–18)
  E(89, "Ac", "Actinium", 227, 4, 10, "actinide"), E(90, "Th", "Thorium", 232.04, 5, 10, "actinide"),
  E(91, "Pa", "Protactinium", 231.04, 6, 10, "actinide"), E(92, "U", "Uranium", 238.03, 7, 10, "actinide"),
  E(93, "Np", "Neptunium", 237, 8, 10, "actinide"), E(94, "Pu", "Plutonium", 244, 9, 10, "actinide"),
  E(95, "Am", "Americium", 243, 10, 10, "actinide"), E(96, "Cm", "Curium", 247, 11, 10, "actinide"),
  E(97, "Bk", "Berkelium", 247, 12, 10, "actinide"), E(98, "Cf", "Californium", 251, 13, 10, "actinide"),
  E(99, "Es", "Einsteinium", 252, 14, 10, "actinide"), E(100, "Fm", "Fermium", 257, 15, 10, "actinide"),
  E(101, "Md", "Mendelevium", 258, 16, 10, "actinide"), E(102, "No", "Nobelium", 259, 17, 10, "actinide"),
  E(103, "Lr", "Lawrencium", 266, 18, 10, "actinide"),
];
