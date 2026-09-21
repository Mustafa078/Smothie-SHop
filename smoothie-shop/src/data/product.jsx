import berry from "../assets/berry.jpg";
import mango from "../assets/mango.png";
import strawberry from "../assets/strawberry.jpg";
import tropical from "../assets/tropical.png";
import banana from "../assets/banana.png";
import pineapple from "../assets/pineapple.png";
import peach from "../assets/peach.png";
import green from "../assets/green.png";
import chocolate from "../assets/chocolate.png";
import apple from "../assets/apple.png";

const productData = () => {
  const product = [
    {
      id: "1",
      title: "Berry Blast Smoothie",
      price: 5.99,
      thumbnail: berry,
      shortDescription: "Creamy. Naturally sweet. Perfectly balanced.",
      description:
        "A delicious and creamy blend of fresh mixed berries, smooth yogurt, and a touch of honey. It has a naturally sweet and slightly tangy berry flavor with a rich, refreshing texture. Packed with antioxidants, vitamin C, and nutrients from berries and yogurt, it is a great choice for people looking for a refreshing breakfast, post-workout drink, or a naturally nutritious snack. Best suited for fruit lovers, active people, and anyone who enjoys a balanced sweet-and-tangy smoothie.",
    },

    {
      id: "2",
      title: "Mango Magic Smoothie",
      price: 6.49,
      thumbnail: mango,
      shortDescription: "Tropical. Creamy. Naturally delicious.",
      description:
        "A rich and creamy tropical smoothie made with ripe mangoes, fresh milk, and a touch of natural sweetness. It has a smooth texture and a sweet, juicy mango flavor that makes every sip refreshing and satisfying. Mango provides vitamin C and other nutrients, while milk adds protein and calcium. A great choice for people who enjoy tropical flavors, families, students, and anyone looking for a filling breakfast or afternoon smoothie.",
    },

    {
      id: "3",
      title: "Tropical Sunrise Smoothie",
      price: 5.49,
      thumbnail: tropical,
      shortDescription: "Bright. Fruity. Refreshingly tropical.",
      description:
        "A bright and refreshing tropical blend of juicy pineapple, sweet orange, and ripe mango. The combination creates a naturally sweet, slightly tangy flavor with a light and refreshing texture. Pineapple and orange provide vitamin C and other nutrients, while mango adds natural sweetness and flavor. Perfect for people who enjoy fruity drinks, warm-weather refreshment, or a light morning or afternoon smoothie.",
    },

    {
      id: "4",
      title: "Strawberry Dream Smoothie",
      price: 6.99,
      thumbnail: strawberry,
      shortDescription: "Sweet. Creamy. Smooth and refreshing.",
      description:
        "A sweet, creamy smoothie made with fresh strawberries, ripe banana, and smooth yogurt. It combines the slightly tangy taste of strawberries with the naturally sweet and creamy flavor of banana. Strawberries provide vitamin C and antioxidants, while banana provides carbohydrates and potassium, and yogurt adds protein and calcium. A great option for students, families, fruit lovers, and anyone looking for a satisfying breakfast or snack.",
    },

    {
      id: "5",
      title: "Banana Boost Smoothie",
      price: 4.99,
      thumbnail: banana,
      shortDescription: "Smooth. Filling. Naturally energizing.",
      description:
        "A smooth and creamy banana smoothie made with ripe bananas, fresh milk, and a touch of honey. It has a naturally sweet, rich banana flavor with a soft and satisfying texture. Bananas provide carbohydrates and potassium, while milk adds protein and calcium, making this a filling option for a quick breakfast or snack. Especially suitable for active people, students, busy mornings, and anyone who enjoys simple and naturally sweet flavors.",
    },

    {
      id: "6",
      title: "Pineapple Paradise Smoothie",
      price: 6.29,
      thumbnail: pineapple,
      shortDescription: "Fresh. Tropical. Cool and refreshing.",
      description:
        "A refreshing tropical smoothie combining juicy pineapple with creamy coconut milk and delicious tropical flavors. It has a bright, sweet-and-tangy pineapple taste balanced by the smooth richness of coconut milk. Pineapple provides vitamin C and other nutrients, while the tropical ingredients create a refreshing and satisfying drink. A great choice for people who enjoy tropical flavors, summer refreshments, and light fruit-based smoothies.",
    },

    {
      id: "7",
      title: "Peachy Delight Smoothie",
      price: 5.79,
      thumbnail: peach,
      shortDescription: "Juicy. Creamy. Naturally sweet.",
      description:
        "A smooth and creamy peach smoothie made with juicy peaches, yogurt, and a touch of honey. It has a delicate fruity sweetness with a refreshing peach aroma and creamy texture. Peaches provide vitamins and antioxidants, while yogurt contributes protein and calcium. A lovely choice for fruit lovers, families, students, or anyone looking for a light and refreshing breakfast or afternoon snack.",
    },

    {
      id: "8",
      title: "Green Energy Smoothie",
      price: 7.49,
      thumbnail: green,
      shortDescription: "Fresh. Green. Full of natural goodness.",
      description:
        "A fresh green smoothie made with spinach, crisp apple, ripe banana, and a splash of lime. The apple and banana provide natural sweetness while lime adds a refreshing citrus kick, creating a balanced fruity flavor without being overly sweet. Spinach provides vitamins and minerals, while the fruits add fiber and other nutrients. A great option for people who enjoy fresh ingredients, fruit-and-vegetable combinations, or want a nutrient-rich breakfast or daytime snack.",
    },

    {
      id: "9",
      title: "Chocolate Banana Smoothie",
      price: 6.59,
      thumbnail: chocolate,
      shortDescription: "Rich. Creamy. Chocolatey perfection.",
      description:
        "A rich and creamy combination of ripe banana, smooth chocolate, and fresh milk, creating a delicious dessert-like smoothie. The banana adds natural sweetness and a creamy texture while chocolate provides a deep, indulgent flavor. Banana provides potassium and carbohydrates, while milk adds protein and calcium. Perfect for chocolate lovers, students, active people, or anyone looking for a satisfying sweet treat that can also work as a breakfast or snack.",
    },

    {
      id: "10",
      title: "Apple Fresh Smoothie",
      price: 5.29,
      thumbnail: apple,
      shortDescription: "Crisp. Fresh. Lightly spiced.",
      description:
        "A crisp and refreshing smoothie made with fresh apples, creamy yogurt, and a hint of cinnamon. It has a naturally sweet apple flavor with a subtle warm cinnamon finish and a smooth, creamy texture. Apples provide fiber and vitamin C, while yogurt adds protein and calcium. A great choice for people who enjoy fresh fruit flavors, lighter smoothies, and a refreshing breakfast or afternoon snack.",
    },
  ];

  return product;
};

export default productData;
