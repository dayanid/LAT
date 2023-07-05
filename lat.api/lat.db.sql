-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2023 at 05:06 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `latdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_mobile` varchar(255) NOT NULL,
  `admin_faculty_id` varchar(255) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_position` varchar(255) NOT NULL,
  `admin_gender` varchar(10) NOT NULL,
  `admin_department` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `status` enum('A','D','E') NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assessment`
--

CREATE TABLE `assessment` (
  `assessment_id` int(11) NOT NULL,
  `student_email` text NOT NULL,
  `question_id` int(11) NOT NULL,
  `mark` decimal(10,2) NOT NULL DEFAULT 0.00,
  `time_to_complete` text NOT NULL,
  `language` text NOT NULL,
  `attend_date` date NOT NULL DEFAULT curdate(),
  `attend_time` time NOT NULL DEFAULT curtime(),
  `run_count` int(11) NOT NULL,
  `run_time` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`run_time`)),
  `assessment_status` enum('completed','attempted') NOT NULL DEFAULT 'attempted',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `status` enum('A','D','E') NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `login_type` varchar(50) NOT NULL,
  `login_email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `master`
--

CREATE TABLE `master` (
  `master_id` int(11) NOT NULL,
  `master_name` varchar(255) NOT NULL,
  `master_mobile` varchar(255) NOT NULL,
  `master_password` varchar(255) NOT NULL,
  `master_email` varchar(255) NOT NULL,
  `master_position` varchar(255) NOT NULL,
  `master_gender` varchar(10) NOT NULL,
  `master_department` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `status` enum('A','D','E') NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `programming_languages`
--

CREATE TABLE `programming_languages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `output` varchar(255) NOT NULL,
  `input` varchar(255) NOT NULL,
  `declaration` varchar(255) NOT NULL,
  `conditions` varchar(255) NOT NULL,
  `loops` varchar(255) NOT NULL,
  `operators` varchar(255) NOT NULL,
  `functions` varchar(255) NOT NULL,
  `exception_handling` varchar(255) NOT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_by` varchar(255) DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `programming_languages`
--

INSERT INTO `programming_languages` (`id`, `name`, `output`, `input`, `declaration`, `conditions`, `loops`, `operators`, `functions`, `exception_handling`, `create_by`, `create_at`, `update_by`, `update_at`) VALUES
(1, 'python', 'print', 'input, raw_input', 'int, float, str, list, tuple, dict, bool, set, complex', 'if, elif, else', 'for, while', '+, -, *, /, %, //, **, ==, !=, <, >, <=, >=, in, not in, is, is not', 'def, lambda', 'try, except, else, finally', NULL, '2023-04-18 10:00:57', NULL, '2023-04-18 10:00:57'),
(2, 'java', 'System.out.println, System.out.print', 'Scanner', 'int, double, float, char, boolean, String, long, short, byte', 'if, else if, else, switch, case, default', 'for, while, do', '+, -, *, /, %, ++, --, ==, !=, <, >, <=, >=, &&, ||, !', 'public, private, protected, static, void, return, main', 'try, catch, finally', NULL, '2023-04-18 10:03:15', NULL, '2023-04-18 23:39:00'),
(3, 'c', 'printf', 'scanf', 'int, float, double, char, void, long, short', 'if, else if, else, switch, case, default', 'for, while, do', '+, -, *, /, %, ++, --, ==, !=, <, >, <=, >=, &&, ||, !', 'main, void, return', 'try, catch, finally', NULL, '2023-04-18 10:06:43', NULL, '2023-04-18 23:39:52'),
(4, 'c++', 'cout<<, <<, cout', 'cin>>, >>, cin', 'int, float, double, char, void, long, short, bool', 'if, else if, else, switch, case, default', 'for, while, do-while', '+, -, *, /, %, ++, --, ==, !=, <, >, <=, >=, &&, ||, !', 'int main(), void, return', 'try, catch, throw', NULL, '2023-04-18 10:08:03', NULL, '2023-04-18 23:40:34'),
(5, 'csharp', 'Console.Write, Console.WriteLine', 'Console.ReadLine', 'int, float, double, char, string, bool, decimal, object, long, short, byte, sbyte, ushort, uint, ulong', 'if, else if, else, switch, case, default', 'for, while, do, foreach', '+, -, *, /, %, ++, --, ==, !=, <, >, <=, >=, &&, ||, !', 'public, private, protected, static, void, return', 'try, catch, finally', NULL, '2023-04-18 10:12:13', NULL, '2023-04-18 23:42:16');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `test_case` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`test_case`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `status` enum('A','D','E') NOT NULL DEFAULT 'A',
  `explanation` text DEFAULT NULL,
  `keyword` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `question_text`, `test_case`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`, `explanation`, `keyword`) VALUES
