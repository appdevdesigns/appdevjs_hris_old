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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributes`
--

LOCK TABLES `hris2_attributes` WRITE;
/*!40000 ALTER TABLE `hris2_attributes` DISABLE KEYS */;
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_type_trans`
--

LOCK TABLES `hris2_type_trans` WRITE;
/*!40000 ALTER TABLE `hris2_type_trans` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_type_trans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_attributes_trans`
--

DROP TABLE IF EXISTS `hris2_attributes_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_attributes_trans` (
  `attributetrans_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `attribute_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `attribute_label` text NOT NULL,
  `attribute_question` text NOT NULL,
  PRIMARY KEY (`attributetrans_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributes_trans`
--

LOCK TABLES `hris2_attributes_trans` WRITE;
/*!40000 ALTER TABLE `hris2_attributes_trans` DISABLE KEYS */;
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributeset`
--

LOCK TABLES `hris2_attributeset` WRITE;
/*!40000 ALTER TABLE `hris2_attributeset` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_attributeset_trans`
--

LOCK TABLES `hris2_attributeset_trans` WRITE;
/*!40000 ALTER TABLE `hris2_attributeset_trans` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_object`
--

LOCK TABLES `hris2_object` WRITE;
/*!40000 ALTER TABLE `hris2_object` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_object_type`
--

LOCK TABLES `hris2_object_type` WRITE;
/*!40000 ALTER TABLE `hris2_object_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_object_type` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_type`
--

LOCK TABLES `hris2_type` WRITE;
/*!40000 ALTER TABLE `hris2_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_type` ENABLE KEYS */;
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
  KEY `fk_rship_objA` (`objA_id`),
  KEY `fk_rship_objB` (`objB_id`),
  CONSTRAINT `fk_rship_objA` FOREIGN KEY (`objA_id`) REFERENCES `hris2_object` (`object_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rship_objB` FOREIGN KEY (`objB_id`) REFERENCES `hris2_object` (`object_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_lookup`
--

LOCK TABLES `hris2_lookup` WRITE;
/*!40000 ALTER TABLE `hris2_lookup` DISABLE KEYS */;
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_lookup_trans`
--

LOCK TABLES `hris2_lookup_trans` WRITE;
/*!40000 ALTER TABLE `hris2_lookup_trans` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_lookup_trans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hris2_relationship_trans`
--

DROP TABLE IF EXISTS `hris2_relationship_trans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hris2_relationship_trans` (
  `relationshiptrans_id` int(11) NOT NULL AUTO_INCREMENT,
  `relationship_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL DEFAULT '',
  `relationship_label` text NOT NULL,
  PRIMARY KEY (`relationshiptrans_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hris2_relationship_trans`
--

LOCK TABLES `hris2_relationship_trans` WRITE;
/*!40000 ALTER TABLE `hris2_relationship_trans` DISABLE KEYS */;
/*!40000 ALTER TABLE `hris2_relationship_trans` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-03-26 17:22:26
