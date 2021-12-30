import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Product } from '../../features/products/entities/product.entity';

const products = [
  {
    name: 'Daytona Watermelons',
    img: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MXxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Daytona is an early maturing All Sweet type F1 hybrid watermelon, with excellent yield potential. Fruit are uniform, short oblong in shape, and weigh 10 – 12 kg. The medium-thick rind is tough, making it highly suitable for long-distance shipping. Rind colour is dark green with thin lighter green stripes. Daytona’s flesh is bright red, firm, crispy, juicy, and has an excellent taste and a high Brix level of about 11 – 12 %. Daytona tends to resist sunburn and has a high resistance to Anthracnose (Co).',
    baseUnit: '10 Kg',
  },
  {
    name: 'Shelled Walnuts',
    img: 'https://images.unsplash.com/flagged/photo-1579410137922-543ed48d263e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MnxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Walnuts are round, single-seeded stone fruits that grow from the walnut tree. They are a good source of healthful fats, protein, and fiber. They may enhance heart and bone health and help in weight management, among other benefits.',
    baseUnit: '100 g',
  },
  {
    name: 'Green Kiwis',
    img: 'https://images.unsplash.com/photo-1573066778058-03dbee2c5a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258M3xJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Kiwi is a fruit of ovoid shape, of variable size and covered with a brown fuzzy thin skin. It measures between 4 and 7.5cm long and 3.5 to 5cm wide and the weight oscillates between 30 and150g depending on the variety, the climatic conditions and the planting system. The flesh may be of different tonalities of green according to the variety, tender, juicy and bittersweet. It has multiple small black edible seeds. The colour of the pulp and its delicate taste resembles that of the grape, the strawberry and the pineapple, and this makes it a very pleasant fruit.',
    baseUnit: '500 g',
  },
  {
    name: 'Aroma Strawberries',
    img: 'https://images.unsplash.com/photo-1576561601677-ac33c580a70b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NHxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Aromas strawberry plants produce large, moderately firm, bright red strawberries that are delicious eaten fresh, frozen, or incorporated into jams, jellies or desserts.',
    baseUnit: '500 g',
  },
  {
    name: 'Nectarines',
    img: 'https://images.unsplash.com/photo-1576561923295-844b45d669f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NXxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The nectarine is a rounded fruit, with juicy meat and stone, similar to the peach. The skin is not hairy but smooth, as the plum’s skin, and it can be consumed peeled or unpeeled. The harvest of the nectarines in the N Hemisphere takes place in May, although they are found in the markets all the year round, since they are cultivated in many countries of the world.',
    baseUnit: '1 Kg',
  },
  {
    name: 'Asahi Miyako Watermelons',
    img: 'https://images.unsplash.com/photo-1581074817932-af423ba4566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NnxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'This Japanese melon is so great that we had to carry it. One California melon grower reports it is one of the sweetest and best melons he has grown. These seeds are hard to get and very expensive. This is a hybrid seed. 75-85 days depending on your climate. Melons run 5-8 pounds. About 20 seeds per pack. Approximately 6-20 seeds per gram.',
    baseUnit: '2 Kg',
  },
  {
    name: 'Onions Borettana',
    img: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258OHxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Onion Borettana. Light yellow very flat cipolla type onion. Not as dark a skin as Piatta of Bergamo. Good fresh or cooked. 2 inches in diameter. Long day type. An old, old variety originating in the 1400s, near the town of Boretto, not far from Parma, along the Po river. This is a great, flavorful onion! From transplants or direct seed. 2.5 gram packet. Long day type. Approximately 250-400 seeds per gram.',
    baseUnit: '500 g',
  },
  {
    name: 'Chilli Peppers',
    img: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258N3xJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Peperone Piccante Calabrese. Also know as Small Red Cherry or "Devil\'s Kiss". This is a small, round hot pepper, one to two inches in diameter. Bright red when ripe. Moderate heat. This is a classic Italian hot pepper used fresh or for pickling, or even dried. 1 gram packet, approximately 175 seeds. Approximately 150-200 seeds per gram.',
    baseUnit: '10 g',
  },
  {
    name: 'Hardneck Garlics',
    img: 'https://images.unsplash.com/photo-1587049693270-c7560da11218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258OXxJdlV2VDl4LTNFNHx8fHx8Mnx8MTYzNjY1MDA0Mw&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Hardneck garlic (Allium sativum ophioscorodon) are characterized by woody central stalks and a green curly stalk, also known as a scape. Hardneck garlic forms cloves through a process of vernalization, whereby the garlic is exposed to cold temperatures by staying in the ground over the course of the winter. There are usually between four and twelve cloves in each bulb.',
    baseUnit: '3 heads',
  },
  {
    name: 'Tomatoes',
    img: 'https://images.unsplash.com/photo-1587049668380-64cc7ede130b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Small indeterminate plants bear prolifically and must be staked or caged. Tomatoes set on clusters of 7-10 fruit each weighing about 2 oz. They hold extremely well on the vine. 72 days. Eat fresh in salad or dry for sun-dried tomatoes. They also make outstanding oven-roasted tomatoes; slice in half, drizzle with some olive oil, bake at 250°F until mostly done, sprinkle with fresh basil, oregano, etc. Eat as a contorno or freeze. 1.5 gram packet, approx. 375 seeds. Approximately 250-380 seeds per gram.',
    baseUnit: '500 g',
  },
  {
    name: 'White Radishes',
    img: 'https://images.unsplash.com/photo-1587131798251-0f02ebc5f473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Radish Flamboyant 3. Long (4 inch) deep red radish with white tip. Very pretty with excellent taste. Not spicy.',
    baseUnit: '500 g',
  },
  {
    name: 'Gherkins',
    img: 'https://images.unsplash.com/photo-1587313170527-446f86d0c3d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Besides being one of the most fun words to say, Gherkins are also one of the most fun pickles to eat. Sometimes called baby pickles, this variety is rarely more than a few inches long, sporting extra bumpy skin and a particular crunch due to their smaller size.',
    baseUnit: '200 g',
  },
  {
    name: 'Golden Kiwis',
    img: 'https://images.unsplash.com/photo-1587334106914-b90ecebe9845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The golden kiwi, also known as Actinidia chinensis. It is a cousin to the green kiwi. It has fewer hairs on the outside, giving it a smoother look. The exterior of the skin is a color that is golden brown. The flesh is a bright yellow color and fewer seeds.',
    baseUnit: '500 g',
  },
  {
    name: 'Cavendish Bananas',
    img: 'https://images.unsplash.com/photo-1587334206596-c0f9f7dccbe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Cavendish bananas are the most common variety. They are the long yellow, slightly sweet bananas at supermarkets around the U.S. They go from under-ripe green to perfectly ripe and still firm mellow yellow, to riper deep yellow with a brown spot or two, to super soft and browning.',
    baseUnit: '1 Kg',
  },
  {
    name: 'Red Potatoes',
    img: 'https://images.unsplash.com/photo-1587334274084-2def9f57bd27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Actually a sweet potato, not a true jam, this is the most commonly found market sweet potato. Great baked or roasted.',
    baseUnit: '2 Kg',
  },
  {
    name: 'Shelled Peas',
    img: 'https://images.unsplash.com/photo-1587411768345-867e228218c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Climbing pea grows 5-6 feet. Large pods with 7-10 peas per pod. Excellent taste and high production. Grow on trellis, fence, etc. 62-68 days',
    baseUnit: '500 g',
  },
  {
    name: 'Grape Tomatoes',
    img: 'https://images.unsplash.com/photo-1587411768515-eeac0647deed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Crisp and crunchy, grape tomatoes come in a variety of colors that range from sweet to tangy. Thanks to their thicker skin, grape tomatoes hold their meaty texture when cooked, making them a great addition to a main dinner dish—whether you’re roasting them in the oven, tossing them into your pasta, or adding a colorful side to your steak, chicken, or fish. Whether you prefer a red grape’s candy-like sweetness or the tangy kick of a yellow grape, these tomatoes are also great for snacking on raw—perfect for tomato lovers who just can’t get enough!',
    baseUnit: '500 g',
  },
  {
    name: 'Dill Pickles',
    img: 'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Dill pickles are the most popular pickles of the bunch and, as you might have guessed, they get their name because of their distinct dill flavor. Indeed, a generous amount of the herb is always included in the brine—be it dried, fresh or as seeds—and the result is a pickle that tastes like, well, dill. If that’s up your alley, you’ll have no trouble finding these guys, whole or pre-sliced, at the grocery store.',
    baseUnit: '200 g',
  },
  {
    name: 'Gooseberries',
    img: 'https://images.unsplash.com/photo-1587486913042-5d9362101999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MTl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Gooseberry is a white, yellow, red or green berry according to the species, with a thorny, hairy or even skin. The different varieties are distinguished from each other by the time of maturation, taste, colour, size, shape of the fruit and the way in which it is consumed. The most outstanding is the yellowish fruit with hairy skin, although there are also varieties of reddish, pale whitish green and dark green skin.',
    baseUnit: '500 g',
  },
  {
    name: 'Beets',
    img: 'https://images.unsplash.com/photo-1587486912758-4367d2015d6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The mild flavor and crunchy texture makes them ideal for slicing raw in salads, and they are delicious roasted or added to soups and stews. ',
    baseUnit: '500 g',
  },
  {
    name: 'Eggs',
    img: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Eggs can be cooked by boiling, poaching, frying, microwaving, or baking and they are one of the most common ingredients used for a variety of recipes.',
    baseUnit: '6 eggs',
  },
  {
    name: 'Wheat',
    img: 'https://images.unsplash.com/photo-1587486913117-e1feab360f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Versatile, with excellent milling and baking characteristics for wheat foods like hearth breads, hard rolls, croissants and flat breads.',
    baseUnit: '50 ears of grains',
  },
  {
    name: 'Mangos',
    img: 'https://images.unsplash.com/photo-1587486938113-d6d38d424efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The fruiting of the Haden mango in 1910 inspired the creation of a large-scale mango industry in South Florida. The industry has since then been greatly reduced by the impact of development and hurricanes.',
    baseUnit: '200 g',
  },
  {
    name: 'Ciliegino Tomatoes',
    img: 'https://images.unsplash.com/photo-1587486936739-78df7470c7e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Small and round like a cherry, it is one of the most representative tomato varieties of good eating. Grown in a hilly area, in particular climatic conditions, it gives sweetness and character to your sauces. Immersed in its juice, it can be used to prepare numerous dishes typical of quality Italian cuisine.',
    baseUnit: '500 g',
  },
  {
    name: 'Lemons',
    img: 'https://images.unsplash.com/photo-1587486937303-32eaa2134b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      "Lemons are among the world's most popular citrus fruits, whose leaves are alternate, reddish when young turning green, ovate to elliptic & fruit is llipsoid to ovoid, narrowed at both ends, with a nipple-like protuberance at the apex.",
    baseUnit: '1 Kg',
  },
  {
    name: 'Quail Eggs',
    img: 'https://images.unsplash.com/photo-1587492661070-6bc07c8c0fee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MjZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Small and round like a cherry, it is one of the most representative tomato varieties of good eating. Grown in a hilly area, in particular climatic conditions, it gives sweetness and character to your sauces. Immersed in its juice, it can be used to prepare numerous dishes typical of quality Italian cuisine. They taste remarkably like chicken eggs but are small — typically just one-third the size of a standard chicken egg. They have cream-colored shells with brown splotches and deep-yellow yolks.',
    baseUnit: '6 eggs',
  },
  {
    name: 'Clementine Tangerines',
    img: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mjd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Clementines are sweethearts, typically much more sugary – and less acidic –  than their tangerine brethren, and seedless to boot, making them an awesome snack even at non-halftime intervals.',
    baseUnit: '1 Kg',
  },
  {
    name: 'Green Peas Pods',
    img: 'https://images.unsplash.com/photo-1587735243475-46f39636076a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mjh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The wonderful green vegetables called the peas are one of the most versatile vegetables in the world. They can be stir-fried and eaten with a spoon, pureed and cooked in soup, steamed in rice, served in salads and garnished on entrees.',
    baseUnit: '500 g',
  },
  {
    name: 'Albion Strawberries',
    img: 'https://images.unsplash.com/photo-1615484478073-001e0ebfd406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mjl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Albion, an everbearing type, is a new variety from California with long, conical, symmetrical; firm fruit bursting with sweetness. Resists Verticillium wilt, Phytophthora crown rot and resistance to anthracnose crown rot.',
    baseUnit: '500 g',
  },
  {
    name: 'Peaches',
    img: 'https://images.unsplash.com/photo-1615484477915-040a4c70c0cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAwNDM&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      "Peaches come in two main flesh colors: yellow and white. Yellow peaches are most common, ranging in color from light yellow to orange yellow streaked with red. When you daydream about juicy, summer peaches, you're likely thinking of yellow peaches. These peaches have a sweet flesh that's balanced with a light acidity. As with all peaches, look for ones that are heavy for their size, but give a little with pressure. And don't forget the sniff test! Ripe peaches will smell peachy.",
    baseUnit: '1 Kg',
  },
  {
    name: 'Graffiti Eggplants',
    img: 'https://images.unsplash.com/photo-1615484477201-9f4953340fab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Graffiti eggplant, sometimes called Sicilian eggplant, get its name from its purple and white stripes. Unfortunately, the stripes do disappear when the eggplant is cooked. This variety is completely multi-purpose — it can be used in any recipe regular eggplant is called for.',
    baseUnit: '500 g',
  },
  {
    name: 'Raspberries',
    img: 'https://images.unsplash.com/photo-1615484476889-2830f980a5e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Known for its excellent flavor, this variety has bright red fruit with a sweet flavor, and it does well throughout most parts of the US. Cold hardy and known for its disease resistance, this summer-bearing cultivar will produce one harvest in early July. Canes will grow to be 3-4 feet tall at maturity, with an equal spread, and foliage turns orange and red in the fall.',
    baseUnit: '100 g',
  },
  {
    name: 'Red Currants',
    img: 'https://images.unsplash.com/photo-1615484477863-ba177590e3e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The redcurrants are small rounded fruits of red colour. They may be eaten raw, although their bittersweet taste makes them more suitable for processing jam, milkshakes, ice creams, etc. They are rich in vitamins and minerals.',
    baseUnit: '1 Kg',
  },
  {
    name: 'Calabrese Broccoli',
    img: 'https://images.unsplash.com/photo-1615485291234-9d694218aeb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Calabrese broccoli forms a large central head with tight florets, aka tiny flowers. These thick, flowering stems give typical broccoli its signature look; they look like tiny trees! If you’re interested in growing this well-known variety, it grows well in zones 3-10 and is particularly cold hardy. Most Calabrese varieties continue to produce mini-tree side shoots once you have harvested the central head, so look forward to a long harvest window.',
    baseUnit: '500 g',
  },
  {
    name: 'Pumpkins',
    img: 'https://images.unsplash.com/photo-1615485020845-601a6d2971a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'This pumpkin has a pretty orange-and-green-striped rind that makes an eye-catching autumn display.',
    baseUnit: '2 Kg',
  },
  {
    name: 'Broccolini',
    img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258MzZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Though it’s sometimes confused for baby broccoli, it is actually a cross between broccoli (B. oleracea var. italica) and gai-lan (B. oleracea var. alboglabra) that makes for a sweet, thin-stemmed, dark leafy green with small florets.',
    baseUnit: '500 g',
  },
  {
    name: 'White Melon',
    img: 'https://images.unsplash.com/photo-1615485290885-c7273a06c79e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mzd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Winter melons are large fruits, averaging 15 to 80 centimeters in length, and have a bulbous, round to oblong shape with blunt, curved ends. The melons are covered in a thin but tough, light to dark green skin, often enveloped in a textured, chalky layer of wax, depending on the variety. Young Winter melons also bear a pale, fuzzy coating of hair that disappears as the fruit matures. Underneath the hard surface, the flesh is thick, firm, aqueous, and white, encasing a large central cavity filled with pithy membranes and cream-colored oval seeds. The seeds are edible once cooked and have a nutty, neutral taste. Winter melons are not typically consumed raw and contain a mild, vegetal, and subtly grassy flavor reminiscent of a watermelon rind or cucumber. When cooked, the flesh becomes transparent and softens, absorbing accompanying flavors.',
    baseUnit: '2 Kg',
  },
  {
    name: 'Corns',
    img: 'https://images.unsplash.com/photo-1615485290161-7eb49a34eba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mzh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The corn plant is a tall annual grass with a stout, erect, solid stem. The large narrow leaves have wavy margins and are spaced alternately on opposite sides of the stem. Staminate (male) flowers are borne on the tassel terminating the main axis of the stem. The pistillate (female) inflorescences, which mature to become the edible ears, are spikes with a thickened axis, bearing paired spikelets in longitudinal rows; each row of paired spikelets normally produces two rows of grain. Varieties of yellow and white corn are the most popular as food, though there are varieties with red, blue, pink, and black kernels, often banded, spotted, or striped. Each ear is enclosed by modified leaves called shucks or husks.',
    baseUnit: '500 g ',
  },
  {
    name: 'Green Squashes',
    img: 'https://images.unsplash.com/photo-1615485499978-1279c3d6302f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258Mzl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Squash is grown mostly in late spring and early summer, and depending on the variety; they take between 50 and 100 days to mature. While there is summer squash and winter squash, both are warm-weather plants, and many types of them are available year long.',
    baseUnit: '500 g',
  },
  {
    name: 'Fayot Beans',
    img: 'https://images.unsplash.com/photo-1615485500710-aa71300612aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Fayot also known and flageolet beans are small, tender, creamy, and mild in flavor. They have a pale green to ivory white color. They are commonly used in French cuisine for salads, soups, and other flavorful side dishes.',
    baseUnit: '500 g',
  },
  {
    name: 'Shelled Almonds',
    img: 'https://images.unsplash.com/photo-1615485737651-580c9159c89a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDF8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The most striking feature of these types of almonds is the papery outer shell which is light brown in colour. Protected within this cover, the almond variety remains flavoursome and aromatic.',
    baseUnit: '100 g',
  },
  {
    name: 'Walnuts',
    img: 'https://images.unsplash.com/photo-1615485737643-406ce5bac81f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDJ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Walnuts can be used a variety of ways in the kitchen—the whole fruit (inside the walnut husk) can be pickled. Shelled walnuts can be eaten raw, toasted, or even candied. They’re storable too; when kept in an airtight container, walnuts have a shelf life of up to a year in the refrigerator.',
    baseUnit: '100 g',
  },
  {
    name: 'Cashews',
    img: 'https://images.unsplash.com/photo-1615485925873-7ecbbe90a866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDN8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The cashew kernels are highly nutritive. They are rich source of carbohydrates, proteins, unsaturated fats, minerals like calcium, phosphorus,. iron and vitamins.',
    baseUnit: '500 g',
  },
  {
    name: 'Red Pomegranates',
    img: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDR8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'If you are looking for the most known type of pomegranates in the market, angel red variety will stand out. Its vivid red fruit ripens in late summer to fall and they protrude a less pulp and higher pomegranate juice contents than others. The pomegranate seeds of these varieties are soft enough to be eaten raw and fresh. ',
    baseUnit: '1 Kg',
  },
  {
    name: 'Pears',
    img: 'https://images.unsplash.com/photo-1615485925694-a03ef8fd9e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDV8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'This pears are recognizable for their egg-shaped appearance, having a larger spherical lower portion that begins a gradual taper above the mid-point to a narrower rounded top. Their skin color is bright green, and sometimes has a soft red blush. Skin color shows only very subtle color change while ripening.',
    baseUnit: '1 Kg',
  },
  {
    name: 'Pistachios',
    img: 'https://images.unsplash.com/photo-1615485925933-379c8b6ad03c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDZ8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'These are usually going to be small in size, and sometimes they will be broken apart as well. These types of pistachios are great for cooking, and you can season them to your liking and then roast or bake them.',
    baseUnit: '100 g',
  },
  {
    name: 'Velvet Pomegranates',
    img: 'https://images.unsplash.com/photo-1615485925807-d11c291f531c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDd8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'The sharp velvet varieties produce a fruit with a dark red skin and crushed red velvet seeds or arils. The fruit size is large and often provides a nice, slightly acidic taste. The plants of these pomegranates varieties grow upright that produces the ornamental fruits that can be kept during summer pruning at any height.',
    baseUnit: '500 g',
  },
  {
    name: 'White Grapes',
    img: 'https://images.unsplash.com/photo-1615485925763-86786288908a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDh8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'These grapes make an excellent snack choice. Due to their large size, they can be stuffed with fillings like whipped cheese or roasted and tossed into a leafy salad to add natural sweetness.',
    baseUnit: '500 g',
  },
  {
    name: 'Beefsteak Tomatoes',
    img: 'https://images.unsplash.com/photo-1615486171815-2611a6e3cd02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NDl8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      '7-9 ounce beefsteak type shaped like a heart. Meaty, deep pink/red flesh and few seeds. Real tomato taste. The tomato all our Italian grandfathers grew. For fresh eating or sauce. Indeterminate. 70+ days. Very large vigorous growing plant; these are quite productive and relatively early.',
    baseUnit: '500 g',
  },
  {
    name: 'Red Radishes',
    img: 'https://images.unsplash.com/photo-1615486171756-90eed2c26961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzQ4OTV8MHwxfGNvbGxlY3Rpb258NTB8SXZVdlQ5eC0zRTR8fHx8fDJ8fDE2MzY2NTAyNTU&ixlib=rb-1.2.1&q=80&w=1080',
    description:
      'Small round salad radish with a red neck and white base. Slow to go woody.',
    baseUnit: '500 g',
  },
];

let i = 0;

define(Product, (faker: typeof Faker) => {
  const product = new Product();
  product.public = i < 45;
  product.name = products[i % products.length].name;
  product.description = products[i % products.length].description;
  product.price = +faker.commerce.price(1, 50);
  product.available = faker.random.number(10);
  product.image = products[i % products.length].img;
  product.baseUnit = products[i++ % products.length].baseUnit;
  return product;
});
