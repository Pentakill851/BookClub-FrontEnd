USE BookClubDB;

INSERT INTO `User` (`UserID`, `Email`, `Username`, `Password`) VALUES
(1, 'alice@sfu.ca', 'Alice', 'hash1'),
(2, 'bob@sfu.ca', 'Bob', 'hash2'),
(3, 'charlie@sfu.ca', 'Charlie', 'hash3'),
(4, 'dana@sfu.ca', 'Dana', 'hash4'),
(5, 'evan@sfu.ca', 'Evan', 'hash5');

INSERT INTO `Book` (`ISBN`, `Author`, `Genre`, `PublishedYear`, `Title`) VALUES
('9780061120084', 'Harper Lee', 'Fiction', 1960, 'To Kill a Mockingbird'),
('9780140449136', 'Leo Tolstoy', 'Classic', 1869, 'War and Peace'),
('9780345339683', 'J.R.R. Tolkien', 'Fantasy', 1937, 'The Hobbit'),
('9780451524935', 'George Orwell', 'Dystopian', 1949, '1984'),
('9780743273565', 'F. Scott Fitzgerald', 'Fiction', 1925, 'The Great Gatsby');

INSERT INTO `Club` (`ClubID`, `Name`, `Description`, `UserID`) VALUES
(1, 'Sci-Fi Explorers', 'Reading the future.', 1),
(2, 'Classic Lit', 'The great books.', 2),
(3, 'Fantasy Realm', 'Swords and sorcery.', 3),
(4, 'Mystery Solvers', 'Who did it?', 4),
(5, 'Local Authors', 'Supporting local talent.', 5);

INSERT INTO `PrivateClub` (`ClubID`, `JoinPasscode`) VALUES
(1, 'scifi123'),
(4, 'clue456');

INSERT INTO `PublicClub` (`ClubID`) VALUES
(2),
(3),
(5);

INSERT INTO `Thread` (`ThreadID`, `CreatedAt`, `Topic`, `ISBN`, `UserID`, `ClubID`) VALUES
(1, '2026-03-28 00:39:01', 'Orwell Predictions', '9780451524935', 1, 1),
(2, '2026-03-28 00:39:01', 'Gatsby Symbolism', '9780743273565', 2, 2),
(3, '2026-03-28 00:39:01', 'Hobbit Journey', '9780345339683', 3, 3),
(4, '2026-03-28 00:39:01', 'Atticus Ethics', '9780061120084', 4, 4),
(5, '2026-03-28 00:39:01', 'Tolstoy Length', '9780140449136', 5, 5);

INSERT INTO `BookReview` (`ThreadID`, `StarRating`, `ISBN`) VALUES
(1, 5, '9780451524935'),
(2, 4, '9780743273565'),
(3, 5, '9780345339683'),
(4, 5, '9780061120084'),
(5, 3, '9780140449136');

INSERT INTO `Message` (`ThreadID`, `MessageNum`, `UserID`, `Content`, `Timestamp`) VALUES
(1, 1, 1, 'This book was ahead of its time.', '2026-03-28 00:39:02'),
(1, 2, 2, 'I completely agree!', '2026-03-28 00:39:02'),
(2, 1, 2, 'The green light is fascinating.', '2026-03-28 00:39:02'),
(3, 1, 3, 'Best fantasy book ever.', '2026-03-28 00:39:02'),
(4, 1, 4, 'A timeless classic.', '2026-03-28 00:39:02');

INSERT INTO `Invitation` (`InviteID`, `Status`, `Timestamp`, `ClubID`, `SenderUserID`, `ReceiverUserID`) VALUES
(1, 'Accepted', '2026-03-28 00:39:02', 1, NULL, NULL),
(2, 'Pending', '2026-03-28 00:39:02', 1, NULL, NULL),
(3, 'Declined', '2026-03-28 00:39:02', 2, NULL, NULL),
(4, 'Accepted', '2026-03-28 00:39:02', 3, NULL, NULL),
(5, 'Pending', '2026-03-28 00:39:02', 4, 4, 1);

