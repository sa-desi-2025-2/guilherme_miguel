# OtimizeTour_SA
OtimizeTour: Sistema de planejamento de viagens inteligente que revoluciona a criação de roteiros personalizados. Resolve a ineficiência do planejamento manual, gerando jornadas completas com base em preferências de usuários (hobbies, gastronomia) e calculando o custo médio total. Desenvolvido por: Guilherme Halter e Miguel Carvalho.

---

## Tecnologias Utilizadas

**Frontend**
- HTML
- CSS
- BOOTSTRAP
- JAVASCRIPT

**Backend**
- JAVA
- SPRING BOOT
- MAVEN
- Banco de Dados MYSQL

---

## Configuração do Ambiente

### 1. Pré-requisitos

- [Java JDK 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
- [Apache Maven](https://maven.apache.org/download.cgi)
- [Git](https://git-scm.com/)
- Um editor de código (recomendado: [VS Code](https://code.visualstudio.com/) ou [IntelliJ IDEA](https://www.jetbrains.com/idea/))

### 2. Clonar Repositorio

Clone o Repositorio para sua maquina local no diretorio `Documents/` por exemplo.

```bash
git clone https://github.com/sa-desi-2025-2/guilherme_miguel.git
``` 

### Estrutura de Pastas do Projeto

### Banco de Dados
O projeto utiliza **MySQL** como banco de dados relacional.

> 💡 **Observação:**  
> Durante o desenvolvimento, foi utilizado o **XAMPP** para gerenciar o servidor MySQL de forma local.  
> No entanto, você pode utilizar **qualquer outro método** para executar o banco de dados, como:
> - **MySQL Server** instalado diretamente em sua máquina  
> - **Docker**  
> - **WAMP** ou **Laragon**  
> - **Serviços em nuvem** (ex: ClearDB, PlanetScale, etc.)

Configurando o XAMPP:

1. Baixe e instale o [XAMPP](https://www.apachefriends.org/pt_br/download.html).
2. Abra o **XAMPP Control Panel**.
3. Inicie os serviços **Apache** e **MySQL**.
4. Acesse o phpMyAdmin em:
   ```bash
   http://localhost/phpmyadmin
   ```
5. Crie o banco de dados:
   ```bash
   CREATE DATABASE otimizetour; 
   ```

6. Importe a estrutura do Banco de Dados localizada em `database/otimizetour.sql`.


### FrontEnd

O frontend se encontra na pasta `frontend/`.

Basta abrir o arquivo `HomePage.html` diretamente no navegador
ou usar um servidor local.

Exemplo com o VS Code:

Instale a extensão **Live Server**

Clique com o botão direito em `HomePage.html` → Open with Live Server

O site rodará em:

```bash
http://127.0.0.1:5500
```

### Backend

Para que o backend funcione voce tem que baixar o JAVA e o Maven

Após instalar o Maven voce deve coloca-lo nas variaveis de ambiente da sua maquina <br>
ou <br>
Abra o Prompt de Comando (CMD) e rode esses comandos, substituindo o caminho conforme sua pasta:

```bash
setx MAVEN_HOME "C:\Users\SEU_USUARIO\apache-maven"
setx PATH "%PATH%;C:\Users\SEU_USUARIO\apache-maven\bin"
```


Com o Banco de Dados configurado , edite o arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nomedobanco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

No terminal abra a pasta `Backend/`:
```bash
cd Backend
```

Instale as dependencias nescessarias:
```bash
mvn clean install
```

Inicie o backend com o comando:
```bash
mvn spring-boot:run
```

o backend estará disponivel em `http://localhost:8081`
