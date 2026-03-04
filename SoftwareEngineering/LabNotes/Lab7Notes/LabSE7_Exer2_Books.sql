USE [LabDB]
GO
/****** Object:  Table [dbo].[AUTHOR]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AUTHOR](
	[AuthorId] [int] IDENTITY(1,1) NOT NULL,
	[AuthorName] [varchar](50) NOT NULL,
	[Address] [varchar](50) NULL,
	[Phone] [varchar](50) NULL,
	[PostCode] [varchar](50) NULL,
	[PostAddress] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[AuthorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BOOK]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BOOK](
	[BookId] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](50) NOT NULL,
	[ISBN] [varchar](20) NOT NULL,
	[PublisherId] [int] NOT NULL,
	[AuthorId] [int] NOT NULL,
	[CategoryId] [int] NOT NULL,
	[Description] [varchar](1000) NULL,
	[Year] [date] NULL,
	[Edition] [int] NULL,
	[AverageRating] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[BookId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CATEGORY]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CATEGORY](
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [varchar](50) NOT NULL,
	[Description] [varchar](1000) NULL,
PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PUBLISHER]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PUBLISHER](
	[PublisherId] [int] IDENTITY(1,1) NOT NULL,
	[PublisherName] [varchar](50) NOT NULL,
	[Description] [varchar](1000) NULL,
	[Address] [varchar](50) NULL,
	[Phone] [varchar](50) NULL,
	[PostCode] [varchar](50) NULL,
	[PostAddress] [varchar](50) NULL,
	[EMail] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[PublisherId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[GetBookData]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[GetBookData]
AS

SELECT
BOOK.BookId, 
BOOK.Title, 
BOOK.ISBN, 
PUBLISHER.PublisherName, 
AUTHOR.AuthorName, 
CATEGORY.CategoryName

FROM BOOK 
INNER JOIN AUTHOR ON BOOK.AuthorId = AUTHOR.AuthorId 
INNER JOIN PUBLISHER ON BOOK.PublisherId = PUBLISHER.PublisherId 
INNER JOIN CATEGORY ON BOOK.CategoryId = CATEGORY.CategoryId

GO
SET IDENTITY_INSERT [dbo].[AUTHOR] ON 
GO
INSERT [dbo].[AUTHOR] ([AuthorId], [AuthorName], [Address], [Phone], [PostCode], [PostAddress]) VALUES (1, N'Knut Hamsun', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[AUTHOR] ([AuthorId], [AuthorName], [Address], [Phone], [PostCode], [PostAddress]) VALUES (2, N'Gilbert Strang', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[AUTHOR] ([AuthorId], [AuthorName], [Address], [Phone], [PostCode], [PostAddress]) VALUES (3, N'J.R.R Tolkien', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[AUTHOR] ([AuthorId], [AuthorName], [Address], [Phone], [PostCode], [PostAddress]) VALUES (4, N'Dorf Bishop', NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[AUTHOR] ([AuthorId], [AuthorName], [Address], [Phone], [PostCode], [PostAddress]) VALUES (5, N'P.T.K.T', NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[AUTHOR] OFF
GO
SET IDENTITY_INSERT [dbo].[BOOK] ON 
GO
INSERT [dbo].[BOOK] ([BookId], [Title], [ISBN], [PublisherId], [AuthorId], [CategoryId], [Description], [Year], [Edition], [AverageRating]) VALUES (2, N'Software Development', N'1-08-890781-0', 2, 4, 2, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[BOOK] ([BookId], [Title], [ISBN], [PublisherId], [AuthorId], [CategoryId], [Description], [Year], [Edition], [AverageRating]) VALUES (3, N'Software UML Method', N'2-09-066556-2', 3, 3, 3, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[BOOK] ([BookId], [Title], [ISBN], [PublisherId], [AuthorId], [CategoryId], [Description], [Year], [Edition], [AverageRating]) VALUES (4, N'Software App Development', N'123456789', 4, 5, 2, NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[BOOK] OFF
GO
SET IDENTITY_INSERT [dbo].[CATEGORY] ON 
GO
INSERT [dbo].[CATEGORY] ([CategoryId], [CategoryName], [Description]) VALUES (1, N'Science', NULL)
GO
INSERT [dbo].[CATEGORY] ([CategoryId], [CategoryName], [Description]) VALUES (2, N'Programming', NULL)
GO
INSERT [dbo].[CATEGORY] ([CategoryId], [CategoryName], [Description]) VALUES (3, N'Novel', NULL)
GO
SET IDENTITY_INSERT [dbo].[CATEGORY] OFF
GO
SET IDENTITY_INSERT [dbo].[PUBLISHER] ON 
GO
INSERT [dbo].[PUBLISHER] ([PublisherId], [PublisherName], [Description], [Address], [Phone], [PostCode], [PostAddress], [EMail]) VALUES (1, N'Prentice Hall', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[PUBLISHER] ([PublisherId], [PublisherName], [Description], [Address], [Phone], [PostCode], [PostAddress], [EMail]) VALUES (2, N'Wiley', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[PUBLISHER] ([PublisherId], [PublisherName], [Description], [Address], [Phone], [PostCode], [PostAddress], [EMail]) VALUES (3, N'McGraw-Hill', NULL, NULL, NULL, NULL, NULL, NULL)
GO
INSERT [dbo].[PUBLISHER] ([PublisherId], [PublisherName], [Description], [Address], [Phone], [PostCode], [PostAddress], [EMail]) VALUES (4, N'TDTU', NULL, NULL, NULL, NULL, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[PUBLISHER] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__AUTHOR__4A1A120B05384220]    Script Date: 01/04/2023 8:14:22 AM ******/
ALTER TABLE [dbo].[AUTHOR] ADD UNIQUE NONCLUSTERED 
(
	[AuthorName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__BOOK__2CB664DCA8F56A47]    Script Date: 01/04/2023 8:14:22 AM ******/
ALTER TABLE [dbo].[BOOK] ADD UNIQUE NONCLUSTERED 
(
	[Title] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__CATEGORY__8517B2E04827CC58]    Script Date: 01/04/2023 8:14:22 AM ******/
ALTER TABLE [dbo].[CATEGORY] ADD UNIQUE NONCLUSTERED 
(
	[CategoryName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__PUBLISHE__5F0E2249482A8D27]    Script Date: 01/04/2023 8:14:22 AM ******/
ALTER TABLE [dbo].[PUBLISHER] ADD UNIQUE NONCLUSTERED 
(
	[PublisherName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[BOOK]  WITH CHECK ADD FOREIGN KEY([AuthorId])
REFERENCES [dbo].[AUTHOR] ([AuthorId])
GO
ALTER TABLE [dbo].[BOOK]  WITH CHECK ADD FOREIGN KEY([CategoryId])
REFERENCES [dbo].[CATEGORY] ([CategoryId])
GO
ALTER TABLE [dbo].[BOOK]  WITH CHECK ADD FOREIGN KEY([PublisherId])
REFERENCES [dbo].[PUBLISHER] ([PublisherId])
GO
/****** Object:  StoredProcedure [dbo].[CreateBook]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[CreateBook]
@Title varchar(50),
@Isbn varchar(20),
@PublisherName varchar(50),
@AuthorName varchar(50),
@CategoryName varchar(50)
AS



if not exists (select * from CATEGORY where CategoryName = @CategoryName)
	INSERT INTO CATEGORY (CategoryName) VALUES (@CategoryName)

if not exists (select * from AUTHOR where AuthorName = @AuthorName)
	INSERT INTO AUTHOR (AuthorName) VALUES (@AuthorName)

if not exists (select * from PUBLISHER where PublisherName = @PublisherName)
	INSERT INTO PUBLISHER (PublisherName) VALUES (@PublisherName)


if not exists (select * from BOOK where Title = @Title)
	INSERT INTO BOOK (Title, ISBN, PublisherId, AuthorId, CategoryId) 
	VALUES 
	(
	@Title,
	@ISBN, 
	(select PublisherId from PUBLISHER where PublisherName=@PublisherName),
	(select AuthorId from AUTHOR where AuthorName=@AuthorName),
	(select CategoryId from CATEGORY where CategoryName=@CategoryName)
	)


GO
/****** Object:  StoredProcedure [dbo].[DeleteBook]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[DeleteBook]
@BookId int
AS


delete from BOOK where BookId=@BookId


GO
/****** Object:  StoredProcedure [dbo].[UpdateBook]    Script Date: 01/04/2023 8:14:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[UpdateBook]
@BookId int,
@Title varchar(50),
@ISBN varchar(20),
@PublisherName varchar(50),
@AuthorName varchar(50),
@CategoryName varchar(50)
AS



--execute UpdateeBook BookId, 'Title', 'Author', 'Publisher', 'ISBN', 'Category'

if not exists (select * from CATEGORY where CategoryName = @CategoryName)
	INSERT INTO CATEGORY (CategoryName) VALUES (@CategoryName)

if not exists (select * from AUTHOR where AuthorName = @AuthorName)
	INSERT INTO AUTHOR (AuthorName) VALUES (@AuthorName)

if not exists (select * from PUBLISHER where PublisherName = @PublisherName)
	INSERT INTO PUBLISHER (PublisherName) VALUES (@PublisherName)



UPDATE BOOK SET
Title = @Title, 
ISBN = @ISBN, 
PublisherId = (select PublisherId from PUBLISHER where PublisherName=@PublisherName), 
AuthorId = (select AuthorId from AUTHOR where AuthorName=@AuthorName), 
CategoryId = (select CategoryId from CATEGORY where CategoryName=@CategoryName) 
	 
WHERE BookId = @BookId

GO
