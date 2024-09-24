import express from "express";
import cors from "cors"; // Import cors middleware
import bookRoutes from "./routes/BookRoutes";
import memberRoutes from "./routes/MemberRoutes";
import borrowRoutes from "./routes/BorrowRoutes";
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/borrow", borrowRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
