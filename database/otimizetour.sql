CREATE DATABASE otimizetour; 
USE otimizetour; 

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(50) NOT NULL, 
    email VARCHAR(30) NOT NULL UNIQUE, 
    senhaHash VARCHAR(512) NOT NULL 
);

CREATE TABLE Categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE Roteiros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pais VARCHAR(5) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    custoTotal DECIMAL(10, 2) NOT NULL,
    shareToken VARCHAR(255) UNIQUE,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE PontosInteresse (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    avaliacaoMedia DECIMAL(2, 1),
    precoMedio DECIMAL(7, 2),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    categoria_id INT,
    roteiro_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id),
    FOREIGN KEY (roteiro_id) REFERENCES Roteiros(id)
);

--
--CREATE TABLE Roteiro_PontosInteresse (
--    id INT PRIMARY KEY AUTO_INCREMENT,
--    roteiro_id INT,
--    pontoInteresse_id INT,
--    FOREIGN KEY (roteiro_id) REFERENCES Roteiros(id),
--    FOREIGN KEY (pontoInteresse_id) REFERENCES PontosInteresse(id)
--);
--


CREATE TABLE Avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nota INT,
    comentario TEXT,
    dataComentario DATE NOT NULL,
    usuario_id INT,
    roteiro_id INT,
    FOREIGN KEY (roteiro_id) REFERENCES Roteiros(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
