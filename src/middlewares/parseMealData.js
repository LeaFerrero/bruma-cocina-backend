export const parseMealData = (req, res, next) => {
  if (req.body.mealData) {
    try {
      const parsed = JSON.parse(req.body.mealData);

      req.body.name = parsed.name;
      req.body.price = parsed.price;
      req.body.description = parsed.description;
      req.body.category = parsed.category;

      if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
        req.body.ingredients = parsed.ingredients.map((item) => ({
          supply: item._id,
          quantity: item.quantity,
        }));
      } else {
        req.body.ingredients = [];
      }
    } catch (error) {
      return res
        .status(400)
        .json({ error: "El formato de mealData es inválido" });
    }
  }
  next();
};
