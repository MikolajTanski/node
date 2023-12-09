
import { UsersController } from "./UsersController.js";
import { SchoolsController } from "./SchoolsController.js";
import { GradesController } from "./GradesController.js";
import { SubjectsController } from "./SubjectsController.js";

import { User, School, Subject, Grade } from "../models/schemas.js";

const schoolsController = new SchoolsController();
const usersController = new UsersController();
const subjectsController = new SubjectsController();
const gradesController = new GradesController();

const adminDb = await usersController.createUser({
    name: "Admin",
    surname: "Admin",
    password: "test",
    email: "admin@example.com",
    role: "admin"
});

const schoolDb = await schoolsController.createSchool({
    name: "University #001",
    address: "Wilcza 7, 00-001 Warszawa"
});
console.log("schoolDb:", schoolDb.dataValues);


const schoolDb2 = await schoolsController.createSchool({
    name: "University #002",
    address: "Ujazdowskie 23, 00-401 Warszawa"
});

const schoolDb3 = await schoolsController.createSchool({
    name: "University #003",
    address: "Marszałkowska 1, 00-101 Warszawa"
});

const directorDb = await usersController.createUser({
        name: "Adam",
        surname: "Adamski",
        email: "director@example.com",
        password: "test",
        role: "director"
    },
    schoolDb
);
await schoolsController.setDirector(schoolDb,directorDb);
//await usersController.setSchool(directorDb, schoolDb); 
console.log("directorDb:", directorDb.dataValues);

const directorWithSchoolFromDb = await User.findOne({
    where: { id: directorDb.id },
    include: [
        { model: School }
    ]
});
console.log("Director with school:", JSON.stringify(directorWithSchoolFromDb, null, 4));


const directorDb2 = await usersController.createUser({
        name: "Katarzyna",
        surname: "Barska",
        email: "director2@example.com",
        password: "test",
        role: "director"
    },
    schoolDb2
);
await schoolsController.setDirector(schoolDb2, directorDb2);

const teacherDb = await usersController.createUser({
        name: "Alina",
        surname: "Kowalska",
        email: "teacher@example.com",
        password: "test",
        role: "teacher"
    },
    schoolDb
);
console.log("teacher: ", teacherDb.dataValues);


const teacherDb2 = await usersController.createUser({
        name: "Halinka",
        surname: "Halińska",
        email: "halina@example.com",
        password: "test",
        role: "teacher"
    },
    schoolDb
);

const student1 = await usersController.createUser({
        name: "Kasia",
        surname: "Kasińska",
        email: "student1@example.com",
        password: "test",
        role: "student"
    },
    schoolDb
);
console.log("student: ", student1.dataValues);

const student2 = await usersController.createUser({
        name: "Karol",
        surname: "Karolski",
        email: "student2@example.com",
        password: "test",
        role: "student"
    },
    schoolDb
);
console.log("student: ", student2.dataValues);

const student3 = await usersController.createUser({
        name: "Daniel",
        surname: "Danielski",
        email: "student3@example.com",
        password: "test",
        role: "student"
    },
    schoolDb
);


const subject1 = await subjectsController.createSubject({
        name: "Math"
    },
    teacherDb,
    schoolDb
);

await subjectsController.addUserToSubject(student1, subject1);
await subjectsController.addUserToSubject(student2, subject1);


const subject2 = await subjectsController.createSubject({
        name: "Eng"
    },
    teacherDb2,
    schoolDb
);

await subjectsController.addUserToSubject(student2, subject2);
await subjectsController.addUserToSubject(student3, subject2);

const grade1 = await gradesController.createGrade({
        grade: 5.0,
        description: "great work!"
    },
    student1,
    teacherDb,
    subject1,
    schoolDb
);

const grade2 = await gradesController.createGrade({
        grade: 4.5,
        description: "good work!"
    },
    student2,
    teacherDb,
    subject1,
    schoolDb
);


// subject3 
const subject3 = await subjectsController.createSubject({
        name: "Programming"
    },
    teacherDb,
    schoolDb
);

await subjectsController.addUserToSubject(student2, subject3);
await subjectsController.addUserToSubject(student3, subject3);

const grade3 = await gradesController.createGrade({
        grade: 4.0,
        description: "ok!"
    },
    student2,
    teacherDb,
    subject3,
    schoolDb
);

const grade4 = await gradesController.createGrade({
        grade: 5.0,
        description: "great!"
    },
    student2,
    teacherDb,
    subject3,
    schoolDb
);

const grade5 = await gradesController.createGrade({
        grade: 5.5,
        description: "amazing!"
    },
    student3,
    teacherDb,
    subject3,
    schoolDb
);




const schoolAllData = await School.findOne({
    where: { id: schoolDb.id },
    include: [
        { model: User, as: "director" },
        { model: User },
        { 
            model: Subject,
            include: [
                { 
                    model: User,
                    include: [
                        {
                            model: Grade,
                            include: [{ model: User, as: "teacher" }]
                        }
                    ]
                },
                { model: User, as: "teacher" }
            ]
        }
    ]
});

console.log("School all data:", JSON.stringify(schoolAllData, null, 4));








export {
    schoolsController,
    usersController,
    subjectsController,
    gradesController
};