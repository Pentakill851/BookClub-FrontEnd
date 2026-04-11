-- -------------------------------------------------------------
-- TablePlus 6.8.6(662)
--
-- https://tableplus.com/
--
-- Database: railway
-- Generation Time: 2026-03-30 13:28:53.4400
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `Book`;
CREATE TABLE `Book` (
  `ISBN` varchar(13) NOT NULL,
  `Author` varchar(255) NOT NULL,
  `Genre` varchar(100) DEFAULT NULL,
  `PublishedYear` int DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  PRIMARY KEY (`ISBN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `BookReview`;
CREATE TABLE `BookReview` (
  `ThreadID` int NOT NULL,
  `StarRating` int DEFAULT NULL,
  `ISBN` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`ThreadID`),
  KEY `ISBN` (`ISBN`),
  CONSTRAINT `BookReview_ibfk_1` FOREIGN KEY (`ThreadID`) REFERENCES `Thread` (`ThreadID`) ON DELETE CASCADE,
  CONSTRAINT `BookReview_ibfk_2` FOREIGN KEY (`ISBN`) REFERENCES `Book` (`ISBN`),
  CONSTRAINT `BookReview_chk_1` CHECK ((`StarRating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Club`;
CREATE TABLE `Club` (
  `ClubID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text,
  `UserID` int DEFAULT NULL,
  PRIMARY KEY (`ClubID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Club_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Invitation`;
CREATE TABLE `Invitation` (
  `InviteID` int NOT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `ClubID` int DEFAULT NULL,
  `SenderUserID` int DEFAULT NULL,
  `ReceiverUserID` int DEFAULT NULL,
  PRIMARY KEY (`InviteID`),
  KEY `ClubID` (`ClubID`),
  KEY `Invitation_ibfk_3` (`SenderUserID`),
  KEY `Invitation_ibfk_4` (`ReceiverUserID`),
  CONSTRAINT `Invitation_ibfk_2` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`),
  CONSTRAINT `Invitation_ibfk_3` FOREIGN KEY (`SenderUserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Invitation_ibfk_4` FOREIGN KEY (`ReceiverUserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Joins`;
CREATE TABLE `Joins` (
  `UserID` int NOT NULL,
  `ClubID` int NOT NULL,
  `JoinDate` date DEFAULT NULL,
  PRIMARY KEY (`UserID`,`ClubID`),
  KEY `ClubID` (`ClubID`),
  CONSTRAINT `Joins_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Joins_ibfk_2` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Message`;
CREATE TABLE `Message` (
  `ThreadID` int NOT NULL,
  `MessageNum` int NOT NULL,
  `UserID` int DEFAULT NULL,
  `Content` text,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ThreadID`,`MessageNum`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`ThreadID`) REFERENCES `Thread` (`ThreadID`) ON DELETE CASCADE,
  CONSTRAINT `Message_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Moderates`;
CREATE TABLE `Moderates` (
  `UserID` int NOT NULL,
  `ClubID` int NOT NULL,
  `AssignedAt` date DEFAULT NULL,
  PRIMARY KEY (`UserID`,`ClubID`),
  KEY `ClubID` (`ClubID`),
  CONSTRAINT `Moderates_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Moderates_ibfk_2` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `PrivateClub`;
CREATE TABLE `PrivateClub` (
  `ClubID` int NOT NULL,
  `JoinPasscode` varchar(50) NOT NULL,
  PRIMARY KEY (`ClubID`),
  CONSTRAINT `PrivateClub_ibfk_1` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `PublicClub`;
CREATE TABLE `PublicClub` (
  `ClubID` int NOT NULL,
  PRIMARY KEY (`ClubID`),
  CONSTRAINT `PublicClub_ibfk_1` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Rates`;
CREATE TABLE `Rates` (
  `ISBN` varchar(13) NOT NULL,
  `UserID` int NOT NULL,
  `PersonalStatus` varchar(50) DEFAULT NULL,
  `AddedToListAt` date DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  PRIMARY KEY (`ISBN`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Rates_ibfk_1` FOREIGN KEY (`ISBN`) REFERENCES `Book` (`ISBN`),
  CONSTRAINT `Rates_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Rates_chk_1` CHECK ((`Rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Reads`;
CREATE TABLE `Reads` (
  `ISBN` varchar(13) NOT NULL,
  `ClubID` int NOT NULL,
  `ReadingStatus` varchar(50) DEFAULT NULL,
  `DateFinished` date DEFAULT NULL,
  PRIMARY KEY (`ISBN`,`ClubID`),
  KEY `ClubID` (`ClubID`),
  CONSTRAINT `Reads_ibfk_1` FOREIGN KEY (`ISBN`) REFERENCES `Book` (`ISBN`),
  CONSTRAINT `Reads_ibfk_2` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `Thread`;
CREATE TABLE `Thread` (
  `ThreadID` int NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Topic` varchar(255) DEFAULT NULL,
  `ISBN` varchar(13) DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `ClubID` int DEFAULT NULL,
  PRIMARY KEY (`ThreadID`),
  KEY `ISBN` (`ISBN`),
  KEY `UserID` (`UserID`),
  KEY `ClubID` (`ClubID`),
  CONSTRAINT `Thread_ibfk_1` FOREIGN KEY (`ISBN`) REFERENCES `Book` (`ISBN`),
  CONSTRAINT `Thread_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`),
  CONSTRAINT `Thread_ibfk_3` FOREIGN KEY (`ClubID`) REFERENCES `Club` (`ClubID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `UserID` int NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- MIGRATION: Run on live DB to fix Message CASCADE
-- ALTER TABLE Message DROP FOREIGN KEY Message_ibfk_1;
-- ALTER TABLE Message ADD CONSTRAINT Message_ibfk_1
--   FOREIGN KEY (ThreadID) REFERENCES Thread(ThreadID) ON DELETE CASCADE;

-- Trigger 1: Moderator must be a member
DELIMITER //
CREATE TRIGGER check_moderator_is_member
BEFORE INSERT ON Moderates
FOR EACH ROW
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM Joins WHERE UserID = NEW.UserID AND ClubID = NEW.ClubID
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Moderator must be a member of the club';
  END IF;
END//
DELIMITER ;

-- Trigger 2: Auto-join on invitation accept
DELIMITER //
CREATE TRIGGER auto_join_on_accept
AFTER UPDATE ON Invitation
FOR EACH ROW
BEGIN
  IF NEW.Status = 'Accepted' AND OLD.Status != 'Accepted' THEN
    INSERT IGNORE INTO Joins (UserID, ClubID, JoinDate)
    VALUES (NEW.ReceiverUserID, NEW.ClubID, CURDATE());
  END IF;
END//
DELIMITER ;