INSERT INTO `Rates` (`ISBN`, `UserID`, `PersonalStatus`, `AddedToListAt`, `Rating`) VALUES
('9780061120084', 4, 'Read', '2026-01-04', 5),
('9780140449136', 5, 'Reading', '2026-01-05', 3),
('9780345339683', 3, 'Want to Read', '2026-01-03', NULL),
('9780451524935', 1, 'Read', '2026-01-01', 5),
('9780743273565', 2, 'Reading', '2026-01-02', 4);

INSERT INTO `Reads` (`ISBN`, `ClubID`, `ReadingStatus`, `DateFinished`) VALUES
('9780061120084', 4, 'In Progress', NULL),
('9780140449136', 5, 'Not Started', NULL),
('9780345339683', 3, 'Completed', '2026-02-15'),
('9780451524935', 1, 'Completed', '2026-02-01'),
('9780743273565', 2, 'In Progress', NULL);

INSERT INTO `Joins` (`UserID`, `ClubID`, `JoinDate`) VALUES
(1, 1, '2026-01-01'),
(2, 2, '2026-01-02'),
(3, 3, '2026-01-03'),
(4, 4, '2026-01-04'),
(5, 5, '2026-01-05');

INSERT INTO `Moderates` (`UserID`, `ClubID`, `AssignedAt`) VALUES
(1, 1, '2026-01-01'),
(2, 2, '2026-01-02'),
(3, 3, '2026-01-03'),
(4, 4, '2026-01-04'),
(5, 5, '2026-01-05');



-- 100 additional books for BookClubDB
-- Run this in TablePlus against the Railway database
-- Also paste these into init.sql under the existing 5 Book inserts
-- Covers load automatically via: https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg

INSERT INTO `Book` (`ISBN`, `Author`, `Genre`, `PublishedYear`, `Title`) VALUES

-- Fantasy
('9780547928210', 'J.R.R. Tolkien', 'Fantasy', 1954, 'The Fellowship of the Ring'),
('9780547928203', 'J.R.R. Tolkien', 'Fantasy', 1954, 'The Two Towers'),
('9780547928197', 'J.R.R. Tolkien', 'Fantasy', 1955, 'The Return of the King'),
('9780439708180', 'J.K. Rowling', 'Fantasy', 1997, 'Harry Potter and the Sorcerer''s Stone'),
('9780439554893', 'J.K. Rowling', 'Fantasy', 1998, 'Harry Potter and the Chamber of Secrets'),
('9780439655484', 'J.K. Rowling', 'Fantasy', 1999, 'Harry Potter and the Prisoner of Azkaban'),
('9780439139601', 'J.K. Rowling', 'Fantasy', 2000, 'Harry Potter and the Goblet of Fire'),
('9780553573404', 'George R.R. Martin', 'Fantasy', 1996, 'A Game of Thrones'),
('9780553579901', 'George R.R. Martin', 'Fantasy', 1998, 'A Clash of Kings'),
('9780756404741', 'Patrick Rothfuss', 'Fantasy', 2007, 'The Name of the Wind'),
('9780765326355', 'Brandon Sanderson', 'Fantasy', 2010, 'The Way of Kings'),
('9780765311788', 'Brandon Sanderson', 'Fantasy', 2006, 'Mistborn'),
('9780553588941', 'Scott Lynch', 'Fantasy', 2006, 'The Lies of Locke Lamora'),
('9780380789030', 'Neil Gaiman', 'Fantasy', 2001, 'American Gods'),

-- Dystopian
('9780060850524', 'Aldous Huxley', 'Dystopian', 1932, 'Brave New World'),
('9780385490818', 'Margaret Atwood', 'Dystopian', 1985, 'The Handmaid''s Tale'),
('9781451673319', 'Ray Bradbury', 'Dystopian', 1953, 'Fahrenheit 451'),
('9780439023481', 'Suzanne Collins', 'Dystopian', 2008, 'The Hunger Games'),
('9780439023498', 'Suzanne Collins', 'Dystopian', 2009, 'Catching Fire'),
('9780439023511', 'Suzanne Collins', 'Dystopian', 2010, 'Mockingjay'),

