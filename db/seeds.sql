INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Salesperson', 75000, 1),
    ('Software Engineer', 85000, 2),
    ('Accountant', 125000, 3),
    ('Lawyer', 200000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Sydney', 'Loggins', 2, 4),
    ('Jane', 'Doe', 2, 3),
    ('John', 'Smith', 3, 1),
    ('Jane', 'Smith', 4, 5);