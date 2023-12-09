
const usersRoles = [
    {
        role: "admin",
        priority: 5,
        allows: [ 
            { resource: "/admin/schools/add", permissions: "*" },  
            { resource: "/admin/schools/edit/:id", permissions: "*" }, 
        ]
    },
    {
        role: "director",
        priority: 4,
        allows: [
            { resource: "/admin/schools", permissions: "*" }, 
            { resource: "/admin/schools/myschool", permissions: "*" },  
            { resource: "/admin/schools/view/:id", permissions: "*" }, 
            { resource: "/admin/users", permissions: "*" }, // * to wszystkie metody jak get, post
            { resource: "/admin/users/add", permissions: "*" },
            { resource: "/admin/users/edit/:id", permissions: "*" },
            { resource: "/admin/users/view/:id", permissions: "*" },
            { resource: "/subjects/add", permissions: "*" }, 
            { resource: "/subjects/edit/:id", permissions: "*" },
        ]
    },
    {
        role: "teacher",
        priority: 3,
        allows: [
            { resource: "/teacher/mysubjects", permissions: "*" },
            { resource: "/subjects/view/:id/grades", permissions: "*" },
            { resource: "/subjects", permissions: "*" },
            { resource: "/subjects/view/:id", permissions: "*" },
            { resource: "/subjects/view/:id/addstudent", permissions: "*" },
            { resource: "/subjects/view/:subjectId/student/:studentId/addgrade", permissions: "*" },
            { resource: "/grades", permissions: "*" },
            { resource: "/grades/add", permissions: "*" },
            { resource: "/grades/view/:id", permissions: "*" },
            { resource: "/grades/edit/:id", permissions: "*" },
        ]
    },
    {
        role: "student",
        priority: 2,
        allows: [
            { resource: "/dashboard", permissions: ["post", "get"] },
            { resource: "/student/mysubjects", permissions: ["post", "get"] }
        ]
    },
    {
        priority: 1,
        role: "guest",
        allows: []
    }
];

const permissions = {
    usersRoles: usersRoles,
    addRoleParents: function(targetRole, sourceRole) {
        // kopiuje role z source do target czyli np admin ma dodatkowo role usera aby się nie powtarzać z urlami
        const targetData = this.usersRoles.find( v => v.role === targetRole ); // np obiekt z role admin
        const sourceData = this.usersRoles.find( v => v.role === sourceRole ); // np obiekt z role user

        targetData.allows = targetData.allows.concat( sourceData.allows );
    },
    isResourceAllowedForUser: function(userRole, resource, method) {
        // sprawdza czy user o określonej roli może mieć dostęp do resource
        // zwraca false jeśli nie ma dostępu, true jeśli ma dostęp
        const roleData = this.usersRoles.find( v => v.role === userRole );

        if (!roleData) return false; // brak dostępu bo nie ma takie roli obsługiwanej na serwerze
        
        const resourceData = roleData.allows.find( v => v.resource === resource );
        if (!resourceData) return false; // osoba o tej roli nie ma info o tym adresie więc nie ma dostępu
        if (!resourceData.permissions) return false; // nie ma dostępu bo nie ma opisanych dozwolonych metod

        if (!Array.isArray(resourceData.permissions)) {
            if (resourceData.permissions === "*") return true; // dostęp do wszystkich metod, może korzystać z url
            if (resourceData.permissions === method) return true; // ma dostęp do tej metody, więc może korzystać
        } else {
            // tablica
            if (resourceData.permissions.find(v => v === "*")) return true; // ma dostęp
            if (resourceData.permissions.find(v => v === method)) return true; // ma dostęp
        }

        return false; // brak dostępu
    },
    getPriorityByRole: function(role) {
        const user = this.usersRoles.find( v => v.role === role );
        if (user) return user.priority;

        return -1;
    }
};

permissions.addRoleParents("teacher", "student"); // teacher ma role user
permissions.addRoleParents("director", "teacher"); // director ma role teacher
permissions.addRoleParents("admin", "director"); // admin ma role director
//console.log("permissions:", JSON.stringify(permissions.usersRoles, null, 4));

// console.log( permissions.isResourceAllowedForUser("admin", "/dashboard", "get") ); // true
// console.log( permissions.isResourceAllowedForUser("admin", "/dashboard", "delete") ); // false
// console.log( permissions.isResourceAllowedForUser("admin", "/admin/users", "get") ); // true
// console.log( permissions.isResourceAllowedForUser("admin", "/api/data/10", "get") ); // false
// console.log( permissions.isResourceAllowedForUser("student", "/admin/users", "get") ); // false
// console.log( permissions.isResourceAllowedForUser("student", "/dashboard", "get") ); // true
// console.log( permissions.isResourceAllowedForUser("student", "/api/user/1", "get") ); // false
// console.log( permissions.isResourceAllowedForUser("guest", "/dashboard", "get") ); // false


export {
    permissions
};