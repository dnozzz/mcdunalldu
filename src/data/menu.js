export const peso = (n) => "₱" + n.toLocaleString("en-PH");

// Photos hotlinked from McDonald's Philippines official CDN
// (d3bjzufjcawald.cloudfront.net) — no files downloaded.
// Prices are concept/demo prices in PHP.
const CDN = "https://d3bjzufjcawald.cloudfront.net";
const img = (p) => `${CDN}/${p}`;

const B = {
  bigMac: img("public/web/2024-03-06/65e82c80d0140/Menu_Burgers_500x500_BigMac-500.jpg"),
  burgerMcDo: img("public/web/2024-03-06/65e82d1f2017d/Menu_Burgers_500x500_BurgerMcDo-500.jpg"),
  qpc: img("public/web/2024-03-06/65e82ef5b45f6/Menu_Burgers_500x500_QPC-500.jpg"),
  doubleCheese: img("public/web/2024-03-06/65e830b48e43b/Menu_Burgers_500x500_DoubleCheeseburger-500.jpg"),
  cheeseburger: img("public/web/2024-03-06/65e835f9cf7cd/Menu_Burgers_500x500_Cheeseburger-500.jpg"),
  mcChicken: img("public/web/2024-03-06/65e837059646e/Menu_Burgers_500x500_McChickenSandwich-500.jpg"),
  crispyChicken: img("public/web/2024-03-06/65e8366171bae/Menu_Burgers_500x500_CrispyChickenFilletSandwich-500.jpg"),
};
const C = {
  chickenRice: img("public/web/2024-03-07/65e90d86862ba/Menu_Chicken_500x500_1pcChickenMcDo_Plus_Rice-500.jpg"),
  chickenSpag: img("public/web/2024-03-07/65e90205230b2/Menu_Chicken_500x500_1pcChickenMcDo_Plus_Spaghetti-500.jpg"),
  chicken2Rice: img("public/web/2024-03-07/65e90c6a6f036/Menu_Chicken_500x500_2pcChickenMcDo_Plus_Rice-500.jpg"),
  nuggetsFries: img("public/web/2024-03-07/65e92e7942235/Menu_Chicken_500x500_6pcChickenNuggets_Plus_Fries-500.jpg"),
  filletRice: img("public/web/2024-03-07/65e92d3852167/Menu_Chicken_500x500_1pcChickenFillet_Plus_Rice-500.jpg"),
};
const F = {
  fries: img("public/web/2024-03-07/65e934e80364e/Menu_Fries_500x500_FriesMedium-500.jpg"),
  poptato: img("public/web/2026-08-26/6a8e8c92cead4/Desserts500x500_Poptato-500.jpg"),
};
const K = {
  eggdesal: img("public/web/2024-03-04/65e5c207ca73c/Menu_Breakfast_500x500_CheesyEggdesal-500.jpg"),
  mcmuffin: img("public/web/2024-03-04/65e5c34b4c8fa/Menu_Breakfast_500x500_McMuffinSausagePlusEgg-500.jpg"),
  sausageRice: img("public/web/2024-03-04/65e5c4770ef40/Menu_Breakfast_500x500_SausagePlatterPlusRice-500.jpg"),
  hashbrowns: img("public/web/2024-03-04/65e5c559db84b/Menu_Breakfast_500x500_HashBrowns-500.jpg"),
  hotcakes: img("public/web/2025-01-29/67997bf6ea192/Menu_Breakfast_500x500_2pcHotcakes_2025-500.jpg"),
};
const MC = {
  latte: img("public/web/2019-03-07/4b60c2f1dc0949145333b99156f94744/McCafe-CafeLatte-500.jpeg"),
  espresso: img("public/web/2019-03-07/51e2c8898110035ac54b69f37618ae8d/McCafe-Espresso-500.jpeg"),
  mochaFrappe: img("public/web/2019-03-07/76de16472be13d469d85d54f35d132d7/McCafe-MochaFrappe-500.jpeg"),
  cappuccino: img("public/web/2019-03-07/817e1df4c7171d3756e9b469dbf8f7c0/McCafe-Capuccino-500.jpeg"),
  icedLatte: img("public/web/2019-03-07/85cbbd7670d7e2edde8f59459af830b7/McCafe-IcedLatte-500.jpeg"),
  icedMocha: img("public/web/2019-03-07/9df13f948920bf96c3bbd5e8e07db7bf/McCafe-IcedMocha-500.jpeg"),
  hotChoco: img("public/web/2019-03-07/a370bee6851c45849f55dde712a47ddc/McCafe-PremiumHotChocolate-500.jpeg"),
  macchiato: img("public/web/2019-03-07/a8df96d48191859a7cb92c50ff3845e6/McCafe-Macchiato-500.jpeg"),
  americano: img("public/web/2019-03-07/ac34963d365e27f9fec9be63b33f8e49/McCafe-Americano-500.jpeg"),
  smoothie: img("public/web/2019-03-07/ad7b28f466614dc0c78985bff7c9cc43/McCafe-StrawberrySmoothie-500.jpeg"),
  icedAmericano: img("public/web/2019-03-07/ceddf4fae63034b1df0a688468431e2b/McCafe-IcedAmericano-500.jpeg"),
  caramelFrappe: img("public/web/2019-03-07/d95d27067177a0321ab996e2a970420a/McCafe-CaramelFrappe-500.jpeg"),
  chocoFrappe: img("public/web/2019-03-07/e6b1a92a03488ef88103ca001bc9d591/McCafe-DoubleChocoFrappe-500.jpeg"),
  oreoCake: img("public/web/2020-01-30/5e3293fbb9d3a/OreoCheesecake-500.jpeg"),
  blueberryCake: img("public/web/2020-01-30/5e328f9a9ab10/BlueberryCheesecake-500.jpeg"),
  fudgeCake: img("public/web/2020-01-30/5e328ff37711c/DarkChocolateFudgeCake-500.jpeg"),
  cookie: img("public/web/2020-01-31/5e33ff544fa7b/Cookie-500.jpeg"),
};
const D = {
  mcflurry: img("public/web/2024-06-03/665d88e649b59/Desserts500x500_McFlurryOreo_Mondelez-500-500.jpg"),
  hotFudge: img("public/web/2024-06-03/665d8916d709e/Menu_Desserts_500x500_SundaeHotFudge-500.jpg"),
  caramel: img("public/web/2024-06-03/665d894a0c0ac/Menu_Desserts_500x500_SundaeCaramel-500-500.jpg"),
  cone: img("public/web/2024-06-03/665d8982dd930/Menu_Desserts_500x500_VanillaSundaeCone-500.jpg"),
  taroPie: img("public/web/2026-08-26/6a8e8b2d6ce2d/Desserts500x500_TaroCustardPe-500.jpg"),
  chocoPie: img("public/web/2026-08-26/6a8e8c5e4b622/Desserts500x500_ChocoPie-500.jpg"),
  coke: img("public/web/2024-06-03/665d882937bd9/COKE-500x500px-500-500.jpg"),
  cokeZero: img("public/web/2024-06-03/665d886fe3fd1/Menu_Drinks_500x500_CokeZero-500-500.jpg"),
  mcFloat: img("public/web/2024-06-03/665d88b1a8571/Menu_Drinks_500x500_McFloatCoke-500-500.jpg"),
  oj: img("public/web/2024-06-03/665d8abc293de/Menu_Drinks_500x500_OrangeJuice-500.jpg"),
  coffee: img("public/web/2025-01-20/678e0596c3835/Menu_Drinks-500x500-Premium-Roast-Coffee-2025-500.jpg"),
  aw: img("public/web/2026-09-21/6ab0a5b6d2689/Drinks500x500_A&W-500.jpg"),
  awFloat: img("public/web/2026-08-26/6a8e8c6f67ad0/Drinks500x500_McFloatA&W-500.jpg"),
};

