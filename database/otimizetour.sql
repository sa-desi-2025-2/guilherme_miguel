CREATE DATABASE otimizetour; 
USE otimizetour; 

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(50) NOT NULL, 
    email VARCHAR(30) NOT NULL UNIQUE, 
    senhaHash VARCHAR(512) NOT NULL 
);

CREATE TABLE Admin(
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

CREATE TABLE CustoViagem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    custoTotalReais DECIMAL(2,1) NOT NULL,
    custoTotalConvertido DECIMAL(2,1) NOT NULL,
    roteiro_id INT,
    FOREIGN KEY (roteiro_id) REFERENCES Roteiros(id)
);

CREATE TABLE Clima(
    id INT PRIMARY KEY AUTO_INCREMENT,
    climaAtual VARCHAR(30),
    roteiro_id INT,
    FOREIGN KEY (roteiro_id) REFERENCES Roteiros(id)
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


CREATE TABLE Roteiro_PontosInteresse (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roteiro_id INT,
    pontoInteresse_id INT,
    FOREIGN KEY (roteiro_id) REFERENCES Roteiros(id),
    FOREIGN KEY (pontoInteresse_id) REFERENCES PontosInteresse(id)
);

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


INSERT INTO usuarios (nome, email, senhaHash) VALUES
('João Silva', 'joao@email.com', 'ADFWBGJIwjkfnjbJbGJK213'),
('Maria Souza', 'maria@email.com', 'ASFSDSWVJANVJIA2732DVS'),
('Carlos Lima', 'carlos@email.com', 'DWBHFwv8987YDFDFSDFSJFE4');


INSERT INTO Categorias (nome) VALUES
('Museu'),
('Parque'),
('Monumento'),
('Gastronomia'),
('Praia');


INSERT INTO PontosInteresse (nome, descricao, avaliacaoMedia, categoria_id) VALUES
('Museu de Arte Moderna', 'Museu com diversas exposições de arte.', 4.5, 1),
('Parque Central', 'Área verde para caminhadas e piqueniques.', 4.2, 2),
('Monumento da Independência', 'Marco histórico da cidade.', 4.7, 3),
('Restaurante Sabor Local', 'Culinária típica regional.', 4.8, 4),
('Praia do Sol', 'Praia tranquila e ideal para família.', 4.6, 5);


INSERT INTO Roteiro_PontosInteresse (roteiro_id, pontoInteresse_id) VALUES
(1, 1),
(1, 2),
(2, 4),
(2, 5),
(3, 5),
(3, 3);



INSERT INTO Avaliacoes (nota, comentario, dataComentario, usuario_id, roteiro_id) VALUES
(5, 'Roteiro incrível, recomendo!', '2025-01-20', 1, 1),
(4, 'Muito bom, mas poderia ser mais barato.', '2025-02-15', 2, 2),
(5, 'Experiência excelente!', '2025-03-10', 3, 3);


SELECT * FROM usuarios;
SELECT * FROM usuarios WHERE id = 1;

UPDATE usuarios
SET nome = 'Marcos', email = 'marcos@gmail.com'
WHERE id = 1;

DELETE FROM usuarios WHERE id = 1;

SELECT * FROM Categorias;

UPDATE Categorias SET nome = 'Cinema' WHERE id = 1;

DELETE FROM Categorias WHERE id = 1;

SELECT * FROM PontosInteresse;

UPDATE PontosInteresse
SET avaliacaoMedia = 4.9
WHERE id = 1;

DELETE FROM PontosInteresse WHERE id = 1;

SELECT * FROM Roteiros;
SELECT * FROM Roteiros WHERE usuario_id = 1;

UPDATE Roteiros
SET custoTotal = 3000.00
WHERE id = 1;

DELETE FROM Roteiros WHERE id = 1;

SELECT * FROM Roteiro_PontosInteresse;

DELETE FROM Roteiro_PontosInteresse
WHERE roteiro_id = 1 AND pontoInteresse_id = 3;

SELECT * FROM Avaliacoes;
SELECT * FROM Avaliacoes WHERE roteiro_id = 1;

UPDATE Avaliacoes
SET nota = 4, comentario = 'Muito bom!'
WHERE id = 1;

DELETE FROM Avaliacoes WHERE id = 1;

INSERT INTO Roteiro_PontosInteresse (roteiro_id, pontoInteresse_id)
SELECT r.id, p.id
FROM Roteiros r
INNER JOIN PontosInteresse p ON p.categoria_id = (SELECT id FROM Categorias WHERE nome = 'Museu')
WHERE r.id = 1;
