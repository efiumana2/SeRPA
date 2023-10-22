-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versione server:              8.0.33 - MySQL Community Server - GPL
-- S.O. server:                  Linux
-- HeidiSQL Versione:            12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dump della struttura del database presenze
CREATE DATABASE IF NOT EXISTS `presenze` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `presenze`;

-- Dump della struttura di tabella presenze.Aule
CREATE TABLE IF NOT EXISTS `Aule` (
  `ID_Edificio` int unsigned NOT NULL,
  `ID_Aula` int unsigned NOT NULL,
  `Descrizione` varchar(50) NOT NULL DEFAULT '',
  `IP` varchar(15) NOT NULL DEFAULT '',
  `Num_Cam` tinyint unsigned NOT NULL,
  PRIMARY KEY (`ID_Edificio`,`ID_Aula`),
  UNIQUE KEY `Indice 2` (`IP`),
  CONSTRAINT `FK_Aule_Edifici` FOREIGN KEY (`ID_Edificio`) REFERENCES `Edifici` (`ID_Edificio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- L’esportazione dei dati non era selezionata.

-- Dump della struttura di tabella presenze.Edifici
CREATE TABLE IF NOT EXISTS `Edifici` (
  `ID_Edificio` int unsigned NOT NULL,
  `Descrizione` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID_Edificio`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- L’esportazione dei dati non era selezionata.

-- Dump della struttura di tabella presenze.Presenze
CREATE TABLE IF NOT EXISTS `Presenze` (
  `ID_Edificio` int unsigned NOT NULL,
  `ID_Aula` int unsigned NOT NULL,
  `Data` datetime NOT NULL,
  `Presenze` int unsigned NOT NULL DEFAULT (0),
  PRIMARY KEY (`ID_Edificio`,`ID_Aula`,`Data`),
  CONSTRAINT `FK__Aule` FOREIGN KEY (`ID_Edificio`, `ID_Aula`) REFERENCES `Aule` (`ID_Edificio`, `ID_Aula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- L’esportazione dei dati non era selezionata.

-- Dump della struttura di tabella presenze.Utenti
CREATE TABLE IF NOT EXISTS `Utenti` (
  `ID_Utente` int unsigned DEFAULT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `Descrizione` varchar(50) DEFAULT NULL,
  `Tipo` tinyint unsigned DEFAULT NULL,
  KEY `Primaria` (`ID_Utente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- L’esportazione dei dati non era selezionata.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

CREATE USER 'presenze'@'%' IDENTIFIED BY 'SalveMondo';
GRANT ALL PRIVILEGES ON presenze.* TO 'presenze'@'%';
CREATE USER 'presenze'@'localhost' IDENTIFIED BY 'SalveMondo';
GRANT ALL PRIVILEGES ON presenze.* TO 'presenze'@'localhost';

USE presenze;
INSERT INTO Utenti (ID_Utente, Username, Password, Descrizione, Tipo) VALUES (1, 'admin', 'admin', 'Amministratore', 1);

