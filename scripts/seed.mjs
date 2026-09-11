import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add your MongoDB connection string before running the seed script.");
}

const postSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    body: String,
    excerpt: String,
    coverImageUrl: String,
    tags: [String],
    status: { type: String, enum: ["draft", "published"], default: "published" },
    viewCount: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true },
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

const seedPosts = [
  {
    title: "City hall unveils the new transit plan",
    slug: "city-hall-unveils-the-new-transit-plan",
    excerpt: "Commuters will get more frequent service and shared corridors as officials move ahead with a phased transit redesign.",
    body: "# City hall unveils the new transit plan\n\nThe public works department says the updated plan will cut travel times and improve reliability across key corridors.\n\n- More frequent service\n- Better regional links\n- Cleaner station access\n\nOfficials expect the first phase to roll out before the next budget cycle.",
    coverImageUrl: "/images/placeholder.jpg",
    tags: ["city", "transport", "policy"],
    status: "published",
    publishedAt: new Date(),
  },
  {
    title: "A quiet cultural revival is reshaping the waterfront",
    slug: "quiet-cultural-revival-waterfront",
    excerpt: "Former warehouses are becoming galleries, studios, and social spaces as the neighborhood recalibrates around makers and culture.",
    body: "# A quiet cultural revival is reshaping the waterfront\n\nLocal landlords, artists, and residents say the area is changing from a forgotten strip into an intentional creative district.\n\nThe latest wave of openings includes a newspaper archive, a ceramics studio, and a neighborhood cafe with live music after dark.",
    coverImageUrl: "/images/placeholder.jpg",
    tags: ["culture", "city"],
    status: "published",
    publishedAt: new Date(Date.now() - 86400000),
  },
  {
    title: "Staffing shortages stretch emergency teams across the region",
    slug: "staffing-shortages-stretch-emergency-teams",
    excerpt: "A persistent shortage of nurses and dispatch staff is driving longer wait times and delayed response times in several districts.",
    body: "# Staffing shortages stretch emergency teams across the region\n\nState officials say chronic vacancies are now affecting turnaround times at some high-volume facilities.\n\nThe issue is most visible in rural clinics and dispatch centers, where staff retention remains a challenge.",
    coverImageUrl: "/images/placeholder.jpg",
    tags: ["health", "public-service"],
    status: "published",
    publishedAt: new Date(Date.now() - 172800000),
  },
];

async function main() {
  await mongoose.connect(uri);
  await Post.deleteMany({});
  await Post.insertMany(seedPosts);
  console.log("Seeded demo posts.");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