export const categories = [
  {
    id: "combos", title: "Sulit Combos & Meals", sub: "May fries + drink na — busog agad!",
    items: [
      { e: "🍔", n: "Big Mac Meal (Medium)", d: "Big Mac + medium fries + regular drink.", p: 219, tag: "BESTSELLER", img: B.bigMac },
      { e: "🍗", n: "1-pc Chicken McDo Meal", d: "Chicken McDo + rice + fries + drink.", p: 195, tag: "LOVE KO TO", img: C.chickenRice },
      { e: "🍝", n: "Chicken McDo + McSpaghetti Combo", d: "1-pc chicken + sweet McSpaghetti + drink.", p: 199, tag: "PH FAVE", img: C.chickenSpag },
      { e: "🍔", n: "Burger McDo Meal", d: "Burger McDo + fries + drink.", p: 149, tag: "", img: B.burgerMcDo },
      { e: "🍔", n: "McChicken Meal", d: "McChicken sandwich + fries + drink.", p: 185, tag: "", img: B.mcChicken },
      { e: "🍗", n: "Nuggets Happy Meal", d: "4-pc nuggets + kiddie fries + juice + toy!", p: 139, tag: "FOR KIDS", img: C.nuggetsFries },
    ],
  },
  {
    id: "burgers", title: "Burgers", sub: "100% pure beef, lutong fresh.",
    items: [
      { e: "🍔", n: "Big Mac (Solo)", d: "Two beef patties, special sauce, lettuce, cheese.", p: 179, tag: "BESTSELLER", img: B.bigMac },
      { e: "🍔", n: "Quarter Pounder with Cheese", d: "¼ lb fresh beef, 2 cheese slices, pickles, onions.", p: 205, tag: "", img: B.qpc },
      { e: "🍔", n: "Double Cheeseburger", d: "Two patties, two cheese, pickles, ketchup, mustard.", p: 155, tag: "", img: B.doubleCheese },
      { e: "🍔", n: "Cheeseburger", d: "Classic solo cheeseburger sa toasty buns.", p: 95, tag: "", img: B.cheeseburger },
      { e: "🍔", n: "Burger McDo", d: "Beefier patty, sweeter sauce. All-time classic!", p: 99, tag: "CLASSIC", img: B.burgerMcDo },
      { e: "🍗", n: "McChicken Sandwich", d: "Crispy fillet, mayo, shredded lettuce.", p: 139, tag: "", img: B.mcChicken },
      { e: "🍗", n: "Crispy Chicken Sandwich", d: "Juicy chicken patty, creamy mayo, soft bun.", p: 149, tag: "NEW", isNew: true, img: B.crispyChicken },
    ],
  },
  {
    id: "chicken", title: "Chicken & Platters", sub: "Crispy, juicy, paborito ng bayan.",
    items: [
      { e: "🍗", n: "1-pc Chicken McDo w/ Rice", d: "Crispy chicken + steamed rice + gravy.", p: 149, tag: "LOVE KO TO", img: C.chickenRice },
      { e: "🍗", n: "2-pc Chicken McDo w/ Rice", d: "Dalawang crispy chicken + 2 rice. Pang-malakasan!", p: 229, tag: "", img: C.chicken2Rice },
      { e: "🍝", n: "1-pc Chicken McDo w/ McSpaghetti", d: "Crispy chicken + sweet Pinoy spaghetti.", p: 169, tag: "PH FAVE", img: C.chickenSpag },
      { e: "🍗", n: "6-pc Nuggets w/ Fries", d: "Golden nuggets + crunchy fries + 1 dip.", p: 149, tag: "", img: C.nuggetsFries },
      { e: "🍗", n: "Crispy Chicken Fillet w/ Rice", d: "Crispy fillet + steamed rice + gravy.", p: 129, tag: "", img: C.filletRice },
    ],
  },
  {
    id: "breakfast", title: "Breakfast (till 10:30AM)", sub: "Good morning, busog!",
    items: [
      { e: "🍳", n: "Cheesy Eggdesal", d: "Egg + cheese sa soft pandesal. Pinoy na Pinoy!", p: 89, tag: "PH ONLY", img: K.eggdesal },
      { e: "🍳", n: "Sausage McMuffin w/ Egg", d: "Sausage, egg + cheese sa toasted muffin.", p: 145, tag: "", img: K.mcmuffin },
      { e: "🍳", n: "Sausage Platter with Rice", d: "Sausage, garlic rice + fried egg.", p: 149, tag: "ALMUSAL", isNew: true, img: K.sausageRice },
      { e: "🥔", n: "Hash Browns (2-pc)", d: "Crispy golden potato. Perfect pair!", p: 59, tag: "", img: K.hashbrowns },
      { e: "🥞", n: "2-pc Hotcakes w/ Sausage", d: "Fluffy hotcakes + syrup + sausage.", p: 119, tag: "", img: K.hotcakes },
    ],
  },
  {
    id: "sides", title: "Fries & Desserts", sub: "Panghimagas at pampabusog.",
    items: [
      { e: "🍟", n: "World Famous Fries (Medium)", d: "Golden, crispy, tamang alat.", p: 99, tag: "", img: F.fries },
      { e: "🥔", n: "Poptato", d: "Bite-size crispy potato pops. Bagong fave!", p: 79, tag: "NEW", isNew: true, img: F.poptato },
      { e: "🍦", n: "Oreo McFlurry", d: "Vanilla soft serve with Oreo bits.", p: 99, tag: "FAN FAVE", img: D.mcflurry },
      { e: "🍨", n: "Hot Fudge Sundae", d: "Vanilla sundae + hot fudge.", p: 75, tag: "", img: D.hotFudge },
      { e: "🍨", n: "Caramel Sundae", d: "Vanilla sundae + caramel drizzle.", p: 75, tag: "", img: D.caramel },
      { e: "🍦", n: "Vanilla Sundae Cone", d: "Classic soft-serve cone.", p: 45, tag: "", img: D.cone },
      { e: "🥧", n: "Taro Custard Pie", d: "Crispy pie, creamy taro custard. Limited!", p: 65, tag: "NEW", isNew: true, img: D.taroPie },
      { e: "🥧", n: "Choco Pie", d: "Crispy pie, melty chocolate filling.", p: 65, tag: "NEW", isNew: true, img: D.chocoPie },
    ],
  },
  {
    id: "drinks", title: "Drinks & McCafé", sub: "Pampalamig at pampagising.",
    items: [
      { e: "🥤", n: "Coke (Medium)", d: "Ice-cold Coca-Cola.", p: 69, tag: "", img: D.coke },
      { e: "🥤", n: "Coke Zero (Medium)", d: "Zero sugar, same sarap.", p: 69, tag: "", img: D.cokeZero },
      { e: "🥤", n: "Coke McFloat", d: "Coke + vanilla soft serve sa ibabaw.", p: 79, tag: "FAN FAVE", img: D.mcFloat },
      { e: "🍊", n: "Orange Juice", d: "Fresh and zesty.", p: 75, tag: "", img: D.oj },
      { e: "☕", n: "Premium Roast Coffee", d: "100% Arabica, brewed fresh.", p: 59, tag: "", img: D.coffee },
      { e: "🥤", n: "A&W Root Beer", d: "Ice-cold, distinctively smooth.", p: 75, tag: "NEW", isNew: true, img: D.aw },
      { e: "🥤", n: "A&W McFloat", d: "A&W + vanilla soft serve sa ibabaw.", p: 85, tag: "NEW", isNew: true, img: D.awFloat },
    ],
  },
  {
    id: "mccafe", title: "McCafé", sub: "100% Arabica espresso drinks + cakes.",
    items: [
      { e: "☕", n: "Espresso (Solo)", d: "Bold single shot, rich crema.", p: 75, tag: "", img: MC.espresso },
      { e: "☕", n: "Americano", d: "Espresso + hot water. Smooth and strong.", p: 85, tag: "", img: MC.americano },
      { e: "🧊", n: "Iced Americano", d: "Chilled Americano over ice.", p: 95, tag: "", img: MC.icedAmericano },
      { e: "☕", n: "Café Latte", d: "Espresso + steamed milk, silky smooth.", p: 110, tag: "", img: MC.latte },
      { e: "🧊", n: "Iced Latte", d: "Espresso + cold milk over ice.", p: 120, tag: "", img: MC.icedLatte },
      { e: "☕", n: "Cappuccino", d: "Espresso, steamed milk + thick foam.", p: 110, tag: "", img: MC.cappuccino },
      { e: "☕", n: "Macchiato", d: "Espresso 'stained' with milk foam.", p: 115, tag: "", img: MC.macchiato },
      { e: "🍫", n: "Premium Hot Chocolate", d: "Rich, creamy chocolate. No coffee.", p: 95, tag: "", img: MC.hotChoco },
      { e: "🧊", n: "Mocha Frappe", d: "Blended iced coffee + chocolate.", p: 139, tag: "FAN FAVE", img: MC.mochaFrappe },
      { e: "🧊", n: "Caramel Frappe", d: "Blended iced coffee + caramel.", p: 139, tag: "", img: MC.caramelFrappe },
      { e: "🧊", n: "Double Choco Frappe", d: "Double chocolate blended ice.", p: 139, tag: "NEW", isNew: true, img: MC.chocoFrappe },
      { e: "🧊", n: "Iced Mocha", d: "Espresso + chocolate over ice.", p: 135, tag: "", img: MC.icedMocha },
      { e: "🍓", n: "Strawberry Smoothie", d: "Real strawberry blended creamy.", p: 115, tag: "", img: MC.smoothie },
      { e: "🍪", n: "Chocolate Chip Cookie", d: "Warm, chewy, perfect sa kape.", p: 45, tag: "", img: MC.cookie },
      { e: "🍰", n: "Oreo Cheesecake", d: "Creamy cheesecake + Oreo crust.", p: 125, tag: "", img: MC.oreoCake },
      { e: "🍰", n: "Blueberry Cheesecake", d: "Classic cheesecake + blueberry.", p: 125, tag: "", img: MC.blueberryCake },
      { e: "🍫", n: "Dark Chocolate Fudge Cake", d: "Rich fudge layers. Chocoholic approved!", p: 135, tag: "", img: MC.fudgeCake },
    ],
  },
];

// Flat list (back-compat) + hero/combo helpers
export const menuItems = categories.flatMap((c) => c.items);

export const photos = { bigMac: B.bigMac, burgerMcDo: B.burgerMcDo, fries: F.fries };

export const bigMacMeal = {
  e: "🍔",
  n: "Big Mac Meal (Medium)",
  d: "Dalawang beef patties, Big Mac sauce, fries + regular drink.",
  p: 219,
  img: B.bigMac,
};
