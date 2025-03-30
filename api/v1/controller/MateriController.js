const Materi = require("../models/Materi");

const addMateri = async (req, res) => {
  try {
    const { title, field, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    const newMateri = new Materi({
      title,
      field: field || "Matematika",
      content,
      createdBy: req.user.id,
    });
    await newMateri.save();

    res
      .status(201)
      .json({ message: "Materi berhasil ditambahkan", materi: newMateri });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

const getMateri = async (req, res) => {
  try {
    const { role, id } = req.user;
    const { title, field } = req.query; 
    let query = {};

    if (role === "teacher") {
      query.createdBy = id;
    }

    if (title) {
      query.title = { $regex: title, $options: "i" }; 
    }
    
    if (field) {
      query.field = { $regex: field, $options: "i" }; 
    }

    const materiList = await Materi.find(query)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(materiList);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};


const getMateriById = async (req, res) => {
  try {
    const { id } = req.params;
    const materiList = await Materi.findOne({ _id: id }).populate(
      "createdBy",
      "username email"
    );
    res.status(200).json(materiList);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

const editMateri = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, field, content } = req.body;

    const updatedMateri = await Materi.findByIdAndUpdate(
      id,
      { title, field, content },
      { new: true }
    );

    if (!updatedMateri) {
      return res.status(404).json({ message: "Materi tidak ditemukan" });
    }

    res
      .status(200)
      .json({ message: "Materi berhasil diperbarui", materi: updatedMateri });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

const deleteMateri = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMateri = await Materi.findByIdAndDelete(id);
    if (!deletedMateri) {
      return res.status(404).json({ message: "Materi tidak ditemukan" });
    }

    res.status(200).json({ message: "Materi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};

module.exports = {
  addMateri,
  getMateri,
  getMateriById,
  editMateri,
  deleteMateri,
};
