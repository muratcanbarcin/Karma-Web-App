INSERT INTO `karmadb`.`accommodations`
(`AccommodationID`,
`UserID`,
`Title`,
`Description`,
`Location`,
`Amenities`,
`HouseRules`,
`DailyPointCost`,
`AvailableDates`,
`CreatedAt`,
`UpdatedAt`)
VALUES
(<{AccommodationID: }>,
<{UserID: }>,
<{Title: }>,
<{Description: }>,
<{Location: }>,
<{Amenities: }>,
<{HouseRules: }>,
<{DailyPointCost: }>,
<{AvailableDates: }>,
<{CreatedAt: }>,
<{UpdatedAt: }>);

INSERT INTO `karmadb`.`bookings`
(`BookingID`,
`GuestID`,
`HostID`,
`AccommodationID`,
`StartDate`,
`EndDate`,
`TotalPointsUsed`,
`Status`,
`CreatedAt`,
`UpdatedAt`)
VALUES
(<{BookingID: }>,
<{GuestID: }>,
<{HostID: }>,
<{AccommodationID: }>,
<{StartDate: }>,
<{EndDate: }>,
<{TotalPointsUsed: }>,
<{Status: }>,
<{CreatedAt: }>,
<{UpdatedAt: }>);

INSERT INTO `karmadb`.`messaging`
(`MessageID`,
`SenderID`,
`ReceiverID`,
`Content`,
`SentAt`)
VALUES
(<{MessageID: }>,
<{SenderID: }>,
<{ReceiverID: }>,
<{Content: }>,
<{SentAt: }>);

INSERT INTO `karmadb`.`pointtransactions`
(`TransactionID`,
`UserID`,
`TransactionType`,
`Points`,
`Description`,
`ReviewImpact`,
`CreatedAt`)
VALUES
(<{TransactionID: }>,
<{UserID: }>,
<{TransactionType: }>,
<{Points: }>,
<{Description: }>,
<{ReviewImpact: }>,
<{CreatedAt: }>);

INSERT INTO `karmadb`.`ratingsandreviews`
(`ReviewID`,
`BookingID`,
`ReviewerID`,
`RevieweeID`,
`Rating`,
`Comment`,
`CreatedAt`)
VALUES
(<{ReviewID: }>,
<{BookingID: }>,
<{ReviewerID: }>,
<{RevieweeID: }>,
<{Rating: }>,
<{Comment: }>,
<{CreatedAt: }>);

INSERT INTO `karmadb`.`users`
(`UserID`,
`Name`,
`Email`,
`Password`,
`ProfilePicture`,
`DateOfBirth`,
`Bio`,
`PointsBalance`,
`CreatedAt`,
`UpdatedAt`,
`Gender`,
`Country`,
`TimeZone`)
VALUES
(<{UserID: }>,
<{Name: }>,
<{Email: }>,
<{Password: }>,
<{ProfilePicture: }>,
<{DateOfBirth: }>,
<{Bio: }>,
<{PointsBalance: }>,
<{CreatedAt: }>,
<{UpdatedAt: }>,
<{Gender: }>,
<{Country: }>,
<{TimeZone: }>);