(1, 'Write a program to print Hello World', '[{\"sample_input\":\"\",\"sample_output\":\"Hello World\"}]', '2023-02-11 20:33:21', NULL, NULL, NULL, 'A', 'The code will print the string \"Hello World\" to the console output.', 'output'),
(2, 'Write a code to add two numbers.', '[{\"sample_input\":\"5\\n5\",\"sample_output\":\"10\"},{\"sample_input\":\"3\\n8\",\"sample_output\":\"11\"}]', '2023-04-12 13:14:08', NULL, NULL, NULL, 'A', 'The code will add the values of num1 and num2 and store the result in the variable sum. It will then print the value of sum on the console.', 'input, output, operators'),
(3, 'Write a code to find the given number is positive or negative.', '[{\"sample_input\":\"5\",\"sample_output\":\"5 is positive\"},{\"sample_input\":\"-5\",\"sample_output\":\"-5 is negative\"}]', '2023-04-12 15:27:53', NULL, NULL, NULL, 'A', 'The code will check if the value of num is greater than or equal to zero. If it is, then the output will be \"Positive\". Otherwise, it will output \"Negative\".', 'input, output, operators, conditions'),
(4, 'Write a code to Check if a Number is Odd or Even.', '[{\"sample_input\":\"5\",\"sample_output\":\"5 is Odd\"},{\"sample_input\":\"6\",\"sample_output\":\"6 is Even\"}]', '2023-04-12 15:28:51', NULL, NULL, NULL, 'A', 'The code will check if the value of num is divisible by 2. If it is, then the output will be \"Even\". Otherwise, it will output \"Odd\".', 'input, output, operators, conditions'),
(5, 'Write a code to find the maximum of two numbers.', '[{\"sample_input\":\"5\\n4\",\"sample_output\":\"5 is Maximum\"},{\"sample_input\":\"3\\n8\",\"sample_output\":\"8 is Maximum\"}]', '2023-04-12 15:31:03', NULL, NULL, NULL, 'A', 'The code will compare the values of \"num1\" and \"num2\" and store the maximum value in the variable \"max_num\". It uses a ternary operator to make the comparison and assign the result to \"max_num\".', 'input, output, operators, conditions'),
(6, 'Write a code to find minimum of two numbers.', '[{\"sample_input\":\"5\\n4\",\"sample_output\":\"4 is Minimum\"},{\"sample_input\":\"2\\n8\",\"sample_output\":\"2 is minimum\"}]', '2023-04-12 15:32:01', NULL, NULL, NULL, 'A', 'The code will compare the values of \"num1\" and \"num2\" and store the minimum value in the variable \"min_num\". It uses a ternary operator to make the comparison and assign the result to \"min_num\".', 'input, output, operators, conditions'),
(7, 'Check whether a number is prime or not', '[{\"sample_input\":\"2\",\"sample_output\":\"True\"},{\"sample_input\":\"17\",\"sample_output\":\"True\"}]', '2023-04-18 14:25:20', NULL, NULL, NULL, 'A', 'Checking whether a number is prime or not is a common programming task that requires some knowledge of loops and conditionals. A prime number is a positive integer greater than 1 that has no positive integer divisors other than 1 and itself. For example, 2, 3, 5, 7, 11, 13, 17, 19, 23, and 29 are the first 10 prime numbers.', 'input, output, operators, conditions, loops');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_mobile` varchar(255) NOT NULL,
  `student_registerno` varchar(255) NOT NULL,
  `student_passout` varchar(255) NOT NULL,
  `student_email` varchar(255) NOT NULL,
  `student_password` varchar(255) NOT NULL,
  `student_gender` varchar(10) NOT NULL,
  `student_graduation` varchar(10) NOT NULL,
  `student_department` text NOT NULL,
  `student_profile` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `status` enum('A','D','E') NOT NULL DEFAULT 'A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `assessment`
--
ALTER TABLE `assessment`
  ADD PRIMARY KEY (`assessment_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `master`
--
ALTER TABLE `master`
  ADD PRIMARY KEY (`master_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessment`
--
ALTER TABLE `assessment`
  MODIFY `assessment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
