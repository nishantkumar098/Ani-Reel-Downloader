const { igdl } = require("ab-downloader");

const downloadReel = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const results = await igdl(url);
    const media = Array.isArray(results) ? results[0] : results;

    if (!media?.url) {
      return res.status(422).json({
        success: false,
        message: "Could not extract video from this reel. Check the URL is public.",
      });
    }

    res.json({
      success: true,
      title: "Instagram Reel",
      thumbnail: media.thumbnail,
      videoUrl: media.url,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch reel. The post may be private or Instagram may be blocking the request.",
    });
  }
};

module.exports = {
  downloadReel,
};
