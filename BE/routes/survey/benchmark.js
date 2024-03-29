const express = require("express");
const { pool } = require("../../utils/mysql");
const { logger } = require("../../utils/winston");
const { verifyToken } = require("../../utils/jwt");
const router = express.Router();

// benchmark write.
router.post("/benchmark/:survey_id", async (req, res) => {
  const survey_id = req.params.survey_id;
  const { benchmark, output_text } = req.body;

  try {
    const sql = `INSERT INTO benchmark ( survey_id, benchmark, output_text ) VALUES(?, ?, ?);`;
    const data = await pool.query(sql, [survey_id, benchmark, output_text]);
    logger.info("[INFO] POST /benchmark/write");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("POST /insert Error" + error);
    return res.json(error);
  }
});

// benchmark update.
router.put("/benchmark/:id", async (req, res) => {
  const id = req.params.id;
  const { survey_id, benchmark } = req.body;
  try {
    const sql = `UPDATE benchmark SET benchmark=?, output_text=? WHERE id = ?;`;
    const data = await pool.query(sql, [survey_id, benchmark, id]);
    logger.info("[INFO] PUT /benchmark/update");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("POST /update Error" + error);
    return res.json(error);
  }
});

// benchmark delete
router.delete("/benchmark/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const sql = `DELETE FROM benchmark WHERE id=?;`;
    const data = await pool.query(sql, [id]);
    logger.info("[INFO] DELETE /benchmark/delete");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("GET /delete Error" + error);
    return res.json(error);
  }
});

// benchmark Detail
router.get("/benchmark/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `SELECT * FROM benchmark WHERE ID = ?;`;
    const data = await pool.query(sql, [id]);
    const result = data[0];
    logger.info("[INFO] GET /benchmark/detail");
    return res.json(result);
  } catch (error) {
    logger.error("GET /select Error" + error);
    return res.json(error);
  }
});

// benchmark list
router.get("/benchmark/list/:survey_id", async (req, res) => {
  try {
    const survey_id = req.params.survey_id;
    const survey_sql = "SELECT * FROM hospital_survey WHERE ID = ?;";
    const survey_data = await pool.query(survey_sql, [survey_id]);

    // 없는 데이터 접근시
    if (survey_data[0][0] == null) {
      logger.info("[INFO] GET /benchmark/list/:survey_id");
      return res.json({});
    }

    const output_link_sql =
      "SELECT id, title, output_link, reservation_link FROM hospital_survey WHERE id=?";
    const output_link_data = await pool.query(output_link_sql, [survey_id]);
    const benchmark_sql = `SELECT * FROM benchmark WHERE survey_id=?;`;
    const benchmark_data = await pool.query(benchmark_sql, [survey_id]);
    // const result = data[0].slice((page - 1) * 10, page * 10);
    let result = output_link_data[0][0];

    const now = new Date();
    if (now < survey_data[0][0].start_at) result.status = 1;
    else result.status = now < survey_data[0][0].end_at ? 0 : 2;

    result.benchmark = benchmark_data[0];
    logger.info("[INFO] GET /benchmark/list");
    return res.json(result);
  } catch (error) {
    logger.error("GET /select Error" + error);
    return res.json(error);
  }
});

module.exports = router;
