const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");

require("dotenv").config();

// Configure AWS S3 Client (v3)
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure Multer for Memory Storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload File Controller
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileKey = `uploads/${Date.now()}-${req.file.originalname}`;

        // Upload file to S3 (without public access)
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        // Generate a pre-signed URL valid for 1 hour (3600 seconds)
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
        };
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });

        res.status(200).json({
            message: "File uploaded successfully",
            fileUrl: signedUrl, // Return temporary access link
        });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        res.status(500).json({ error: "File upload failed" });
    }
};

// Middleware to handle file upload
exports.uploadMiddleware = upload.single("file");
