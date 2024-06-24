
PRAGMA foreign_keys = ON;

-- Tabla category
CREATE TABLE category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    "isExtern" INTEGER,
    "isActive" INTEGER,
    "createDate" TEXT
);

-- Tabla category_exception
CREATE TABLE category_exception (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    exception_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(exception_id) REFERENCES exception(id)
);

-- Tabla category_institute
CREATE TABLE category_institute (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    institute_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(institute_id) REFERENCES institute(id)
);

-- Tabla category_place
CREATE TABLE category_place (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    place_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(place_id) REFERENCES place(id)
);

-- Tabla category_visitor
CREATE TABLE category_visitor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    visitor_id INTEGER,
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(visitor_id) REFERENCES visitor(dni)
);

-- Tabla enterprice
CREATE TABLE enterprice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cuit INTEGER,
    "isActive" INTEGER,
    "createDate" TEXT
);

-- Tabla exception
CREATE TABLE "exception" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    duration TEXT,
    "createDate" TEXT
);

-- Tabla image
CREATE TABLE image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "visitorId" INTEGER,
    image BLOB,
    "createDate" TEXT,
    FOREIGN KEY("userId") REFERENCES user(dni),
    FOREIGN KEY("visitorId") REFERENCES visitor(dni)
);

-- Tabla institute (si no existe aún)
CREATE TABLE IF NOT EXISTS institute (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    "isActive" INTEGER,
    "createDate" TEXT
);

-- Tabla institute_place
CREATE TABLE institute_place (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institute_id INTEGER,
    place_id INTEGER,
    FOREIGN KEY(institute_id) REFERENCES institute(id),
    FOREIGN KEY(place_id) REFERENCES place(id)
);

-- Tabla logs
CREATE TABLE "logs" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "admDni" INTEGER,
    "userId" INTEGER,
    "exceptionId" INTEGER,
    "visitorId" INTEGER,
    "hasAccess" INTEGER,
    "isFaceRecognition" INTEGER,
    abm TEXT,
    "abmType" TEXT,
    description TEXT,
    "aperturaCierre" TEXT,
    "createDate" TEXT,
    "isEnter" INTEGER,
    "isAutomatic" INTEGER,
    "isError" INTEGER,
    FOREIGN KEY("userId") REFERENCES user(dni),
    FOREIGN KEY("exceptionId") REFERENCES exception(id),
    FOREIGN KEY("visitorId") REFERENCES visitor(dni)
);

-- Tabla place
CREATE TABLE place (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    abbreviation TEXT,
    description TEXT,
    "openTime" TEXT,
    "closeTime" TEXT,
    "isActive" INTEGER,
    "createDate" TEXT
);

-- Tabla place_exception
CREATE TABLE place_exception (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id INTEGER,
    exception_id INTEGER,
    FOREIGN KEY(place_id) REFERENCES place(id),
    FOREIGN KEY(exception_id) REFERENCES exception(id)
);

-- Tabla role
CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    "createDate" TEXT,
    "routingConnection" INTEGER,
    "onlineLogin" INTEGER,
    "offlineLogin" INTEGER,
    "dayStartEnd" INTEGER,
    "visitorAuthentication" INTEGER,
    "visitorAuthorization" INTEGER,
    "instituteConfiguration" INTEGER,
    "entityABMs" INTEGER,
    "systemReports" INTEGER,
    "systemLog" INTEGER,
    "exceptionLoading" INTEGER
);

-- Tabla user
CREATE TABLE user (
    dni INTEGER PRIMARY KEY,
    role_id INTEGER,
    name TEXT,
    lastname TEXT,
    password TEXT,
    "isActive" INTEGER,
    "activeDate" TEXT,
    "createDate" TEXT,
    FOREIGN KEY(role_id) REFERENCES role(id)
);

-- Tabla user_history
CREATE TABLE "user_history" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "dniO" INTEGER,
    "dniN" INTEGER,
    role_idO INTEGER,
    role_idN INTEGER,
    nameO TEXT,
    nameN TEXT,
    lastnameO TEXT,
    lastnameN TEXT,
    passwordO TEXT,
    passwordN TEXT,
    "isActiveO" INTEGER,
    "isActiveN" INTEGER,
    motiveO TEXT,
    motiveN TEXT,
    "activeDateO" TEXT,
    "activeDateN" TEXT,
    "createDateO" TEXT,
    "createDateN" TEXT
);

