const ytDlp = require("yt-dlp-exec");

const downloadReel = async (req, res) => {

    try {

        const { url } = req.body;

        console.log(url);

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const info = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true,
        });

        console.log(info);

        res.json({
            success: true,
            title: info.title,
            thumbnail: info.thumbnails?.[0]?.url,
            videoUrl: info.formats.find(
                (format) => format.vcodec !== "none"
            )?.url,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch reel",
        });
    }
};

module.exports = {
    downloadReel,
};