-- Science Fiction
('9780441013593', 'Frank Herbert', 'Science Fiction', 1965, 'Dune'),
('9780812550702', 'Orson Scott Card', 'Science Fiction', 1985, 'Ender''s Game'),
('9780345391803', 'Douglas Adams', 'Science Fiction', 1979, 'The Hitchhiker''s Guide to the Galaxy'),
('9780553293357', 'Isaac Asimov', 'Science Fiction', 1951, 'Foundation'),
('9780441569595', 'William Gibson', 'Science Fiction', 1984, 'Neuromancer'),
('9780804139021', 'Andy Weir', 'Science Fiction', 2011, 'The Martian'),
('9780307887436', 'Ernest Cline', 'Science Fiction', 2011, 'Ready Player One'),
('9780156030304', 'Daniel Keyes', 'Science Fiction', 1966, 'Flowers for Algernon'),

-- Fiction
('9780316769174', 'J.D. Salinger', 'Fiction', 1951, 'The Catcher in the Rye'),
('9780140177398', 'John Steinbeck', 'Fiction', 1937, 'Of Mice and Men'),
('9780142004234', 'John Steinbeck', 'Fiction', 1952, 'East of Eden'),
('9780143039433', 'John Steinbeck', 'Fiction', 1939, 'The Grapes of Wrath'),
('9780684801469', 'Ernest Hemingway', 'Fiction', 1929, 'A Farewell to Arms'),
('9780684801223', 'Ernest Hemingway', 'Fiction', 1952, 'The Old Man and the Sea'),
('9781400033416', 'Toni Morrison', 'Fiction', 1987, 'Beloved'),
('9780156028356', 'Alice Walker', 'Fiction', 1982, 'The Color Purple'),
('9780385333481', 'Colleen McCullough', 'Fiction', 1977, 'The Thorn Birds'),
('9780679720201', 'Albert Camus', 'Fiction', 1942, 'The Stranger'),

-- Classic
('9780143035008', 'Leo Tolstoy', 'Classic', 1878, 'Anna Karenina'),
('9780143107637', 'Fyodor Dostoevsky', 'Classic', 1866, 'Crime and Punishment'),
('9780374528379', 'Fyodor Dostoevsky', 'Classic', 1880, 'The Brothers Karamazov'),
('9780141439518', 'Jane Austen', 'Classic', 1813, 'Pride and Prejudice'),
('9780141439662', 'Jane Austen', 'Classic', 1811, 'Sense and Sensibility'),
('9780141441146', 'Charlotte Bronte', 'Classic', 1847, 'Jane Eyre'),
('9780141439556', 'Emily Bronte', 'Classic', 1847, 'Wuthering Heights'),
('9780141439563', 'Charles Dickens', 'Classic', 1861, 'Great Expectations'),
('9780141439600', 'Charles Dickens', 'Classic', 1859, 'A Tale of Two Cities'),
('9780199535569', 'Herman Melville', 'Classic', 1851, 'Moby Dick'),
('9780486280615', 'Oscar Wilde', 'Classic', 1890, 'The Picture of Dorian Gray'),
('9780743477543', 'William Shakespeare', 'Classic', 1603, 'Hamlet'),

-- Mystery
('9780062073488', 'Agatha Christie', 'Mystery', 1939, 'And Then There Were None'),
('9780062693662', 'Agatha Christie', 'Mystery', 1934, 'Murder on the Orient Express'),
('9780307454546', 'Stieg Larsson', 'Mystery', 2005, 'The Girl with the Dragon Tattoo'),
('9780307588371', 'Gillian Flynn', 'Mystery', 2012, 'Gone Girl'),
('9780307474278', 'Dan Brown', 'Mystery', 2003, 'The Da Vinci Code'),
('9780143113492', 'Tana French', 'Mystery', 2007, 'In the Woods'),
('9780425274866', 'Liane Moriarty', 'Mystery', 2014, 'Big Little Lies'),
('9781250301697', 'Alex Michaelides', 'Mystery', 2019, 'The Silent Patient'),

