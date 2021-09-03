# create tables in database and add some data
import pymysql
from config import *


def create_database():
    conn = pymysql.connect(host=DB_URL,
                           user=DB_ACCOUNT,
                           password=DB_PASSWORD)
    conn.cursor().execute('''create database if not exists wellbeing''')
    conn.close()
    db = pymysql.connect(
        host=DB_URL,
        port=DB_PORT,
        user=DB_ACCOUNT,
        password=DB_PASSWORD,
        database=DB_NAME,
        charset='utf8'
    )
    c = db.cursor()

    user_table = '''
    CREATE TABLE IF NOT EXISTS `User` (
    `UserId` int NOT NULL AUTO_INCREMENT,
    `NickName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    `Email` varchar(255) NOT NULL,
    `Password` varchar(255) NOT NULL,
    `FavouriteId` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`UserId`)
    );
    '''

    insert_user = '''
    INSERT INTO `User` VALUES 
    (0, "Cecilia", "cecilia@gmail.com", "abcd", NULL),
    (0, "Nick", "nick@gmail.com","abcd",NULL),
    (0, "Chris", "chris@gmail.com","abcd",NULL);
    '''

    organization_table = '''CREATE TABLE IF NOT EXISTS `Organization` (
    `OrganizationId` int NOT NULL AUTO_INCREMENT,
    `Email` varchar(256) NOT NULL,
    `Password` varchar(256) NOT NULL,
    `OrganizationName` varchar(256) NOT NULL,
    `OrganizationType` varchar(256) NOT NULL,
    `Logo` TEXT DEFAULT NULL,
    `Contact` varchar(256) NOT NULL,
    `Introduction` TEXT DEFAULT NULL,
    `Details` TEXT DEFAULT NULL,
    `VideoUrl` varchar(256) DEFAULT NULL,
    `ServiceList` TEXT DEFAULT NULL,
    `WebsiteLink` TEXT DEFAULT NULL,
    PRIMARY KEY (`OrganizationId`)
    );
    '''

    insert_organization = '''
    INSERT INTO Organization 
    (OrganizationId,Email,Password,OrganizationName,OrganizationType,
    Logo,Contact,Introduction,Details,VideoUrl,ServiceList,WebsiteLink) VALUES 
    (0, "headspace@org.com", "abcd", "HeadSpace", "Youth",
    "https://sydneynorthhealthnetwork.org.au/wp-content/uploads/2016/04/Headspace-logo.png",
    "headspace@newhorizons.net.au",
    "The Centre is open to assist young people with health advice and support and information, around a range of matters including: caring for others, stress, relationships, employment and depression",
    "Headspace is the National Youth Mental Health Foundation providing early intervention mental health services to 12-25 year olds, along with assistance in promoting young peoples’ wellbeing.",
    "https://youtu.be/DxIDKZHW3-E",
    'mental health counselling@education support@employment support@alcohol and other drug services', 
    "https://headspace.org.au"), 

    (0, 'myagedcare@org.com', 'abcd', "My Aged Care", "Seniors", 
    "https://firebasestorage.googleapis.com/v0/b/comp9323-wellbeingbridge.appspot.com/o/images%2F2-2021%2F8%2F8%20%E4%B8%8A%E5%8D%8812%3A51%3A27-logo-myagedcare.jpeg?alt=media&token=aa2eb7f9-1704-4711-ba38-633af78623d1",
     "1800-200-422", "My Aged Care is the Australian Government's starting point on your aged care journey. Find and access the government-funded services you need.", 
     "My Aged Care will offer: prompt, reliable and confidential services; polite, helpful and knowledgeable staff; clear information, available in other languages if you speak another language; support to access information if you have hearing difficulties or a vision impairment; help to find government funded aged care services; prompt resolution of any complaint or concern you have with My Aged Care.", 
    "https://youtu.be/QkWMK7gDVkw", 
    'Information on the different types of aged care services available@An assessment of needs to identify eligibility and the right type of care@Referrals and support to find service providers that can meet your needs@Information on what you might need to pay towards the cost of your care', 
    "https://www.myagedcare.gov.au"), 

    (0, 'cmsbolozu@gmail.com', 'abcd', "House to Grow", "Education", 
    "https://brizy.b-cdn.net/media/iW=70&iH=80&oX=0&oY=0&cW=70&cH=80/d1073b4eea3ad956e7750133d6091c22.png", 
    "info@housetogrow.org", "Empowering communities through education for life, holistic health and wellbeing ", 
    "House to Grow is a not-for-profit organisation that empowers vulnerable children in unhealthy environments and women affected by domestic violence through personal development, education for life and holistic health. We try not to limit who can come to us, we encourage and support any individual that seeks personal development, education for life and holistic health. We also deliver educational programs to organisations, community groups and people in need. ", 
    "https://www.youtube.com/watch?v=mxz8KyV3Ydc", 
    'Colouring Dreams - Creating an environment for children to dream@Growing Healthy International Students - More Self improvement for better societies@The Flight of the Butterflies - Empowering women@Building Emotionally Intelligent Communities - Get your volunteers ready for tomorrow’s job', 
    "https://www.housetogrow.org"); '''

    event_table = '''
    CREATE TABLE IF NOT EXISTS `Event` (
    `EventId` int NOT NULL AUTO_INCREMENT,
    `EventName` varchar(255) NOT NULL,
    `OrganizationId` int NOT NULL,
    `OrganizationName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    `Thumbnail` varchar(255) NOT NULL,
    `Format` varchar(255) NOT NULL,
    `Category` varchar(255) NOT NULL,
    `Postcode` varchar(255),
    `Address` varchar(255),
    `Lat` varchar(255),
    `Lng` varchar(255),
    `StartDate` varchar(255) NOT NULL,
    `EndDate` varchar(255) NOT NULL,
    `Time` varchar(255) NOT NULL,
    `Introduction` TEXT DEFAULT NULL,
    `Details` TEXT DEFAULT NULL,
    PRIMARY KEY (`EventId`)
    );
    '''

    insert_event = '''
    INSERT INTO Event
    (EventId,EventName,OrganizationId,OrganizationName,Thumbnail,Format,Category,Postcode,Address,Lat,
    Lng,StartDate,EndDate,Time,Introduction,Details) VALUES
    (0,"Kids Yoga Class",1,"HeadSpace" ,
    "https://www.indianyoga.school/public/uploads/gallery/kids-yoga-ttc.jpg",
    "Class","Sports and fitness",
    "ASHFIELD, NSW 2131","Ashfield Park, Parramatta Rd, Ashfield NSW, Australia","-33.884895","151.135696",
    "15/08/2021","31/08/2021","11:00 AM to 12:00 PM",
    "Aimed at kids between 5 to 12, the classes will be gentle exercise focus, incorporating the local landscape and body weight exercises during the 60 minute session. ",
    "Kids must attend with parents. All you need is your yoga mat, a workout towel, a water bottle and a sense of fun!"),

    (0,"Kids Online Hip Hop Dance - Ages 5 to 12 years",1,"HeadSpace" ,
    "https://firebasestorage.googleapis.com/v0/b/comp9323-wellbeingbridge.appspot.com/o/images%2F1-2021%2F8%2F8%20%E4%B8%8A%E5%8D%881%3A48%3A44-youth%20hip%20pop.jpeg?alt=media&token=2a032dc8-0341-45ca-be87-11c630cd223b",
    "Online Event","Sports and fitness",
    "","","","",
    "16/08/2021","19/08/2021","5:00 PM to 6:00 PM",
    "This is a great opportunity to learn a range of skills from basic movement to more technical moves and develop a sense of movement to the latest rap, r&b and hip hop songs.",
    "Enjoy and discover conventional hip hop dancing as well as breaking, popping, locking, gliding, ticking, vibrating and krumping. Beginners welcome, no experience necessary."),

    (0,"Family Mental Health Check-Up",1,"HeadSpace" ,
    "https://firebasestorage.googleapis.com/v0/b/comp9323-wellbeingbridge.appspot.com/o/images%2F2-2021%2F8%2F7%20%E4%B8%8B%E5%8D%886%3A50%3A11-raising%20kids.jpeg?alt=media&token=4418d682-d1e3-434f-8c14-198583d125c7",
    "Online Event","Mental Health",
    "","","","",
    "01/08/2021","10/08/2021","1:30 PM to 3:30 PM",
    "With the rise of stress and uncertainty across our communities, the mental health and resiliency of our children, teens and families has never been so important.",
    "How can families focus on wellbeing and resiliency at home? And when do they need to reach out for help? Learn to monitor and strengthen the mental health of your family with some simple and effective strategies."),

    
    (0,"Tai Chi for seniors",2,"My Aged Care" ,
    "https://www.greatseniorliving.com/assets/img/tai-chi-for-seniors-pin-@1X.jpg",
    "Class","Seniors",
    "ROZELLE, NSW 2039",
    "Hannaford Community Centre, Darling Street, Rozelle NSW, Australia","-33.861659","151.171510",
    "05/08/2021","31/08/2021","10:00 AM to 11:00 AM",
    "Traditional Yang Style Tai Chi for seniors with particular focus on the 85 forms.",
    "Health benefits are derived from the Tai Chi's slow, gentle and tranquil movements which enable harmony in mind and body, improved mobility, suppleness and mental alertness. Bookings essential. "),

    (0,"Healthy Ageing Seminars - Back Care",2,"My Aged Care" ,
    "https://firebasestorage.googleapis.com/v0/b/comp9323-wellbeingbridge.appspot.com/o/images%2F2-2021%2F8%2F7%20%E4%B8%8B%E5%8D%886%3A42%3A46-back%20care.jpeg?alt=media&token=19ff9ed4-d6bf-44a5-b1f5-a342f34061b1",
    "Seminar","Seniors",
    "GYMEA, NSW 2227","Tradies Gymea, Manchester Road, Gymea NSW, Australia","-34.032558","151.087477",
    "17/08/2021","17/08/2021","10:30 AM to 12:30 PM",
    "Healthy Ageing Seminars - proudly bought to you by Sutherland Shire Council and South Eastern Sydney Local Health District - Health Promotion Service.",
    "This FREE Seniors Healthy Ageing Seminar Series is proudly presented by Sutherland Shire Council and South Eastern Sydney Local Health District Health Promotion Service (HPS).Presenters will include a Continence Physiotherapist and St George Hospital Continence Service."),

    (0,"Youth - #TrueDreamersTour2021",3,"House to Grow" ,
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F137085143%2F307439946789%2F1%2Foriginal.20210531-025831?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C78%2C1250%2C625&s=3d6e67be19885a5a9411e28685a3bf0a",
    "Tour","Young People","MARRICKVILLE, NSW 2204","142 Addison Road, Marrickville NSW, Australia","-33.902220","151.161075",
    "01/08/2021","15/08/2021","11:00 AM to 3:00 PM",
    "A half day of activity that challenges young people to engage with wellbeing and make new connections in a friendly and fun environment.",
    "# TrueDreamersTour2021 event promises a half day of activity that challenges young people to engage with health and make new connections in a friendly and fun environment. including Inspirational stories from internaitonal students; Documentary internaional students in Australia; Round table with experts in health and education; Yoga and meditation activity; Live Music; Gift vouchers"),
    
    (0,"Study help group in library",3,"House to Grow" ,
    "https://firebasestorage.googleapis.com/v0/b/comp9323-wellbeingbridge.appspot.com/o/images%2F2-2021%2F8%2F7%20%E4%B8%8B%E5%8D%889%3A08%3A23-library%20study%20events.jpeg?alt=media&token=60264c5a-7ce7-4348-8b10-68f700e8b6b0",
    "Networking","Young People",
    "CAMPSIE, NSW 2194","Campsie Library and Knowledge Centre, Amy Street, Campsie NSW, Australia","-33.912557","151.102509",
    "01/08/2021","31/08/2021","4:00 PM to 6:00 PM",
    "Get one on one help in both subjects. We will cover strategies to ace the exams.",
    "Study help group"),

    (0,"Youth Mental Health First Aid Course",3,"House to Grow" ,
    "https://firebasestorage.googleapis.com/v0/b/comp9323-wellbeingbridge.appspot.com/o/images%2F3-2021%2F8%2F8%20%E4%B8%8B%E5%8D%8811%3A37%3A32-youth%20mental%20health%20first%20aid.jpeg?alt=media&token=2456d126-3dde-4a0b-b7bc-8144fb84bbf0",
    "Class","Mental Health",
    "SYDNEY, NSW 2000","532-540 George Street, Sydney NSW, Australia","-33.873333","151.207383",
    "18/8/2021","31/08/2021","9:30 AM to 5:30 PM",
    "Check in with yourself, speak about things you've been struggling with in a space where you'll be understood and supported, and hopefully come away with some new self-care tools.",
    "GAIN THE CONFIDENCE AND SKILLS TO: Help an adolescent experiencing mental health problems; Recognise the signs and symptoms; Find effective help; Respond to early signs");

    
    '''

    booking_table = '''
    CREATE TABLE IF NOT EXISTS `Booking` (
    `BookingId` int NOT NULL AUTO_INCREMENT,
    `EventId` int NOT NULL,
    `UserId` int NOT NULL,
    PRIMARY KEY (`BookingId`)
    );
    '''

    insert_booking = '''
    INSERT INTO `Booking` VALUES 
    (0, 1, 1),
    (0, 3, 1),
    (0, 4, 1),
    (0, 6, 2),
    (0, 7, 2),
    (0, 8, 2),
    (0, 6, 3),
    (0, 7, 3),
    (0, 8, 3);
    '''

    comment_table = '''
    CREATE TABLE IF NOT EXISTS `Comment` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userid` int DEFAULT NULL,
    `username` varchar(255) DEFAULT NULL,
    `eventid` int DEFAULT NULL,
    `comment` varchar(255) DEFAULT NULL,
    `time` datetime DEFAULT NULL,
    `answer` varchar(255) DEFAULT NULL,
    `replyid` int DEFAULT NULL,
    PRIMARY KEY (`id`)
    )
    '''

    insert_comment = '''
    INSERT INTO `Comment` VALUES 
    (0, 2, "Nick", 8, "Can I bring friends? Or they also need to book?", '2021-07-06 15:25:26',"They don\'t need to! You can just bring them up!",3),
    (0, 3, 'Chris', 8, 'Interesting event!', '2021-07-08 21:51:26',NULL,NULL),
    (0, 1, 'Cecilia', 1, 'I would come with my kids!', '2021-07-09 21:51:30',NULL,NULL);
    '''

    review_table='''
    CREATE TABLE IF NOT EXISTS `Review` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userid` int NOT NULL,
    `username` varchar(255) NOT NULL,
    `rating` int NOT NULL,
    `organizationid` int NOT NULL,
    `review` varchar(255) NOT NULL,
    `time` datetime DEFAULT NULL,
    PRIMARY KEY (`id`)
    )
    '''

    insert_review = '''
    INSERT INTO `Review` VALUES 
    (0, 1, 'Cecilia', 5, 1, 'What a nice organization', '2021-08-03 21:51:26'),
    (0, 1, 'Cecilia', 3, 2, 'There is still room for improvement', '2021-08-04 21:51:26'),
    (0, 2, 'Nick', 4, 3, 'They host fantastic events!', '2021-08-05 21:51:30');
    '''
    
    c.execute(user_table)
    c.execute(organization_table)
    c.execute(event_table)
    c.execute(booking_table)
    c.execute(comment_table)
    c.execute(review_table)

    c.execute(insert_user)
    db.commit()
    c.execute(insert_booking)
    db.commit()
    c.execute(insert_organization)
    db.commit()
    c.execute(insert_event)
    db.commit()
    c.execute(insert_comment)
    db.commit()
    c.execute(insert_review)
    db.commit()
    
    c.close()

    return True


if __name__ == "__main__":
    create_database()
