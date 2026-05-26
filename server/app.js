const express = require("express");
const cors = require("cors");

const reelRoutes = require("./routes/reelRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reels", reelRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});