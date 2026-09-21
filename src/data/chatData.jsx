const chatData = [
  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "hii",
      "hiii",
      "good morning",
      "good afternoon",
      "good evening",
      "how are you",
      "how are you doing",
      "what's up",
      "whats up",
    ],
    message: "Hello! 👋 Welcome to our store. How can I help you today?",
  },

  {
    keywords: [
      "help",
      "help me",
      "can you help",
      "i need help",
      "what can you do",
      "how can you help",
    ],
    message:
      "Of course! 😊 I can help you with products, prices, ingredients, orders, delivery, shipping, payments, and other questions about our store.",
  },

  {
    keywords: [
      "product",
      "products",
      "smoothie",
      "smoothies",
      "what do you sell",
      "what do you have",
      "available products",
      "available smoothies",
      "menu",
      "items",
      "what can i buy",
    ],
    message:
      "We offer a variety of fresh and delicious smoothies. Visit our Shop section to explore all available products.",
  },

  {
    keywords: [
      "shop",
      "store",
      "browse",
      "catalog",
      "see products",
      "view products",
      "show products",
      "shop products",
    ],
    message:
      "You can explore all our available smoothies in the Shop section of the website.",
  },

  {
    keywords: [
      "price",
      "prices",
      "cost",
      "costs",
      "how much",
      "how much is",
      "how much are",
      "expensive",
      "cheap",
      "pricing",
    ],
    message:
      "Our smoothie prices vary depending on the product. You can check the price of each smoothie on its product page.",
  },

  {
    keywords: [
      "ingredients",
      "ingredient",
      "what is in",
      "whats in",
      "what's in",
      "made of",
      "made from",
      "contains",
      "contain",
      "composition",
    ],
    message:
      "Each smoothie has different ingredients. Open a product to see its detailed description and ingredients.",
  },

  {
    keywords: [
      "healthy",
      "health",
      "healthy smoothie",
      "nutritious",
      "nutrition",
      "nutritional",
      "good for health",
      "health benefits",
      "benefits",
      "good for me",
      "is it healthy",
    ],
    message:
      "Many of our smoothies contain fruits and other nutritious ingredients. Check each product's description to learn more about its nutritional benefits.",
  },

  {
    keywords: [
      "vegan",
      "vegan smoothie",
      "plant based",
      "plant-based",
      "vegetarian",
      "dairy free",
      "dairy-free",
      "without milk",
    ],
    message:
      "Some smoothies may be suitable for a plant-based or dairy-free diet. Please check the ingredients of each product before ordering.",
  },

  {
    keywords: [
      "order",
      "orders",
      "place order",
      "place an order",
      "buy",
      "purchase",
      "how to order",
      "how do i order",
      "want to order",
      "ordering",
    ],
    message:
      "You can place an order by selecting a smoothie, choosing your preferred options, and adding it to your cart. Then proceed to checkout.",
  },

  {
    keywords: [
      "cart",
      "shopping cart",
      "my cart",
      "view cart",
      "cart items",
      "items in cart",
      "add to cart",
      "remove from cart",
    ],
    message:
      "You can view your selected products and manage your order from the shopping cart.",
  },

  {
    keywords: [
      "checkout",
      "check out",
      "place checkout",
      "complete order",
      "complete purchase",
      "finish order",
    ],
    message:
      "When you're ready to order, open your cart and proceed to checkout to complete your purchase.",
  },

  {
    keywords: [
      "payment",
      "payments",
      "pay",
      "how can i pay",
      "payment method",
      "payment methods",
      "pay for order",
      "pay online",
      "cash",
      "card",
      "credit card",
      "debit card",
    ],
    message:
      "You can choose from the available payment methods during checkout.",
  },

  {
    keywords: [
      "shipping",
      "ship",
      "ships",
      "shipping cost",
      "shipping fee",
      "shipping charges",
      "free shipping",
      "do you ship",
      "do you deliver",
      "delivery",
      "deliver",
      "delivered",
      "delivery time",
      "delivery date",
    ],
    message:
      "We offer fast and reliable shipping. Delivery availability and shipping details are shown during checkout.",
  },

  {
    keywords: [
      "how long delivery",
      "how long does delivery take",
      "when will my order arrive",
      "when will i get my order",
      "delivery time",
      "arrival time",
      "estimated delivery",
      "delivery date",
    ],
    message:
      "Delivery time may vary depending on your location. You can see the available delivery information during checkout.",
  },

  {
    keywords: [
      "track order",
      "tracking",
      "track my order",
      "where is my order",
      "order status",
      "order tracking",
      "check my order",
    ],
    message:
      "You can check your order status using the order information provided after placing your order.",
  },

  {
    keywords: [
      "cancel",
      "cancel order",
      "cancel my order",
      "want to cancel",
      "cancellation",
      "cancel purchase",
    ],
    message:
      "If you need to cancel an order, please contact our support team as soon as possible.",
  },

  {
    keywords: [
      "return",
      "returns",
      "return product",
      "return order",
      "refund",
      "refunds",
      "get refund",
      "money back",
      "exchange",
      "replace",
      "replacement",
    ],
    message:
      "If you have an issue with your order, please contact our support team so we can help with returns, replacements, or refunds.",
  },

  {
    keywords: [
      "contact",
      "contact you",
      "contact support",
      "customer support",
      "support",
      "customer service",
      "talk to someone",
      "speak to someone",
      "help desk",
    ],
    message:
      "You can contact our support team through the Contact section of our website. We're happy to help!",
  },

  {
    keywords: [
      "about",
      "about you",
      "about us",
      "who are you",
      "who is this",
      "your store",
      "your company",
      "tell me about your store",
    ],
    message:
      "We offer fresh and delicious smoothies made with carefully selected ingredients. Our goal is to provide tasty and refreshing drinks for everyone.",
  },

  {
    keywords: [
      "best smoothie",
      "best product",
      "recommend",
      "recommendation",
      "recommend something",
      "what do you recommend",
      "what should i get",
      "which smoothie should i get",
      "suggest",
      "suggestion",
    ],
    message:
      "It depends on your taste! 🍓 For berries, try our Berry Blast. For something tropical, try Mango Magic or Pineapple Paradise. For a chocolate flavor, try our Chocolate Banana Smoothie.",
  },

  {
    keywords: [
      "berry",
      "berries",
      "berry smoothie",
      "strawberry",
      "strawberries",
    ],
    message:
      "If you love berry flavors, try our Berry Blast Smoothie or Strawberry Dream Smoothie. Both offer a delicious fruity and creamy experience.",
  },

  {
    keywords: ["mango", "mango smoothie", "tropical", "tropical smoothie"],
    message:
      "If you enjoy tropical flavors, our Mango Magic Smoothie and Tropical Sunrise Smoothie are great options.",
  },

  {
    keywords: [
      "banana",
      "banana smoothie",
      "chocolate",
      "chocolate smoothie",
      "chocolate banana",
    ],
    message:
      "For a creamy banana flavor, try our Banana Boost Smoothie. If you love chocolate, our Chocolate Banana Smoothie is a rich and delicious option.",
  },

  {
    keywords: [
      "green smoothie",
      "green",
      "spinach",
      "spinach smoothie",
      "vegetable smoothie",
      "green energy",
    ],
    message:
      "Our Green Energy Smoothie combines spinach, apple, banana, and lime for a fresh and fruity green smoothie.",
  },

  {
    keywords: [
      "thank you",
      "thanks",
      "thank",
      "thx",
      "ty",
      "appreciate it",
      "that's helpful",
      "thats helpful",
    ],
    message: "You're very welcome! 😊 I'm happy to help.",
  },

  {
    keywords: [
      "bye",
      "goodbye",
      "see you",
      "see ya",
      "talk later",
      "gotta go",
      "i have to go",
    ],
    message: "Goodbye! 👋 Thanks for visiting our store. Have a great day!",
  },
];

export default chatData;
