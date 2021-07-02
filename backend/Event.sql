/*
 Navicat Premium Data Transfer

 Source Server         : comp9900
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : localhost:3306
 Source Schema         : wellbeing

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 28/06/2021 17:45:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Event
-- ----------------------------
DROP TABLE IF EXISTS `Event`;
CREATE TABLE `Event` (
  `EventId` int NOT NULL,
  `OrganizationId` int NOT NULL,
  `OrganizationName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `Postcode` varchar(255) NOT NULL,
  `Suburb` varchar(255) NOT NULL,
  `Street` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `Date` date NOT NULL,
  `Time` datetime NOT NULL,
  `Details` varchar(1000) NOT NULL,
  `Recommendation` varchar(1000) DEFAULT NULL,
  `Favourites` int DEFAULT NULL,
  `Introduction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
