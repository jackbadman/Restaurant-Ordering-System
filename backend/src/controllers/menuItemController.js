import MenuItem from "../models/MenuItem.js";

export const createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().populate("categoryId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMenuItemsByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({ categoryId: req.params.categoryId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};