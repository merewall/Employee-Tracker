USE companyDB;

INSERT INTO departments (name)
VALUES 
    ("Ministry of Magic"),
    ("Law Enforcement"),
    ("Accidents and Catastrophes"),
    ("Magical Creatures"),
    ("International Cooperation"),
    ("Transportation"),
    ("Games and Sports");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Minister of Magic", 300000, 1),
    ("Head Auror", 150000, 2),
    ("Auror", 100000, 2),
    ("Head of Misuse of Muggles", 80000, 2),
    ("Chief Warlock", 70000, 2),
    ("Obliviator", 50000, 3),
    ("Muggle Liaison", 40000, 3),
    ("Beast Handler", 40000, 4),
    ("Supreme Mugwump", 110000, 5),
    ("Head of Floo Network", 150000, 6),
    ("Floo Network Regulator", 60000, 6),
    ("Apparition Instructor", 40000, 6),
    ("Head of Games and Sports", 150000, 7),
    ("Quidditch Referee", 35000, 7),
    ("League Manager", 80000, 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Hermione', 'Granger', 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Harry', 'Potter', 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Ron', 'Weasley', 3, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Arthur', 'Weasley', 4, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Ulick', 'Gamp', 5, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Arnold', 'Peasegood', 6, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Myra', 'Curio', 7, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Newt', 'Scamander', 8, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Pierre', 'Bonaccord', 9, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Percy', 'Weasley', 10, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Madam', 'Edgecombe', 11, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Wilkie', 'Twycross', 12, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Ludo', 'Bagman', 13, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Victor', 'Krum', 15, 13);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Madame', 'Hooch', 14, 14);

