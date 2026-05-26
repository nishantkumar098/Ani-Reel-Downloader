const express = require("express");
const cors = require("cors");

const reelRoutes = require("./routes/reelRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reels", reelRoutes);

const PORT = process.env.PORT || 5000;

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});