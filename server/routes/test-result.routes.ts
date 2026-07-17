import { Router } from "express";
import { testResultService } from "../services/test-result.service";

const router = Router();

// Get test result by code
router.get("/:code", (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const result = testResultService.findByCode(code);
  
  if (!result) {
    return res.status(404).json({ 
      error: "Không tìm thấy kết quả xét nghiệm cho mã này. Thử mã 'KQ-123456' hoặc 'KQ-888888'." 
    });
  }
  
  res.json(result);
});

export default router;