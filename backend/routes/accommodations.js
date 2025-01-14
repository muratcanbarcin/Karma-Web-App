const express = require("express");
const router = express.Router();
const pool = require("../database/connection");
const jwt = require('jsonwebtoken'); // Eksik olan import
const SECRET_KEY = "your_secret_key";


router.get("/myAccommodations", async (req, res) => {
  try {
    // Token kontrolü
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Token çözümleme
    const decoded = jwt.verify(token, SECRET_KEY);
    const userID = decoded.userID;
    

    if (!userID) {
      return res.status(400).json({ error: "UserID not found in token." });
    }

    // Veritabanı sorgusu
    const query = `
      SELECT AccommodationID, Title, Description, Location, DailyPointCost
      FROM Accommodations
      WHERE UserID = ?
    `;
    const [rows] = await pool.query(query, [userID]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No accommodations found for this user." });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error in /myAccommodations endpoint:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/search", async (req, res) => {
  const { location, pointsRange } = req.body;

  try {
    const query = `
      SELECT AccommodationID, Location, DailyPointCost, Description
      FROM Accommodations
      WHERE Location LIKE ?
      AND DailyPointCost BETWEEN ? AND ?
    `;
    const [results] = await pool.query(query, [
      `%${location || ""}%`,
      pointsRange ? pointsRange[0] : 0,
      pointsRange ? pointsRange[1] : 1000000,
    ]);

    const accommodations = results.map((row) => ({
      ...row,
      image: "/105m2_934x700.webp",
    }));

    res.status(200).json(accommodations);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});










router.post("/add", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const userID = decoded.userID; // `userID` buradan alınacak

    if (!userID) {
      console.error("UserID missing in token");
      return res.status(400).json({ error: "UserID missing in token." });
    }

    const {
      Title,
      Description,
      Location,
      Amenities,
      HouseRules,
      DailyPointCost,
      AvailableDates,
    } = req.body;

    const query = `
      INSERT INTO Accommodations (UserID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      userID,
      Title,
      Description,
      Location,
      JSON.stringify(Amenities),
      JSON.stringify(HouseRules),
      DailyPointCost,
      JSON.stringify(AvailableDates),
    ]);

    res.status(201).json({ message: "Accommodation added successfully!" });
  } catch (err) {
    console.error("Error adding accommodation:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
router.get("/random", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    // Mevcut görsellerin yollarını belirleyin
    const images = [
      "http://localhost:5173/mask-group@2x.png",
      "http://localhost:5173/mask-group-1@2x.png",
      "http://localhost:5173/mask-group-2@2x.png",
      "http://localhost:5173/mask-group-3@2x.png",
      "http://localhost:5173/mask-group-4@2x.png",
      "http://localhost:5173/mask-group-5@2x.png",
    ];

    const query = `
      SELECT AccommodationID, Title, Location, DailyPointCost, Description
      FROM Accommodations
      ORDER BY RAND()
      LIMIT ?
    `;
    const [results] = await pool.query(query, [limit]);

    // Görselleri sonuçlara rastgele ata
    const accommodations = results.map((row, index) => ({
      ...row,
      image: images[index % images.length], // Görselleri sırayla kullan
    }));

    res.status(200).json(accommodations);
  } catch (err) {
    console.error("Error fetching random accommodations:", err.message);
    res.status(500).json({ error: "Failed to fetch accommodations." });
  }
});
router.get("/myBookings", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const guestID = decoded.userID; // Kullanıcı ID'sini token'dan alıyoruz
    console.log("GuestID:", guestID); // Debug için log ekleyin

    const query = `
      SELECT 
        BookingID, 
        AccommodationID, 
        StartDate, 
        EndDate, 
        TotalPointsUsed, 
        Status 
      FROM Bookings 
      WHERE GuestID = ?
    `;

    const [results] = await pool.query(query, [guestID]);
    console.log("Bookings Results:", results); // Debug için log ekleyin

    if (results.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user." });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/my-host-bookings", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Kullanıcının kimliğini doğrula
    const userID = decoded.userID;

    const query = `
      SELECT BookingID, GuestID, HostID, AccommodationID, StartDate, EndDate, TotalPointsUsed, Status
      FROM Bookings
      WHERE HostID = ?
    `;
    const [rows] = await pool.query(query, [userID]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No host bookings found." });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching host bookings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  let currentUserID = null;

  try {
    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      currentUserID = decoded.userID; // Token'dan kullanıcı ID'sini al
    }

    const query = `
      SELECT AccommodationID, UserID, Title, Description, Location, Amenities, HouseRules, DailyPointCost, AvailableDates, CreatedAt, UpdatedAt 
      FROM Accommodations 
      WHERE AccommodationID = ?
    `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    const accommodation = rows[0];
    accommodation.image = "/105m2_934x700.webp"; // Varsayılan görsel ekle

    // Ekstra bir alan ekliyoruz: Kullanıcı bu konaklamanın sahibi mi?
    accommodation.isOwner = accommodation.UserID === currentUserID;

    res.status(200).json(accommodation);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT AccommodationID, Location, DailyPointCost, Description
      FROM Accommodations
    `);

    const accommodations = rows.map((row) => ({
      ...row,
      image: "/105m2_934x700.webp",
    }));

    res.json(accommodations);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userID = decoded.userID;

    // Kullanıcının bu konaklamanın sahibi olup olmadığını kontrol et
    const checkQuery = `SELECT UserID FROM Accommodations WHERE AccommodationID = ?`;
    const [checkRows] = await pool.query(checkQuery, [id]);

    if (checkRows.length === 0) {
      return res.status(404).json({ error: "Accommodation not found." });
    }

    if (checkRows[0].UserID !== userID) {
      return res.status(403).json({ error: "You are not authorized to edit this accommodation." });
    }

    const {
      Title,
      Description,
      Location,
      Amenities,
      HouseRules,
      DailyPointCost,
      AvailableDates,
    } = req.body;

    const updateQuery = `
      UPDATE Accommodations
      SET Title = ?, Description = ?, Location = ?, Amenities = ?, HouseRules = ?, DailyPointCost = ?, AvailableDates = ?
      WHERE AccommodationID = ? AND UserID = ?
    `;

    await pool.query(updateQuery, [
      Title,
      Description,
      Location,
      JSON.stringify(Amenities),
      JSON.stringify(HouseRules),
      DailyPointCost,
      JSON.stringify(AvailableDates),
      id,
      userID,
    ]);

    res.status(200).json({ message: "Accommodation updated successfully!" });
  } catch (err) {
    console.error("Error updating accommodation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/bookings/:id/confirm", async (req, res) => {
  const bookingID = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const updateQuery = `
      UPDATE Bookings SET Status = 'Confirmed' WHERE BookingID = ?
    `;
    await pool.query(updateQuery, [bookingID]);

    res.status(200).json({ message: "Booking successfully confirmed." });
  } catch (err) {
    console.error("Error confirming booking:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/bookings/:id/reject", async (req, res) => {
  const bookingID = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Booking ID'yi kontrol et
    const checkQuery = `SELECT HostID FROM Bookings WHERE BookingID = ?`;
    const [checkRows] = await pool.query(checkQuery, [bookingID]);

    if (checkRows.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Kullanıcının yetkisi var mı kontrol et
    if (checkRows[0].HostID !== decoded.userID) {
      return res.status(403).json({ error: "You are not authorized to reject this booking." });
    }

    // Status'u 'Rejected' olarak güncelle
    const updateQuery = `
      UPDATE Bookings SET Status = 'Rejected' WHERE BookingID = ?
    `;
    await pool.query(updateQuery, [bookingID]);

    res.status(200).json({ message: "Booking successfully rejected." });
  } catch (err) {
    console.error("Error rejecting booking:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.put("/bookings/:id/cancel", async (req, res) => {
  const bookingID = req.params.id; // URL'den BookingID alınıyor
  const token = req.headers.authorization?.split(" ")[1]; // Token kontrolü

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Token doğrulama

    // Silinecek booking'i kontrol et
    const checkQuery = `
      SELECT GuestID, Status FROM Bookings WHERE BookingID = ?
    `;
    const [checkRows] = await pool.query(checkQuery, [bookingID]);

    if (checkRows.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Kullanıcının yetkisi var mı kontrol et
    if (checkRows[0].GuestID !== decoded.userID) {
      return res.status(403).json({ error: "You are not authorized to cancel this booking." });
    }

    // Eğer zaten cancelled ise hata döndür
    if (checkRows[0].Status === "Cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled." });
    }

    // Booking'in Status değerini "Cancelled" olarak güncelle
    const updateQuery = `
      UPDATE Bookings SET Status = 'Cancelled' WHERE BookingID = ?
    `;
    await pool.query(updateQuery, [bookingID]);

    res.status(200).json({ message: "Booking successfully cancelled." });
  } catch (err) {
    console.error("Error cancelling booking:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/:id/reviews", async (req, res) => {
  const { id } = req.params; // Accommodation ID
  const { bookingID, rating, comment } = req.body;

  if (!bookingID || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // Ensure the booking exists and is confirmed
    const [bookingRows] = await pool.query(
      "SELECT * FROM Bookings WHERE BookingID = ? AND Status = 'Confirmed'",
      [bookingID]
    );

    if (!bookingRows || bookingRows.length === 0) {
      return res.status(400).json({ error: "Invalid or unconfirmed booking ID" });
    }

    const booking = bookingRows[0]; // Doğru booking'i alın

    // Insert the review
    await pool.query(
      `
        INSERT INTO RatingsAndReviews 
        (BookingID, Rating, Comment, ReviewerID, RevieweeID, CreatedAt)
        VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [bookingID, rating, comment, booking.GuestID, booking.HostID]
    );

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        rr.ReviewID,
        rr.Rating,
        rr.Comment,
        u.Name AS ReviewerName,
        rr.CreatedAt
      FROM RatingsAndReviews rr
      JOIN Users u ON rr.ReviewerID = u.UserID
      JOIN Bookings b ON rr.BookingID = b.BookingID
      WHERE b.AccommodationID = ?
    `;
    const [reviews] = await pool.query(query, [id]);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this accommodation." });
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});




router.get("/:id/average-rating", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT AVG(rr.Rating) AS AverageRating
      FROM RatingsAndReviews rr
      JOIN Bookings b ON rr.BookingID = b.BookingID
      WHERE b.AccommodationID = ?
    `;
    const [result] = await pool.query(query, [id]);
    const averageRating = parseFloat(result[0]?.AverageRating) || 0; // Convert to number, default to 0 if null
    res.status(200).json({ averageRating });
  } catch (err) {
    console.error("Error fetching average rating:", err);
    res.status(500).json({ error: "Failed to fetch average rating." });
  }
});



router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userID = decoded.userID;

      // Check if the accommodation belongs to the user
      const checkQuery = `SELECT UserID FROM Accommodations WHERE AccommodationID = ?`;
      const [checkRows] = await pool.query(checkQuery, [id]);

      if (checkRows.length === 0) {
          return res.status(404).json({ error: "Accommodation not found." });
      }

      if (checkRows[0].UserID !== userID) {
          return res.status(403).json({ error: "You are not authorized to delete this accommodation." });
      }

      // Check associated bookings
      const bookingsQuery = `
          SELECT BookingID, EndDate, Status
          FROM Bookings
          WHERE AccommodationID = ?
      `;
      const [bookings] = await pool.query(bookingsQuery, [id]);

      // Ensure all bookings are either cancelled or have passed
      const now = new Date();
      const canDelete = bookings.every((booking) => {
          const endDate = new Date(booking.EndDate);
          return booking.Status === "Cancelled" || endDate < now;
      });

      if (!canDelete) {
        return res.status(400).json({
            error: "Accommodation cannot be deleted",
            details: "It has active or future bookings.",
        });
    }
    

      // Proceed with the deletion of the accommodation
      const deleteAccommodationQuery = `
          DELETE FROM Accommodations
          WHERE AccommodationID = ? AND UserID = ?
      `;
      await pool.query(deleteAccommodationQuery, [id, userID]);

      res.status(200).json({ message: "Accommodation deleted successfully!" });
  } catch (err) {
      console.error("Error deleting accommodation:", err);
      res.status(500).json({ error: "Internal server error", details: err.message });
  }
});
router.get("/:id/user-bookings", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userID = decoded.userID;

    const query = `
      SELECT BookingID, AccommodationID, Status
      FROM Bookings
      WHERE AccommodationID = ? AND GuestID = ? AND Status = 'Confirmed'
    `;
    const [rows] = await pool.query(query, [req.params.id, userID]);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching user bookings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/bookings", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  const { id } = req.params; // Accommodation ID
  const { startDate, endDate } = req.body; // Dates from the request body

  // Debug logs
  console.log("Debug: Token -", token);
  console.log("Debug: Params -", id);
  console.log("Debug: Body -", req.body);

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Debug: Decoded Token -", decoded);

    const guestID = decoded.userID; // Extract guest ID from the token

    // Query the accommodation details
    const accommodationQuery = `SELECT DailyPointCost, UserID, AvailableDates FROM Accommodations WHERE AccommodationID = ?`;
    const [accommodation] = await pool.query(accommodationQuery, [id]);

    console.log("Debug: Accommodation Query Result -", accommodation);

    if (accommodation.length === 0) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    const { DailyPointCost, UserID: hostID, AvailableDates } = accommodation[0];
    console.log("Debug: Raw AvailableDates -", AvailableDates);

    // AvailableDates is already an array, no need to parse
    const availableDates = AvailableDates;

    // Ensure AvailableDates is an array
    if (!Array.isArray(availableDates)) {
      console.error("Error: AvailableDates is not an array", availableDates);
      return res.status(500).json({ error: "AvailableDates is not in the expected format." });
    }

    // Check if the selected date is available
    if (!availableDates.includes(startDate)) {
      return res.status(400).json({ error: "Selected date is not available." });
    }

    // Calculate the total points required
    const totalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;
    const totalPointsUsed = totalDays * DailyPointCost;

    // Query guest's points balance
    const guestQuery = `SELECT PointsBalance FROM Users WHERE UserID = ?`;
    const [guest] = await pool.query(guestQuery, [guestID]);

    console.log("Debug: Guest Query Result -", guest);

    // Check if the guest has enough points
    if (guest[0].PointsBalance < totalPointsUsed) {
      return res.status(400).json({ error: "Insufficient points." });
    }

    // Begin transaction
    await pool.query("START TRANSACTION");

    try {
      // Create the booking
      const bookingQuery = `
        INSERT INTO Bookings (GuestID, HostID, AccommodationID, StartDate, EndDate, TotalPointsUsed, Status)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
      `;
      const [bookingResult] = await pool.query(bookingQuery, [
        guestID,
        hostID,
        id,
        startDate,
        endDate,
        totalPointsUsed,
      ]);
      console.log("Debug: Booking Result -", bookingResult);

      // Update guest and host points
      const updateGuestPoints = `UPDATE Users SET PointsBalance = PointsBalance - ? WHERE UserID = ?`;
      const updateHostPoints = `UPDATE Users SET PointsBalance = PointsBalance + ? WHERE UserID = ?`;

      await pool.query(updateGuestPoints, [totalPointsUsed, guestID]);
      await pool.query(updateHostPoints, [totalPointsUsed, hostID]);

      // Remove the reserved date from AvailableDates
      const updatedDates = availableDates.filter((date) => date !== startDate);
      console.log("Debug: Updated Dates -", updatedDates);

      const updateDatesQuery = `UPDATE Accommodations SET AvailableDates = ? WHERE AccommodationID = ?`;
      await pool.query(updateDatesQuery, [JSON.stringify(updatedDates), id]);

      // Commit transaction
      await pool.query("COMMIT");

      // Respond with success
      res.status(201).json({
        message: "Booking created successfully.",
        bookingID: bookingResult.insertId,
      });
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query("ROLLBACK");
      console.error("Transaction failed:", error);
      res.status(500).json({ error: "Reservation failed." });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});










module.exports = router;
