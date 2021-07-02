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

 Date: 28/06/2021 17:46:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Organization
-- ----------------------------
DROP TABLE IF EXISTS `Organization`;
CREATE TABLE `Organization` (
  `OrganizationId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `OrganizationName` varchar(255) NOT NULL,
  `OrganizationType` varchar(255) NOT NULL,
  `Contact` varchar(255) NOT NULL,
  `Introduction` varchar(255) DEFAULT NULL,
  `Logo` varchar(255) DEFAULT NULL,
  `VideoUrl` varchar(255) DEFAULT NULL,
  `ServiceList` varchar(255) DEFAULT NULL,
  `WebsiteLink` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`OrganizationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