-- Tabla visitor
CREATE TABLE visitor (
    dni INTEGER PRIMARY KEY,
    enterprice_id INTEGER,
    name TEXT,
    lastname TEXT,
    email TEXT,
    "startDate" TEXT,
    "finishDate" TEXT,
    "isActive" INTEGER,
    "createDate" TEXT,
    FOREIGN KEY(enterprice_id) REFERENCES enterprice(id)
);

-- Tabla visitor_history
CREATE TABLE "visitor_history" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dniO INTEGER,
    dniN INTEGER,
    enterprice_idO INTEGER,
    enterprice_idN INTEGER,
    nameO TEXT,
    nameN TEXT,
    lastnameO TEXT,
    lastnameN TEXT,
    emailO TEXT,
    emailN TEXT,
    "startDateO" TEXT,
    "startDateN" TEXT,
    "finishDateO" TEXT,
    "finishDateN" TEXT,
    "isActiveO" INTEGER,
    "isActiveN" INTEGER,
    "createDateO" TEXT,
    "createDateN" TEXT
);


-- Inserción de datos iniciales en Institute
INSERT INTO Institute (name, isActive, createDate) VALUES
    ('ICO', 1, '2023-06-22 10:00:00'),
    ('ICI', 1, '2023-06-22 10:00:00'),
    ('IDH', 1, '2023-06-22 10:00:00'),
    ('IDEI', 1, '2023-06-22 10:00:00');

-- Inserción de datos iniciales en Place
INSERT INTO Place (name, abbreviation, description, openTime, closeTime, isActive, createDate) VALUES
    ('Modulo 1', 'M1', 'Descripción del Módulo 1', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 2a', 'M2a', 'Descripción del Módulo 2a', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 2b', 'M2b', 'Descripción del Módulo 2b', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 3', 'M3', 'Descripción del Módulo 3', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 4', 'M4', 'Descripción del Módulo 4', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 5', 'M5', 'Descripción del Módulo 5', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 6', 'M6', 'Descripción del Módulo 6', '07:30', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 7', 'M7', 'Descripción del Módulo 7', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Modulo 9', 'M9', 'Descripción del Módulo 9', '07:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Multiespacio Cultural', 'MC', 'Descripción del Multiespacio Cultural', '10:00', '22:00', 1, '2023-06-22 10:00:00'),
    ('Anfiteatro', 'AFT', 'Descripción del Anfiteatro', '08:00', '20:00', 1, '2023-06-22 10:00:00'),
    ('Biblioteca', 'BIB', 'Descripción de la Biblioteca', '09:00', '18:00', 1, '2023-06-22 10:00:00');

-- Inserción de datos iniciales en Role
INSERT INTO Role (name, description, createDate, routingConnection, onlineLogin, offlineLogin, dayStartEnd, visitorAuthentication, visitorAuthorization, instituteConfiguration, entityABMs, systemReports, systemLog, exceptionLoading) VALUES
    ('seguridad', 'controla la seguridad de la institucion', '2023-06-22 10:00:00', 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0),
    ('Administrador tecnico', 'tecnico', '2023-06-22 10:00:00', 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0),
    ('RRHH', 'recurso humanos', '2023-06-22 10:00:00', 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1),
    ('Procesos automaticos', 'procesos que ocurren de manera automatica', '2023-06-22 10:00:00', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    ('Personal jerarquico', 'personal con mas jerarquia', '2023-06-22 10:00:00', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0);


INSERT INTO InstitutePlace (institute_id, place_id) VALUES
    ((SELECT id FROM Institute WHERE name = 'ICO'), (SELECT id FROM Place WHERE name = 'Modulo 6')),
    ((SELECT id FROM Institute WHERE name = 'ICO'), (SELECT id FROM Place WHERE name = 'Modulo 7')),
    ((SELECT id FROM Institute WHERE name = 'ICI'), (SELECT id FROM Place WHERE name = 'Modulo 2b')),
    ((SELECT id FROM Institute WHERE name = 'ICI'), (SELECT id FROM Place WHERE name = 'Modulo 7')),
    ((SELECT id FROM Institute WHERE name = 'IDEI'), (SELECT id FROM Place WHERE name = 'Modulo 4')),
    ((SELECT id FROM Institute WHERE name = 'IDEI'), (SELECT id FROM Place WHERE name = 'Modulo 7')),
    ((SELECT id FROM Institute WHERE name = 'IDH'), (SELECT id FROM Place WHERE name = 'Modulo 5')),
    ((SELECT id FROM Institute WHERE name = 'IDH'), (SELECT id FROM Place WHERE name = 'Modulo 7'));

PRAGMA foreign_keys = OFF;