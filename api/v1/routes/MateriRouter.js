const express = require("express");
const router = express.Router();
const {addMateri, getMateri, getMateriById, editMateri, deleteMateri} = require("../controller/MateriController")
const authMiddleware = require("../../middleware/auth");
const checkRole = require("../../middleware/role");
const { upload } = require("../../middleware/multer/index");

router.post("/materi/add", authMiddleware, checkRole("teacher"), addMateri);     
router.get("/materi", authMiddleware, checkRole(["student", "teacher"]), getMateri);          
router.get("/materi/:id", authMiddleware, checkRole(["student", "teacher"]), getMateriById);          
router.get("/materi/:id", authMiddleware, checkRole(["student", "teacher"]), getMateriById);          
router.put("/materi/edit/:id", authMiddleware, checkRole("teacher"), editMateri);  
router.delete("/materi/delete/:id", authMiddleware, checkRole("teacher"), deleteMateri); 

router.post("/upload",  authMiddleware, checkRole(["teacher", "student"]), upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah!" });
        }
    
        res.json({
          message: "Gambar berhasil diunggah!",
          imageUrl: req.file.path, 
        });
      } catch (error) {
        res.status(500).json({ success: false, message: "Upload gagal!", error: error.message });
      }
  });

module.exports = router;
