CREATE TABLE [Department](
	[DName] [varchar](15) NOT NULL,
	[DNumber] [numeric](4, 0) PRIMARY KEY NOT NULL,
	[Mgrssn] [char](9) NULL,
	[MgrStartdate] [datetime] NULL
)
GO

CREATE TABLE [Dependent](
	[ESSN] [char](9) NOT NULL,
	[Dependent_Name] [varchar](15) NOT NULL,
	[Sex] [char](1) NULL,
	[BDate] [datetime] NULL,
	[Relationship] [varchar](8) NULL
	PRIMARY KEY([ESSN],[Dependent_Name])
)

GO

CREATE TABLE [dbo].[Employee](
	[FName] [varchar](15) NOT NULL,
	[MInit] [varchar](1) NULL,
	[LName] [varchar](15) NOT NULL,
	[SSN] [char](9) PRIMARY KEY NOT NULL,
	[BDate] [datetime] NULL,
	[Address] [varchar](30) NULL,
	[Sex] [char](1) NULL,
	[Salary] [numeric](10, 2) NULL,
	[SuperSSN] [char](9) NULL,
	[DNo] [numeric](4, 0) NULL
)

GO
INSERT [Department] ([DName], [DNumber], [Mgrssn], [MgrStartdate]) VALUES (N'Headquarters', CAST(1 AS Numeric(4, 0)), N'888665555', CAST(N'1971-06-19T00:00:00.000' AS DateTime))
INSERT [Department] ([DName], [DNumber], [Mgrssn], [MgrStartdate]) VALUES (N'Administration', CAST(4 AS Numeric(4, 0)), N'987654321', CAST(N'1985-01-01T00:00:00.000' AS DateTime))
INSERT [Department] ([DName], [DNumber], [Mgrssn], [MgrStartdate]) VALUES (N'Research', CAST(5 AS Numeric(4, 0)), N'333445555', CAST(N'1978-05-22T00:00:00.000' AS DateTime))

INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'123456789', N'Alice', N'F', CAST(N'1978-12-31T00:00:00.000' AS DateTime), N'Daughter')
INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'123456789', N'Elizabeth', N'F', CAST(N'1957-05-05T00:00:00.000' AS DateTime), N'Spouse')
INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'123456789', N'Michael', N'M', CAST(N'1978-01-01T00:00:00.000' AS DateTime), N'Son')
INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'333445555', N'Alice', N'F', CAST(N'1976-04-05T00:00:00.000' AS DateTime), N'Daughter')
INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'333445555', N'Joy', N'F', CAST(N'1948-05-03T00:00:00.000' AS DateTime), N'Spouse')
INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'333445555', N'Theodore', N'M', CAST(N'1973-10-25T00:00:00.000' AS DateTime), N'Son')
INSERT [Dependent] ([ESSN], [Dependent_Name], [Sex], [BDate], [Relationship]) VALUES (N'987654321', N'Abner', N'M', CAST(N'1932-02-09T00:00:00.000' AS DateTime), N'Spouse')

INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'John', N'B', N'Smith', N'123456789', CAST(N'1955-01-09T00:00:00.000' AS DateTime), N'Houston TX', N'M', CAST(30000.00 AS Numeric(10, 2)), N'333445555', CAST(5 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'Franklin', N'T', N'Wong', N'333445555', CAST(N'1945-12-08T00:00:00.000' AS DateTime), N'Houston TX', N'M', CAST(40000.00 AS Numeric(10, 2)), N'888665555', CAST(5 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'Joyce', N'A', N'English', N'453453453', CAST(N'1962-07-31T00:00:00.000' AS DateTime), N'Houston TX', N'F', CAST(25000.00 AS Numeric(10, 2)), N'333445555', CAST(5 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'Ramesh', N'K', N'Narayan', N'666884444', CAST(N'1952-09-15T00:00:00.000' AS DateTime), N'Humble TX', N'M', CAST(38000.00 AS Numeric(10, 2)), N'333445555', CAST(5 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'James', N'E', N'Borg', N'888665555', CAST(N'1927-11-10T00:00:00.000' AS DateTime), N'Houston TX', N'M', CAST(55000.00 AS Numeric(10, 2)), NULL, CAST(1 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'Jennifer', N'S', N'Wallace', N'987654321', CAST(N'1931-06-20T00:00:00.000' AS DateTime), N'Bellaire TX', N'F', CAST(43000.00 AS Numeric(10, 2)), N'888665555', CAST(4 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'Ahmad', N'V', N'Jabbar', N'987987987', CAST(N'1959-03-29T00:00:00.000' AS DateTime), N'Houston TX', N'M', CAST(25000.00 AS Numeric(10, 2)), N'987654321', CAST(4 AS Numeric(4, 0)))
INSERT [Employee] ([FName], [MInit], [LName], [SSN], [BDate], [Address], [Sex], [Salary], [SuperSSN], [DNo]) VALUES (N'Alicia', N'J', N'Zelaya', N'999887777', CAST(N'1958-07-19T00:00:00.000' AS DateTime), N'Spring TX', N'F', CAST(25000.00 AS Numeric(10, 2)), N'987654321', CAST(4 AS Numeric(4, 0)))

ALTER TABLE [Department]  WITH CHECK ADD FOREIGN KEY([Mgrssn])
REFERENCES [Employee] ([SSN])

GO

ALTER TABLE [Dependent]  WITH CHECK ADD FOREIGN KEY([ESSN])
REFERENCES [Employee] ([SSN])

GO

ALTER TABLE [Employee]  WITH CHECK ADD FOREIGN KEY([SuperSSN])
REFERENCES [Employee] ([SSN])

GO
ALTER TABLE [Employee]  WITH CHECK ADD  CONSTRAINT [FK_Employee_Dno_Department_Dnumber] FOREIGN KEY([DNo])
REFERENCES [dbo].[Department] ([DNumber])

GO
ALTER TABLE [Employee] CHECK CONSTRAINT [FK_Employee_Dno_Department_Dnumber]

GO


SELECT * FROM [Department]
SELECT * FROM [Dependent]
SELECT * FROM [Employee]