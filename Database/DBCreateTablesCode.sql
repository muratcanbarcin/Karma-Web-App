CREATE TABLE `accommodations` (
  `AccommodationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Title` varchar(150) DEFAULT NULL,
  `Description` text,
  `Location` varchar(255) DEFAULT NULL,
  `Amenities` json DEFAULT NULL,
  `HouseRules` json DEFAULT NULL,
  `DailyPointCost` int DEFAULT NULL,
  `AvailableDates` json DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`AccommodationID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `accommodations_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `bookings` (
  `BookingID` int NOT NULL AUTO_INCREMENT,
  `GuestID` int DEFAULT NULL,
  `HostID` int DEFAULT NULL,
  `AccommodationID` int DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `TotalPointsUsed` int DEFAULT NULL,
  `Status` enum('Pending','Confirmed','Cancelled') DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`BookingID`),
  KEY `GuestID` (`GuestID`),
  KEY `HostID` (`HostID`),
  KEY `AccommodationID` (`AccommodationID`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`GuestID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`HostID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`AccommodationID`) REFERENCES `accommodations` (`AccommodationID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messaging` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `SenderID` int DEFAULT NULL,
  `ReceiverID` int DEFAULT NULL,
  `Content` text,
  `SentAt` datetime DEFAULT NULL,
  PRIMARY KEY (`MessageID`),
  KEY `SenderID` (`SenderID`),
  KEY `ReceiverID` (`ReceiverID`),
  CONSTRAINT `messaging_ibfk_1` FOREIGN KEY (`SenderID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `messaging_ibfk_2` FOREIGN KEY (`ReceiverID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pointtransactions` (
  `TransactionID` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `TransactionType` enum('Earned','Spent') DEFAULT NULL,
  `Points` int DEFAULT NULL,
  `Description` text,
  `ReviewImpact` json DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `pointtransactions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ratingsandreviews` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `BookingID` int DEFAULT NULL,
  `ReviewerID` int DEFAULT NULL,
  `RevieweeID` int DEFAULT NULL,
  `Rating` decimal(3,2) DEFAULT NULL,
  `Comment` text,
  `CreatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`ReviewID`),
  KEY `BookingID` (`BookingID`),
  KEY `ReviewerID` (`ReviewerID`),
  KEY `RevieweeID` (`RevieweeID`),
  CONSTRAINT `ratingsandreviews_ibfk_1` FOREIGN KEY (`BookingID`) REFERENCES `bookings` (`BookingID`),
  CONSTRAINT `ratingsandreviews_ibfk_2` FOREIGN KEY (`ReviewerID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `ratingsandreviews_ibfk_3` FOREIGN KEY (`RevieweeID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `ProfilePicture` text,
  `DateOfBirth` date DEFAULT NULL,
  `Bio` text,
  `PointsBalance` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Country` varchar(50) DEFAULT NULL,
  `TimeZone` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
