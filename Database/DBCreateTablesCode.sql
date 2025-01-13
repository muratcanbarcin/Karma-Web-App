-- Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Email VARCHAR(150),
    Password VARCHAR(255),
    ProfilePicture TEXT,
    DateOfBirth DATE,
    Bio TEXT,
    PointsBalance INT,
    CreatedAt DATETIME,
    UpdatedAt DATETIME
    Gender VARCHAR(10),
    Country VARCHAR(50),
    TimeZone VARCHAR(50)
);

-- Accommodations Table
CREATE TABLE Accommodations (
    AccommodationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Title VARCHAR(150),
    Description TEXT,
    Location VARCHAR(255),
    Amenities JSON,
    HouseRules JSON,
    DailyPointCost INT,
    AvailableDates JSON,
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Bookings Table
CREATE TABLE Bookings (
    BookingID INT PRIMARY KEY AUTO_INCREMENT,
    GuestID INT,
    HostID INT,
    AccommodationID INT,
    StartDate DATE,
    EndDate DATE,
    TotalPointsUsed INT,
    Status ENUM('Pending', 'Confirmed', 'Cancelled'),
    CreatedAt DATETIME,
    UpdatedAt DATETIME,
    FOREIGN KEY (GuestID) REFERENCES Users(UserID),
    FOREIGN KEY (HostID) REFERENCES Users(UserID),
    FOREIGN KEY (AccommodationID) REFERENCES Accommodations(AccommodationID)
);

-- Point Transactions Table
CREATE TABLE PointTransactions (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    TransactionType ENUM('Earned', 'Spent'),
    Points INT,
    Description TEXT,
    ReviewImpact JSON,
    CreatedAt DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Messaging Table
CREATE TABLE Messaging (
    MessageID INT PRIMARY KEY AUTO_INCREMENT,
    SenderID INT,
    ReceiverID INT,
    Content TEXT,
    SentAt DATETIME,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);

-- Ratings and Reviews Table
CREATE TABLE RatingsAndReviews (
    ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    BookingID INT,
    ReviewerID INT,
    RevieweeID INT,
    Rating DECIMAL(3,2),
    Comment TEXT,
    CreatedAt DATETIME,
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID),
    FOREIGN KEY (ReviewerID) REFERENCES Users(UserID),
    FOREIGN KEY (RevieweeID) REFERENCES Users(UserID)
);
