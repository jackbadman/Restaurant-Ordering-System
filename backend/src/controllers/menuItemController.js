// CRUD handlers for menu items.
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

export const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    return res.json({ message: "Menu item deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