-- Romance
('9780440212560', 'Diana Gabaldon', 'Romance', 1991, 'Outlander'),
('9780446676090', 'Nicholas Sparks', 'Romance', 1996, 'The Notebook'),
('9780143124542', 'Jojo Moyes', 'Romance', 2012, 'Me Before You'),
('9780525478812', 'John Green', 'Romance', 2012, 'The Fault in Our Stars'),
('9781501110368', 'Colleen Hoover', 'Romance', 2016, 'It Ends with Us'),
('9781501110375', 'Colleen Hoover', 'Romance', 2015, 'November 9'),

-- Historical Fiction
('9780451166890', 'Ken Follett', 'Historical Fiction', 1989, 'The Pillars of the Earth'),
('9781476746586', 'Anthony Doerr', 'Historical Fiction', 2014, 'All the Light We Cannot See'),
('9780375842207', 'Markus Zusak', 'Historical Fiction', 2005, 'The Book Thief'),
('9780679781585', 'Arthur Golden', 'Historical Fiction', 1997, 'Memoirs of a Geisha'),
('9780312577223', 'Kristin Hannah', 'Historical Fiction', 2015, 'The Nightingale'),
('9781455563920', 'Min Jin Lee', 'Historical Fiction', 2017, 'Pachinko'),
('9780812985405', 'George Saunders', 'Historical Fiction', 2017, 'Lincoln in the Bardo'),

-- Non-Fiction
('9780062316097', 'Yuval Noah Harari', 'Non-Fiction', 2011, 'Sapiens'),
('9780399590504', 'Tara Westover', 'Non-Fiction', 2018, 'Educated'),
('9781524763138', 'Michelle Obama', 'Non-Fiction', 2018, 'Becoming'),
('9781400052189', 'Rebecca Skloot', 'Non-Fiction', 2010, 'The Immortal Life of Henrietta Lacks'),
('9780385486804', 'Jon Krakauer', 'Non-Fiction', 1996, 'Into the Wild'),
('9780679745587', 'Truman Capote', 'Non-Fiction', 1966, 'In Cold Blood'),
('9780375725609', 'Erik Larson', 'Non-Fiction', 2003, 'The Devil in the White City'),
('9780316017930', 'Malcolm Gladwell', 'Non-Fiction', 2008, 'Outliers'),

-- Young Adult
('9780544336261', 'Lois Lowry', 'Young Adult', 1993, 'The Giver'),
('9780062024022', 'Veronica Roth', 'Young Adult', 2011, 'Divergent'),
('9780062024046', 'Veronica Roth', 'Young Adult', 2012, 'Insurgent'),
('9780385737951', 'James Dashner', 'Young Adult', 2009, 'The Maze Runner'),
('9780316160179', 'Stephenie Meyer', 'Young Adult', 2005, 'Twilight'),
('9781451696196', 'Stephen Chbosky', 'Young Adult', 1999, 'The Perks of Being a Wallflower'),
('9781250012579', 'Rainbow Rowell', 'Young Adult', 2012, 'Eleanor and Park'),
('9780142407332', 'S.E. Hinton', 'Young Adult', 1967, 'The Outsiders'),

-- Horror
('9781501156700', 'Stephen King', 'Horror', 1986, 'It'),
('9780307743657', 'Stephen King', 'Horror', 1977, 'The Shining'),
('9780141439846', 'Bram Stoker', 'Horror', 1897, 'Dracula'),
('9780141439471', 'Mary Shelley', 'Horror', 1818, 'Frankenstein'),
('9780143039983', 'Shirley Jackson', 'Horror', 1959, 'The Haunting of Hill House'),

-- Graphic Novel
('9780930289232', 'Alan Moore', 'Graphic Novel', 1987, 'Watchmen'),
('9780394747231', 'Art Spiegelman', 'Graphic Novel', 1986, 'Maus'),

-- Memoir
('9780375714573', 'Marjane Satrapi', 'Memoir', 2000, 'Persepolis'),
('9780553296983', 'Anne Frank', 'Memoir', 1947, 'The Diary of a Young Girl'),
('9780345514400', 'Maya Angelou', 'Memoir', 1969, 'I Know Why the Caged Bird Sings'),
('9780374500016', 'Elie Wiesel', 'Memoir', 1960, 'Night'),
('9780399588174', 'Trevor Noah', 'Memoir', 2016, 'Born a Crime');