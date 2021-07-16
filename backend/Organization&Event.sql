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

 Date: 03/07/2021 16:42:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS
= 0;

-- ----------------------------
-- Table structure for Organization
-- ----------------------------
DROP TABLE IF EXISTS `Organization`;
CREATE TABLE `Organization`
(
  `OrganizationId` int NOT NULL AUTO_INCREMENT,
  `Email` varchar
(256) NOT NULL,
  `Password` varchar
(256) NOT NULL,
  `OrganizationName` varchar
(256) NOT NULL,
  `OrganizationType` varchar
(256) NOT NULL,
  `Logo` TEXT DEFAULT NULL,
  `Contact` varchar
(256) NOT NULL,
  `Introduction` TEXT DEFAULT NULL,
  `Details` TEXT DEFAULT NULL,
  `VideoUrl` varchar
(256) DEFAULT NULL,
  `ServiceList` TEXT DEFAULT NULL,
  `WebsiteLink` TEXT DEFAULT NULL,
  `otherEvents` varchar
(256) DEFAULT NULL,
  PRIMARY KEY
(`OrganizationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS
= 1;

INSERT INTO Organization
  (OrganizationId,Email,Password,OrganizationName,OrganizationType,Logo,Contact,
  Introduction,Details,VideoUrl,ServiceList,WebsiteLink,otherEvents)
VALUES(1, 'wellbeing@org.com', 'abcd', "HeadSpace", "Youth",
    "https://sydneynorthhealthnetwork.org.au/wp-content/uploads/2016/04/Headspace-logo.png",
    "headspace@newhorizons.net.au",
    "The Centre is open to assist young people with health advice and support and information, around a range of matters including: caring for others, stress, relationships, employment and depression",
    "Headspace is the National Youth Mental Health Foundation providing early intervention mental health services to 12-25 year olds, along with assistance in promoting young peoples’ wellbeing.",
    "https://youtu.be/DxIDKZHW3-E", '"mental health counselling","education support","employment support","alcohol and other drug services"', 
    "https://headspace.org.au",
    '1,2,3'),
    (2, 'test@org.com', 'abcd', "My Aged Care", "Seniors",
    "https://www.myagedcare.gov.au/themes/custom/myagedcare/logo.png",
    "1800-200-422",
    "My Aged Care is the Australian Government's starting point on your aged care journey. Find and access the government-funded services you need.",
    "My Aged Care will offer: prompt, reliable and confidential services; polite, helpful and knowledgeable staff; clear information, available in other languages if you speak another language; support to access information if you have hearing difficulties or a vision impairment; help to find government funded aged care services; prompt resolution of any complaint or concern you have with My Aged Care.",
    "https://youtu.be/QkWMK7gDVkw",
    '"Information on the different types of aged care services available",
    "An assessment of needs to identify eligibility and the right type of care",
    "Referrals and support to find service providers that can meet your needs",
    "Information on what you might need to pay towards the cost of your care."', "https://www.myagedcare.gov.au",
    '1,2,3'),
    (3, '9323@org.com', 'abcd', "House to Grow", "Education",
    "https://brizy.b-cdn.net/media/iW=70&iH=80&oX=0&oY=0&cW=70&cH=80/d1073b4eea3ad956e7750133d6091c22.png",
    "info@housetogrow.org",
    "Empowering communities through education for life, holistic health and wellbeing ",
    "House to Grow is a not-for-profit organisation that empowers vulnerable children in unhealthy environments and women affected by domestic violence through personal development, education for life and holistic health. 
    We try not to limit who can come to us, we encourage and support any individual that seeks personal development, education for life and holistic health. We also deliver educational programs to organisations, community groups and people in need. ",
    "video link", '"Colouring Dreams - Creating an environment for children to dream",
    "Growing Healthy International Students - More Self improvement for better societies",
    "The Flight of the Butterflies - Empowering women",
    "Building Emotionally Intelligent Communities - Get your volunteers ready for tomorrow’s job"', "https://www.housetogrow.org",
    '1,2,3');



DROP TABLE IF EXISTS `Event`;
CREATE TABLE `Event` (
  `EventId` int NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `OrganizationId` int NOT NULL,
  `OrganizationName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Thumbnail` varchar(255) NOT NULL,
  `Format` varchar(255) NOT NULL,
  `Postcode` varchar(255) NOT NULL,
  `Suburb` varchar(255) NOT NULL,
  `Street` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `Date` varchar(255) NOT NULL,
  `Time` varchar(255) NOT NULL,
  `Introduction` TEXT DEFAULT NULL,
  `Details` TEXT DEFAULT NULL,
  `Recommendation` TEXT DEFAULT NULL,
  `BookedUser` varchar(1000) DEFAULT NULL,

  PRIMARY KEY (`EventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO Event
  (EventId,EventName,OrganizationId,OrganizationName,Thumbnail,Format,Postcode,Suburb,Street,
  venue,Date,Time,Introduction,Details,Recommendation,BookedUser)
VALUES(1,"Kids Yoga Class",2,"Innerwest Council" ,
"https://www.indianyoga.school/public/uploads/gallery/kids-yoga-ttc.jpg","Class",
2131,"Ashfield NSW","Parramatta Road and Orpington Street","Ashfield Park",
"14-07-2021",
"11:00 AM to 12:00 PM",
 "Aimed at kids between 5 to 12, the classes will be gentle exercise focus, incorporating the local landscape and body weight exercises during the 60 minute session. ",
 "Kids must attend with parents. All you need is your yoga mat, a workout towel, a water bottle and a sense of fun!",
'1,2,3','1,2,3'),

(2,"Tai Chi for seniors",2,"My Aged Care" ,
"https://www.greatseniorliving.com/assets/img/tai-chi-for-seniors-pin-@1X.jpg","Class",
2039,"Rozelle NSW","608 Darling Street","Hannaford Community Centre",
"20-07-2021","10:00 AM to 11:00 AM",
 "Traditional Yang Style Tai Chi for seniors with particular focus on the 85 forms.",
 "Health benefits are derived from the Tai Chi's slow, gentle and tranquil movements which enable harmony in mind and body, improved mobility, suppleness and mental alertness. Bookings essential. ",
'1,2,3','1,2,3'),

(3,"Youth - #TrueDreamersTour2021",3,"House to Grow" ,
"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F137085143%2F307439946789%2F1%2Foriginal.20210531-025831?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C78%2C1250%2C625&s=3d6e67be19885a5a9411e28685a3bf0a",
"Class",
2204,"Marrickville NSW","142 Addison Road","142 Addison Rd","01-08-2021","11:00 AM to 3:00 PM",
 "A half day of activity that challenges young people to engage with wellbeing and make new connections in a friendly and fun environment.",
 "# TrueDreamersTour2021 event promises a half day of activity that challenges young people to engage with health and make new connections in a friendly and fun environment. including
              Inspirational stories from internaitonal students; Documentary internaional students in Australia; Round table with experts in health and education; Yoga and meditation activity; Live Music; Gift vouchers",
'1,2,3','1,2,3');