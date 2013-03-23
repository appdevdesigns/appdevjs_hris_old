-- MySQL dump 10.13  Distrib 5.1.44, for apple-darwin8.11.1 (i386)
--
-- Host: localhost    Database: live_db
-- ------------------------------------------------------
-- Server version	5.1.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hris2_attributes`
--

DROP TABLE IF EXISTS `hris2_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_attributes` (
  `attribute_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `attributeset_id` int(11) NOT NULL,
  `attribute_column` text NOT NULL,
  `attribute_datatype` text NOT NULL,
  `meta` text NOT NULL,
  `attribute_permission` varchar(25) NOT NULL DEFAULT '',
  `attribute_uniqueKey` tinyint(1) NOT NULL,
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributes`
--

LOCK TABLES `hris2_attributes` WRITE;
/*!40000 ALTER TABLE `hris2_attributes` DISABLE KEYS */;
INSERT INTO `hris2_attributes` VALUES (1,1,'passport_number','TEXT','','',1),(2,1,'passport_issuedate','DATE','','',0),(3,1,'passport_expirationdate','DATE','','',0),(4,1,'country_id','LOOKUP','hris_country','',0),(5,1,'passport_isprimary','BOOL','','',0),(6,2,'person_givenname','TEXT','','',0),(7,2,'person_surname','TEXT','','',0),(8,3,'gender_id','LOOKUP','hris_gender','',0),(9,4,'passport_number','TEXT','','',0),(10,4,'passport_issuedate','DATE','','',0);
/*!40000 ALTER TABLE `hris2_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_type_trans`
--

DROP TABLE IF EXISTS `hris2_type_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_type_trans` (
  `typetrans_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `language_code` varchar(15) NOT NULL DEFAULT '',
  `type_label` text NOT NULL,
  PRIMARY KEY (`typetrans_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_type_trans`
--

LOCK TABLES `hris2_type_trans` WRITE;
/*!40000 ALTER TABLE `hris2_type_trans` DISABLE KEYS */;
INSERT INTO `hris2_type_trans` VALUES (1,1,'en','Person'),(2,1,'zh-hans','人'),(3,1,'ko','[ko]Person');
/*!40000 ALTER TABLE `hris2_type_trans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_attributes_trans`
--

DROP TABLE IF EXISTS `hris2_attributes_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_attributes_trans` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `attribute_label` text NOT NULL,
  `attribute_question` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributes_trans`
--

LOCK TABLES `hris2_attributes_trans` WRITE;
/*!40000 ALTER TABLE `hris2_attributes_trans` DISABLE KEYS */;
INSERT INTO `hris2_attributes_trans` VALUES (1,1,'en','Passport Number','Enter your passport number.'),(2,2,'en','Issue Date','Enter the issue Date'),(3,3,'en','Expiration Date','Enter the expiration date'),(4,4,'en','Country','Enter the passport country'),(5,5,'en','Is Primary','Is this the primary passport?'),(6,6,'en','Givenname','What\'s your given name?'),(7,7,'en','Surname','Enter your family name'),(8,6,'ko','[ko]Givenname','[ko]Enter your Family Name'),(9,7,'ko','[ko]Surname','[ko]Enter your Surname'),(10,8,'en','Gender','Enter your gender'),(11,8,'ko','[ko]Gender','[ko]Enter your Gender'),(12,9,'en','Number','Enter your passport number'),(13,10,'en','Issue Date',''),(14,9,'ko','[ko]Number',''),(15,10,'ko','[ko]Issue Date','');
/*!40000 ALTER TABLE `hris2_attributes_trans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_attributeset`
--

DROP TABLE IF EXISTS `hris2_attributeset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_attributeset` (
  `attributeset_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int(11) unsigned NOT NULL,
  `object_id` int(11) unsigned NOT NULL,
  `attributeset_table` text NOT NULL,
  `attributeset_relation` varchar(4) NOT NULL DEFAULT '',
  `attributeset_uniqueKey` tinyint(1) NOT NULL,
  `attributeset_key` text NOT NULL,
  `attributeset_pkey` text NOT NULL,
  PRIMARY KEY (`attributeset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributeset`
--

LOCK TABLES `hris2_attributeset` WRITE;
/*!40000 ALTER TABLE `hris2_attributeset` DISABLE KEYS */;
INSERT INTO `hris2_attributeset` VALUES (2,1,1,'hris2_person','one',0,'name','person_id'),(3,1,1,'hris2_person','one',0,'person','person_id'),(4,1,2,'hris_passport','one',0,'passport','passport_id');
/*!40000 ALTER TABLE `hris2_attributeset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_attributeset_trans`
--

DROP TABLE IF EXISTS `hris2_attributeset_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_attributeset_trans` (
  `attrsettrans_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `attributeset_id` int(11) unsigned NOT NULL,
  `language_code` varchar(10) NOT NULL DEFAULT '',
  `attributeset_label` text NOT NULL,
  PRIMARY KEY (`attrsettrans_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributeset_trans`
--

LOCK TABLES `hris2_attributeset_trans` WRITE;
/*!40000 ALTER TABLE `hris2_attributeset_trans` DISABLE KEYS */;
INSERT INTO `hris2_attributeset_trans` VALUES (4,2,'ko','[ko]names'),(2,2,'en','names'),(3,3,'en','person'),(5,4,'en','passport'),(6,4,'ko','[ko]passport');
/*!40000 ALTER TABLE `hris2_attributeset_trans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_object`
--

DROP TABLE IF EXISTS `hris2_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_object` (
  `object_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `object_key` text NOT NULL,
  `object_pkey` text NOT NULL,
  `object_table` text NOT NULL,
  PRIMARY KEY (`object_id`)

) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_object`
--

LOCK TABLES `hris2_object` WRITE;
/*!40000 ALTER TABLE `hris2_object` DISABLE KEYS */;
INSERT INTO `hris2_object` VALUES (1,'person','person_id','hris2_person'),(2,'passport','passport_id','hris_passport');
/*!40000 ALTER TABLE `hris2_object` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_object_type`
--

DROP TABLE IF EXISTS `hris2_object_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_object_type` (
  `objtype_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `object_key` text NOT NULL,
  `object_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `objtype_isactive` int(1) NOT NULL,
  PRIMARY KEY (`objtype_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_object_type`
--

LOCK TABLES `hris2_object_type` WRITE;
/*!40000 ALTER TABLE `hris2_object_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_object_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_person`
--

DROP TABLE IF EXISTS `hris2_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_person` (
  `person_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `person_surname` text NOT NULL,
  `person_givenname` text NOT NULL,
  `gender_id` int(11) NOT NULL,
  `person_birthdate` date NOT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_person`
--

LOCK TABLES `hris2_person` WRITE;
/*!40000 ALTER TABLE `hris2_person` DISABLE KEYS */;
INSERT INTO `hris2_person` VALUES (1,'Bourne','Jason',1,'0000-00-00'),(2,'Baggins','Bilbo',1,'1969-01-01');
/*!40000 ALTER TABLE `hris2_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_type`
--

DROP TABLE IF EXISTS `hris2_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_type` (
  `type_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `type_key` text NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_type`
--

LOCK TABLES `hris2_type` WRITE;
/*!40000 ALTER TABLE `hris2_type` DISABLE KEYS */;
INSERT INTO `hris2_type` VALUES (1,0,'Person	');
/*!40000 ALTER TABLE `hris2_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris_passport`
--

DROP TABLE IF EXISTS `hris_passport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris_passport` (
  `passport_id` int(11) NOT NULL AUTO_INCREMENT,
  `passport_guid` varchar(45) NOT NULL,
  `ren_id` int(11) NOT NULL,
  `passport_number` varchar(50) NOT NULL DEFAULT '-',
  `country_id` int(11) NOT NULL DEFAULT '1',
  `passport_issuedate` date NOT NULL DEFAULT '1000-01-01',
  `passport_expirationdate` date NOT NULL DEFAULT '1000-01-01',
  `person_id` int(11) NOT NULL,
  `passport_isprimary` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`passport_id`),
  UNIQUE KEY `idx_passport_guid` (`passport_guid`),
  UNIQUE KEY `idx_passport_ren_number` (`ren_id`,`passport_number`),
  KEY `fk_passport_country_id` (`country_id`),
  CONSTRAINT `fk_passport_country_id` FOREIGN KEY (`country_id`) REFERENCES `hris_country_data` (`country_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_passport_ren_id` FOREIGN KEY (`ren_id`) REFERENCES `hris_ren_data` (`ren_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris_passport`
--

LOCK TABLES `hris_passport` WRITE;
/*!40000 ALTER TABLE `hris_passport` DISABLE KEYS */;
INSERT INTO `hris_passport` VALUES (1,'',1,'1234',1,'1970-01-01','1980-01-01',1,1);
/*!40000 ALTER TABLE `hris_passport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_relationship`
--

DROP TABLE IF EXISTS `hris2_relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_relationship` (
  `relationship_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `objA_id` int(11) unsigned NOT NULL,
  `objB_id` int(11) unsigned NOT NULL,
  `relationship_type` varchar(25) NOT NULL DEFAULT '',
  PRIMARY KEY (`relationship_id`),
  CONSTRAINT fk_rship_objA
        FOREIGN KEY (objA_id) 
        REFERENCES hris2_object (object_id) ON DELETE CASCADE,
  CONSTRAINT fk_rship_objB 
        FOREIGN KEY (objB_id) 
        REFERENCES hris2_object (object_id) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_relationship`
--

LOCK TABLES `hris2_relationship` WRITE;
/*!40000 ALTER TABLE `hris2_relationship` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_relationship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_lookup`
--

DROP TABLE IF EXISTS `hris2_lookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_lookup` (
  `lookup_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lookup_key` text NOT NULL,
  `lookup_table` text NOT NULL,
  `lookup_pkey` text NOT NULL,
  PRIMARY KEY (`lookup_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_lookup`
--

LOCK TABLES `hris2_lookup` WRITE;
/*!40000 ALTER TABLE `hris2_lookup` DISABLE KEYS */;
INSERT INTO `hris2_lookup` VALUES (1,'gender','hris_gender','gender_id');
/*!40000 ALTER TABLE `hris2_lookup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_lookup_trans`
--

DROP TABLE IF EXISTS `hris2_lookup_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_lookup_trans` (
  `lookuptrans_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lookup_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL DEFAULT '',
  `lookup_label` text NOT NULL,
  PRIMARY KEY (`lookuptrans_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_lookup_trans`
--

LOCK TABLES `hris2_lookup_trans` WRITE;
/*!40000 ALTER TABLE `hris2_lookup_trans` DISABLE KEYS */;
INSERT INTO `hris2_lookup_trans` VALUES (1,1,'en','Gender');
/*!40000 ALTER TABLE `hris2_lookup_trans` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-03-12 12:06:56
